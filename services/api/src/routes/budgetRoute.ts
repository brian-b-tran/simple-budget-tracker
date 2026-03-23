import { Router } from 'express';
import {
  getBudgetController,
  getAllBudgetsController,
  createBudgetController,
  updateBudgetController,
  deleteBudgetController,
} from '../controllers/budgetController';
import { authMiddleware } from '../middleware/authMiddleware';

const budgetRouter = Router();
budgetRouter.get('/', authMiddleware, getAllBudgetsController);
budgetRouter.get('/:id', authMiddleware, getBudgetController);
budgetRouter.post('/', authMiddleware, createBudgetController);
budgetRouter.put('/:id', authMiddleware, updateBudgetController);
budgetRouter.delete('/:id', authMiddleware, deleteBudgetController);

export default budgetRouter;
