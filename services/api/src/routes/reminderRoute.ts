import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getReminderController,
  getAllRemindersController,
  createReminderController,
  updateReminderController,
  deleteReminderController,
  getUpcomingRemindersController,
} from '../controllers/reminderController';

const reminderRouter = Router();

reminderRouter.get('/', authMiddleware, getAllRemindersController);
reminderRouter.get('/upcoming', authMiddleware, getUpcomingRemindersController);
reminderRouter.get('/:id', authMiddleware, getReminderController);

reminderRouter.post('/', authMiddleware, createReminderController);
reminderRouter.put('/:id', authMiddleware, updateReminderController);
reminderRouter.delete('/:id', authMiddleware, deleteReminderController);

export default reminderRouter;
