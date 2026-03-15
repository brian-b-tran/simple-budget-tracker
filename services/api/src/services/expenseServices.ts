import prisma from '../config/db';
import { Expense } from '../../generated/prisma/client';

import type {
  UpdateExpenseInput,
  CreateExpenseInput,
  FilterExpenseInput,
} from '../validators/expenseValidators';
import { PaginatedExpenses } from '../types/expense';

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
    throw new Error('Error: could not find this expense.');
  }
  return expense;
}

export async function createExpenseService(
  userId: string,
  data: CreateExpenseInput
): Promise<Expense> {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId, userId: userId },
  });

  if (!category) {
    throw new Error('Category not found.');
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
      amountBase: data.amountBase,
      exchangeRateUsed: data.exchangeRateUsed,
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
  data: UpdateExpenseInput
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
): Promise<PaginatedExpenses> {
  const where = {
    userId: userId,
    ...(filters.categoryId && { categoryId: filters.categoryId }),
    ...(filters.type && { type: filters.type }),
    ...(filters.budgetId && { budgetId: filters.budgetId }),
    ...(filters.startDate &&
      filters.endDate && {
        date: { gte: filters.startDate, lte: filters.endDate },
      }),
    ...(filters.minAmount &&
      filters.maxAmount && {
        amountOriginal: { gte: filters.minAmount, lte: filters.maxAmount },
      }),
  };

  const [filteredExpenses, total] = await Promise.all([
    prisma.expense.findMany({
      where: where,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.expense.count({
      where: where,
    }),
  ]);

  const pages: PaginatedExpenses = {
    expenses: filteredExpenses,
    limit: filters.limit,
    total: total,
    page: filters.page,
    totalPages: Math.ceil(total / filters.limit),
  };

  return pages;
}
