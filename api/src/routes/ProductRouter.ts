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

    query('category').exists(),

    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req);

      const categoryId = new ObjectId(params.category);

      const categories = await productModel.getAll(categoryId);

      res.json(categories);
    },
  );

  /**
   * Update a product
   */
  router.patch(
    '/:productId',

    param('productId').exists(),
    body('price').optional(),
    body('description').optional(),

    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req, { locations: ['params'] });
      const updateFields = matchedData(req, { locations: ['body'] });

      const productId = new ObjectId(params.productId);

      const updatedProduct = await productModel.update(productId, updateFields);

      res.json(updatedProduct);
    },
  );

  /**
   * Create a product
   */
  router.post(
    '/',

    body('name').isLength({ min: 1 }).exists(),
    body('price').isNumeric().toFloat().exists(),
    body('description').isLength({ min: 1 }).exists(),
    body('categories').exists(),

    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req);

      console.log(req.body);
      console.log(params);

      const categoryObjectIds = params.categories.map((category) => new ObjectId(category));

      const product = await productModel.create(params.name, params.price, params.description, categoryObjectIds);

      res.json(product);
    },
  );

  return router;
}

export default ProductRouterFactory;
