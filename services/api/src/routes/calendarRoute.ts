import { Router } from 'express';
import { getCalendarFeedController } from '../controllers/calendarController';
import { authMiddleware } from '../middleware/authMiddleware';

const calendarRouter = Router();

calendarRouter.get('/', authMiddleware, getCalendarFeedController);

export default calendarRouter;
