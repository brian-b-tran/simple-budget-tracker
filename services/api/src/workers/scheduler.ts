import cron from 'node-cron';
import { recurringExpenseWorker } from './recurringExpenseWorker';

export const recurringExpenseScheduler = cron.schedule(
  '0 * * * *',
  async () => {
    try {
      await recurringExpenseWorker();
    } catch (error) {
      console.error('Recurring expense worker failed:', error);
    }
  }
);
