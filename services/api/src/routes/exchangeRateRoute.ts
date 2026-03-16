import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getExchangeRateController,
  getMultiExchangeRatesController,
} from '../controllers/exchangeRateController';

const exchangeRouter = Router();

exchangeRouter.get('/', authMiddleware, getMultiExchangeRatesController); //requires query parameters
exchangeRouter.get('/:base/:target', authMiddleware, getExchangeRateController);

export default exchangeRouter;
