import { query, param, body } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import { Router } from 'express';

import validators from '../middleware/validators';
import ProductModel from '../models/Product';
import { ObjectId } from 'mongodb';

function ProductRouterFactory(productModel: ProductModel): Router {
  const router = Router();

  /**
   * Get all products in a category
   */
  router.get(
    '/',

    // ObjectId of an existing category
    validators.isObjectIdHex(query('category')).optional(),

    // Validate input
    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req);

      const categoryId = params.category ? new ObjectId(params.category) : undefined;

      const categories = await productModel.getAll(categoryId);

      res.json(categories);
    },
  );

  /**
   * Update a product
   */
  router.patch(
    '/:productId',

    // ObjectId of existing product
    validators.isObjectIdHex(param('productId')).exists(),

    // New product price
    validators.product.price(body('price')).optional(),

    // New product description
    validators.product.description(body('description')).optional(),

    // Validate input
    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req, { locations: ['params'] });
      const updateFields = matchedData(req, { locations: ['body'] });

      const productId = new ObjectId(params.productId);

      const updatedProduct = await productModel.update(productId, updateFields);

      // Send the updated product object
      res.json(updatedProduct);
    },
  );

  /**
   * Create a product
   */
  router.post(
    '/',

    // Product name
    validators.product.name(body('name')).exists(),

    // Product price
    validators.product.price(body('price')).exists(),

    // Product description
    validators.product.description(body('description')).exists(),

    // Product categories
    validators.product.categories(body('categories')).exists(),

    // Validate input
    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req);

      const categoryObjectIds = params.categories.map((category) => new ObjectId(category));

      const product = await productModel.create(params.name, params.price, params.description, categoryObjectIds);

      // Send the new product object
      res.json(product);
    },
  );

  return router;
}

export default ProductRouterFactory;
