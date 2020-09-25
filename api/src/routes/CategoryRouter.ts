import { query, body } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import { Router } from 'express';

import validators from '../middleware/validators';
import CategoryModel from '../models/Category';
import { ObjectId } from 'bson';

function CategoryRouterFactory(categoryModel: CategoryModel): Router {
  const router = Router();

  /**
   * Get all categories
   */
  router.get('/', async (req, res) => {
    const categories = await categoryModel.getAll();

    res.json(categories);
  });

  /**
   * Create a category
   */
  router.post(
    '/',

    // Name of the new category
    body('name').isLength({ min: 1 }).exists(),

    // Optional objectId of an existing category to serve as parent for new category
    validators.isObjectIdHex(body('parentId')).optional(),

    // Validate input
    validators.handleErrors,

    async (req, res) => {
      const params = matchedData(req);

      const parentId = params.parentId ? new ObjectId(params.parentId) : null;

      const category = await categoryModel.create(params.name, parentId);

      res.json(category);
    },
  );

  return router;
}

export default CategoryRouterFactory;
