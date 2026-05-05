import prisma from '../config/db';
import { Expense } from '../../generated/prisma/client';

import type {
  UpdateExpenseBackendInput,
  CreateExpenseBackendInput,
  FilterExpenseInput,
  PaginatedResponse,
  RangeKey,
} from '@expense-app/types';
import { getExchangeRateService } from './exchangeRateService';
import { getDateRange } from '@expense-app/shared';
export async function getAllExpensesService(
  userId: string
): Promise<Array<Expense>> {
  const expenses = await prisma.expense.findMany({
    where: {
      userId: userId,
    },
  });

  return expenses;
}

export async function getExpenseService(
  userId: string,
  expenseId: string
): Promise<Expense> {
  const expense = await prisma.expense.findUnique({
    where: {
      userId: userId,
      id: expenseId,
    },
  });
  if (!expense) {
    throw new Error('Could not find this expense.');
  }
  return expense;
}

export async function createExpenseService(
  userId: string,
  data: CreateExpenseBackendInput
): Promise<Expense> {
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
      data.currencyOriginal,
      user.currency!
    );
    exchangeRateUsed = rate.rate;
    amountBase = exchangeRateUsed.mul(data.amountOriginal).toNumber();
  }

  const newExpense = await prisma.expense.create({
    data: {
      userId: userId,
      amountOriginal: data.amountOriginal,
      categoryId: data.categoryId,
      type: data.type,
      date: data.date,
      time: data.time,
      currencyOriginal: data.currencyOriginal,
      amountBase: amountBase,
      exchangeRateUsed: exchangeRateUsed,
      budgetId: data.budgetId,
      recurringExpenseId: data.recurringExpenseId,
      notes: data.notes,
    },
  });

  return newExpense;
}

export async function updateExpenseService(
  userId: string,
  expenseId: string,
  data: UpdateExpenseBackendInput
): Promise<Expense> {
  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId, userId: userId },
    });

    if (!category) {
      throw new Error('Category not found.');
    }
  }
  const oldExpense = await prisma.expense.findUnique({
    where: { id: expenseId, userId: userId },
  });
  if (!oldExpense) {
    throw new Error('Expense not found.');
  }
  const newExpense = await prisma.expense.update({
    where: { id: expenseId, userId: userId },
    data: {
      ...(data.amountOriginal && { amountOriginal: data.amountOriginal }),
      ...(data.categoryId && { categoryId: data.categoryId }),
      ...(data.date && { date: data.date }),
      ...(data.time && { time: data.time }),
      ...(data.type && { type: data.type }),
      ...(data.currencyOriginal && { currencyOriginal: data.currencyOriginal }),
      ...(data.amountBase && { amountBase: data.amountBase }),
      ...(data.exchangeRateUsed && { exchangeRateUsed: data.exchangeRateUsed }),
      ...(data.budgetId !== undefined && { budgetId: data.budgetId }),
      ...(data.recurringExpenseId !== undefined && {
        recurringExpenseId: data.recurringExpenseId,
      }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });
  return newExpense;
}

export async function deleteExpenseService(
  userId: string,
  expenseId: string
): Promise<Expense> {
  const oldExpense = await prisma.expense.findUnique({
    where: { id: expenseId, userId: userId },
  });
  if (!oldExpense) {
    throw new Error('Expense not found.');
  }
  const expense = await prisma.expense.delete({
    where: { userId: userId, id: expenseId },
  });

  return expense;
}

export async function filterExpenseService(
  userId: string,
  filters: FilterExpenseInput
): Promise<PaginatedResponse<Expense>> {
  let dateFilter = {};

  if (filters.range && filters.timeZone) {
    const { start, end } = getDateRange(filters.range, filters.timeZone);

    dateFilter = {
      date: {
        gte: start,
        lte: end,
      },
    };
  } else if (filters.startDate && filters.endDate) {
    dateFilter = {
      date: {
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

  const [filteredExpenses, total] = await Promise.all([
    prisma.expense.findMany({
      where: where,
      orderBy: [{ [filters.sortBy]: filters.sortOrder }, { id: 'desc' }],
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.expense.count({
      where: where,
    }),
  ]);

  const pages: PaginatedResponse<Expense> = {
    data: filteredExpenses,
    limit: filters.limit,
    total: total,
    page: filters.page,
    totalPages: Math.ceil(total / filters.limit),
  };

  return pages;
}

export async function getExpenseTotalsService(
  userId: string,
  timeZone: string
) {
  const ranges: RangeKey[] = ['today', 'week', 'month', 'year'];

  const results = await Promise.all(
    ranges.map(async (range) => {
      const { start, end } = getDateRange(range, timeZone);

      const res = await prisma.expense.aggregate({
        where: {
          userId,
          date: { gte: start, lte: end },
        },
        _sum: { amountOriginal: true },
      });

      return [range, Number(res._sum.amountOriginal ?? 0)] as const;
    })
  );

  return Object.fromEntries(results);
}
