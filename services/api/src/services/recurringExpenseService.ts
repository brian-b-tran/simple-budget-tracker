import prisma from '../config/db';
import { RecurringExpense } from '../../generated/prisma/client';
import type {
  CreateRecurringExpenseBackendInput,
  UpdateRecurringExpenseBackendInput,
} from '@expense-app/types';

export async function getRecurringExpenseService(
  userId: string,
  recurringId: string
): Promise<RecurringExpense> {
  const recurringExpense = await prisma.recurringExpense.findUnique({
    where: { id: recurringId, userId: userId },
  });

  if (!recurringExpense) {
    throw new Error('Expense not found.');
  }

  return recurringExpense;
}

export async function getAllRecurringExpenseService(
  userId: string
): Promise<Array<RecurringExpense>> {
  const allRecurringExpenses = await prisma.recurringExpense.findMany({
    where: { userId: userId },
  });

  return allRecurringExpenses;
}

export async function createRecurringExpenseService(
  userId: string,
  data: CreateRecurringExpenseBackendInput
): Promise<RecurringExpense> {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId, userId: userId },
  });

  if (!category) {
    throw new Error('Category not found.');
  }
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new Error('User not found. How did you get here?');
  }
  if (!user.currency) {
    throw new Error('User has no base currency set.');
  }
  const newRecurringExpense = await prisma.recurringExpense.create({
    data: {
      userId: userId,
      amountOriginal: data.amountOriginal,
      currencyOriginal: data.currencyOriginal
        ? data.currencyOriginal
        : user.currency,
      categoryId: data.categoryId,
      frequency: data.frequency,
      interval: data.interval,
      startDate: data.startDate,
      endDate: data.endDate,
      budgetId: data.budgetId,
      notes: data.notes,
      type: data.type,
      nextRunDate: data.startDate,
    },
  });

  return newRecurringExpense;
}

export async function updateRecurringExpenseService(
  userId: string,
  recurringId: string,
  data: UpdateRecurringExpenseBackendInput
): Promise<RecurringExpense> {
  const oldRecurringExpense = await prisma.recurringExpense.findUnique({
    where: { id: recurringId, userId: userId },
  });
  if (!oldRecurringExpense) {
    throw new Error('Expense not found.');
  }

  const updatedRecurringExpense = await prisma.recurringExpense.update({
    where: { id: recurringId, userId: userId },
    data: {
      ...(data.amountOriginal && { amountOriginal: data.amountOriginal }),
      ...(data.currencyOriginal && { currencyOriginal: data.currencyOriginal }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.frequency && { frequency: data.frequency }),
      ...(data.interval && { interval: data.interval }),
      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
      ...(data.budgetId && { budgetId: data.budgetId }),
      ...(data.notes && { notes: data.notes }),
      ...(data.type && { type: data.type }),
      ...(data.startDate && { nextRunDate: data.startDate }),
    },
  });

  return updatedRecurringExpense;
}

export async function deleteRecurringExpenseService(
  userId: string,
  recurringId: string
): Promise<RecurringExpense> {
  const toDelete = await prisma.recurringExpense.findUnique({
    where: { id: recurringId, userId: userId },
  });

  if (!toDelete) {
    throw new Error('Expense not found.');
  }

  const deleted = await prisma.recurringExpense.delete({
    where: { id: recurringId, userId: userId },
  });

  return deleted;
}
