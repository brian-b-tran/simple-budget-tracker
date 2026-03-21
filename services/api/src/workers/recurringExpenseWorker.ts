import { RecurringExpense } from '../../generated/prisma/client';
import { addDays, addMonths, addYears } from 'date-fns';
import prisma from '../config/db';
import { getExchangeRateService } from '../services/exchangeRateService';
import logger from '../utils/logger';
import { withRetry } from '../utils/retry';

function calculateNextRunDate(recurringExpense: RecurringExpense): Date {
  const oldRunDate = recurringExpense.nextRunDate;
  let newRunDate = recurringExpense.nextRunDate;
  switch (recurringExpense.frequency) {
    case 'DAILY':
      newRunDate = addDays(
        recurringExpense.nextRunDate,
        1 * recurringExpense.interval
      );
      break;
    case 'WEEKLY':
      newRunDate = addDays(
        recurringExpense.nextRunDate,
        7 * recurringExpense.interval
      );
      break;
    case 'BIWEEKLY':
      newRunDate = addDays(
        recurringExpense.nextRunDate,
        14 * recurringExpense.interval
      );
      break;

    case 'MONTHLY':
      newRunDate = addMonths(
        recurringExpense.nextRunDate,
        recurringExpense.interval
      );
      break;
    case 'QUARTERLY':
      newRunDate = addMonths(
        recurringExpense.nextRunDate,
        3 * recurringExpense.interval
      );
      break;
    case 'YEARLY':
      newRunDate = addYears(
        recurringExpense.nextRunDate,
        recurringExpense.interval
      );
      break;
    default:
      newRunDate = recurringExpense.nextRunDate;
  }
  logger.info(
    `Recurring Expense: ${recurringExpense.id} nextRunDate updated from ${oldRunDate} to ${newRunDate} with a frequency of ${recurringExpense.frequency} and an interval of ${recurringExpense.interval}`
  );
  return newRunDate;
}

export async function recurringExpenseWorker(): Promise<
  Array<RecurringExpense>
> {
  logger.info('Fetching recurring expenses.');
  const expensesToRecur = await prisma.recurringExpense.findMany({
    where: {
      nextRunDate: { lte: new Date() },
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
  });
  logger.info(`Found ${expensesToRecur.length} expenses set to recur.`);

  await Promise.all(
    expensesToRecur.map(async (toRecur) => {
      try {
        await withRetry(() =>
          prisma.$transaction(async (tx) => {
            const user = await tx.user.findUnique({
              where: { id: toRecur.userId },
            });
            if (!user) {
              throw new Error('User not found. How did you get here?');
            }
            if (!user.currency) {
              throw new Error('User has no base currency set.');
            }
            let amountBase = toRecur.amountOriginal;
            let exchangeRateUsed = 1;
            if (user.currency !== toRecur.currencyOriginal) {
              const rate = await getExchangeRateService(
                toRecur.currencyOriginal,
                user.currency
              );
              exchangeRateUsed = rate.rate.toNumber();
              amountBase = rate.rate.mul(toRecur.amountOriginal);
            }

            const newExpense = await tx.expense.create({
              data: {
                userId: toRecur.userId,
                amountOriginal: toRecur.amountOriginal,
                categoryId: toRecur.categoryId,
                type: toRecur.type,
                date: toRecur.nextRunDate,
                time: toRecur.nextRunDate,
                currencyOriginal: toRecur.currencyOriginal,
                amountBase: amountBase,
                exchangeRateUsed: exchangeRateUsed,
                budgetId: toRecur.budgetId,
                recurringExpenseId: toRecur.id,
                notes: toRecur.notes,
              },
            });
            logger.info(`New expense generated from recurring Expense`, {
              expenseId: newExpense.id,
              recurringExpenseId: toRecur.id,
              userId: toRecur.userId,
              amount: newExpense.amountOriginal.toString(),
            });

            await tx.recurringExpense.update({
              where: { userId: toRecur.userId, id: toRecur.id },
              data: { nextRunDate: calculateNextRunDate(toRecur) },
            });
          })
        );
      } catch (error) {
        logger.error('Failed to process recurring expense', {
          recurringExpenseId: toRecur.id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    })
  );

  return expensesToRecur;
}
