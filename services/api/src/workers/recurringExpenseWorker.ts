import { RecurringExpense } from '../../generated/prisma/client';
import { addDays, addMonths, addYears } from 'date-fns';
import prisma from '../config/db';
import { getExchangeRateService } from '../services/exchangeRateService';

function calculateNextRunDate(recurringExpense: RecurringExpense): Date {
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

  return newRunDate;
}

export async function recurringExpenseWorker(): Promise<
  Array<RecurringExpense>
> {
  const expensesToRecur = await prisma.recurringExpense.findMany({
    where: {
      nextRunDate: { lte: new Date() },
      OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
    },
  });

  await Promise.all(
    expensesToRecur.map(async (toRecur) => {
      await prisma.$transaction(async (tx) => {
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
        await tx.expense.create({
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
        await tx.recurringExpense.update({
          where: { userId: toRecur.userId, id: toRecur.id },
          data: { nextRunDate: calculateNextRunDate(toRecur) },
        });
      });
    })
  );

  return expensesToRecur;
}
