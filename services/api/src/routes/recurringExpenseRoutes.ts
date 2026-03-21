import { Router } from 'express';
import {
  getRecurringExpenseController,
  getAllRecurringExpenseController,
  createRecurringExpenseController,
  updateRecurringExpenseController,
  deleteRecurringExpenseController,
} from '../controllers/recurringExpenseController';
import { authMiddleware } from '../middleware/authMiddleware';

const recurringRouter = Router();

recurringRouter.get('/', authMiddleware, getAllRecurringExpenseController);
recurringRouter.get('/:id', authMiddleware, getRecurringExpenseController);
recurringRouter.post('/', authMiddleware, createRecurringExpenseController);
recurringRouter.put('/:id', authMiddleware, updateRecurringExpenseController);
recurringRouter.delete(
  '/:id',
  authMiddleware,
  deleteRecurringExpenseController
);

export default recurringRouter;
