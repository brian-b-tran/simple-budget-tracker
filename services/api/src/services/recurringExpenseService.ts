import prisma from '../config/db';
import { RecurringExpense } from '../../generated/prisma/client';
import type {
  CreateRecurringExpenseBackendInput,
  FilterExpenseInput,
  PaginatedResponse,
  UpdateRecurringExpenseBackendInput,
} from '@expense-app/types';
import { getExchangeRateService } from './exchangeRateService';
import { getDateRange } from '@expense-app/shared';

export async function getRecurringExpenseService(
  userId: string,
  recurringId: string
): Promise<RecurringExpense> {
  const recurringExpense = await prisma.recurringExpense.findUnique({
    where: { id: recurringId, userId: userId },
    include: {
      category: { select: { name: true } },
      budget: { select: { name: true } },
    },
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
    include: {
      category: { select: { name: true } },
      budget: { select: { name: true } },
    },
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
  let amountBase;
  let exchangeRateUsed;

  if (user.currency === data.currencyOriginal) {
    amountBase = data.amountOriginal;
    exchangeRateUsed = 1;
  } else {
    const rate = await getExchangeRateService(
      data.currencyOriginal ?? user.currency,
      user.currency!
    );
    exchangeRateUsed = rate.rate;
    amountBase = exchangeRateUsed.mul(data.amountOriginal).toNumber();
  }

  const [newRecurringExpense] = await prisma.$transaction(async (tx) => {
    const recurringExpense = await tx.recurringExpense.create({
      data: {
        userId: userId,
        amountOriginal: data.amountOriginal,
        currencyOriginal: data.currencyOriginal
          ? data.currencyOriginal
          : user.currency!,
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

    await tx.expense.create({
      data: {
        userId: userId,
        amountOriginal: recurringExpense.amountOriginal,
        currencyOriginal: recurringExpense.currencyOriginal,
        categoryId: recurringExpense.categoryId,
        budgetId: recurringExpense.budgetId,
        recurringExpenseId: recurringExpense.id,
        notes: recurringExpense.notes,
        date: data.startDate,
        time: data.startDate,
        type: recurringExpense.type,
        amountBase: amountBase,
        exchangeRateUsed: exchangeRateUsed,
      },
    });

    return [recurringExpense];
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

export async function filterRecurringExpenseService(
  userId: string,
  filters: FilterExpenseInput
): Promise<PaginatedResponse<RecurringExpense>> {
  let dateFilter = {};

  if (filters.range && filters.timeZone) {
    const { start, end } = getDateRange(filters.range, filters.timeZone);

    dateFilter = {
      nextRunDate: {
        gte: start,
        lte: end,
      },
    };
  } else if (filters.startDate && filters.endDate) {
    dateFilter = {
      nextRunDate: {
        gte: filters.startDate,
        lte: filters.endDate,
      },
    };
  }

  const where = {
    userId: userId,
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.type && { type: filters.type }),
    ...(filters.budgetId && { budgetId: filters.budgetId }),
    ...(filters.minAmount != null &&
      filters.maxAmount != null && {
        amountOriginal: {
          gte: filters.minAmount,
          lte: filters.maxAmount,
        },
      }),
    ...dateFilter,
  };
  const order =
    filters.sortBy === 'amount'
      ? 'amountOriginal'
      : filters.sortBy === 'date'
        ? 'nextRunDate'
        : 'createdAt';

  const [filteredExpenses, total] = await Promise.all([
    prisma.recurringExpense.findMany({
      where: where,
      orderBy: [{ [order]: filters.sortOrder }, { id: 'desc' }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      include: {
        category: { select: { name: true } },
        budget: { select: { name: true } },
      },
    }),
    prisma.recurringExpense.count({
      where: where,
    }),
  ]);

  const pages: PaginatedResponse<RecurringExpense> = {
    data: filteredExpenses,
    limit: filters.limit,
    total: total,
    page: filters.page,
    totalPages: Math.ceil(total / filters.limit),
  };

  return pages;
}
