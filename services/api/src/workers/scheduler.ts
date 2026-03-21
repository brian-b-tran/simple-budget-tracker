import cron from 'node-cron';
import { recurringExpenseWorker } from './recurringExpenseWorker';
import {
  cleanupExpiredSessions,
  cleanupOldExchangeRates,
} from './cleanupWorker';
import logger from '../utils/logger';
export const recurringExpenseScheduler = cron.schedule(
  '0 * * * *',
  async () => {
    try {
      logger.info('Now running recurring expense worker.');
      await recurringExpenseWorker();
    } catch (error) {
      logger.error('Recurring expense worker failed:', error);
    }
  }
);

export const cleanUpSessionsScheduler = cron.schedule('0 0 * * *', async () => {
  try {
    logger.info('Now running sessions cleanup worker.');
    await cleanupExpiredSessions();
  } catch (error) {
    logger.error('Sessions cleanup worker failed:', error);
  }
});

export const cleanUpExchangeRatesScheduler = cron.schedule(
  '0 0 * * 0',
  async () => {
    try {
      logger.info('Now running exchange rate cleanup worker.');
      await cleanupOldExchangeRates();
    } catch (error) {
      logger.error('Exchange rate worker failed:', error);
    }
  }
);
