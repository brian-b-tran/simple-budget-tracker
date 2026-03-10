import { Router } from 'express';
import {
  getAllCategoryController,
  deleteCategoryController,
  createCategoryController,
  updateCategoryController,
} from '../controllers/categoryController';
import { authMiddleware } from '../middleware/authMiddleware';

const categoryRouter = Router();

categoryRouter.get('/', authMiddleware, getAllCategoryController);
categoryRouter.post('/', authMiddleware, createCategoryController);
categoryRouter.put('/:id', authMiddleware, updateCategoryController);
categoryRouter.delete('/:id', authMiddleware, deleteCategoryController);

export default categoryRouter;
