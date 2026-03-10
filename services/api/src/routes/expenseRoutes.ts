import { Router } from 'express';
import {
  getAllExpensesController,
  getExpenseController,
  createExpenseController,
  updateExpenseController,
  deleteExpenseController,
} from '../controllers/expenseController';
import { authMiddleware } from '../middleware/authMiddleware';

const expenseRouter = Router();

expenseRouter.get('/', authMiddleware, getAllExpensesController);
expenseRouter.get('/:id', authMiddleware, getExpenseController);
expenseRouter.post('/', authMiddleware, createExpenseController);
expenseRouter.put('/:id', authMiddleware, updateExpenseController);
expenseRouter.delete('/:id', authMiddleware, deleteExpenseController);

export default expenseRouter;
