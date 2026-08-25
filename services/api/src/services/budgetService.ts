import prisma from '../config/db';
import { Budget, Prisma } from '../../generated/prisma/client';
import {
  CreateBudgetBackendInput,
  UpdateBudgetBackendInput,
} from '@expense-app/types';
import type {
  BudgetSummary,
  BudgetCategoryBreakdown,
  BudgetDetail,
} from '../types/budget';
import { filterExpenseService } from './expenseService';

export async function getBudgetService(
  userId: string,
  budgetId: string
): Promise<BudgetSummary> {
  const budget = await prisma.budget.findUnique({
    where: { id: budgetId, userId: userId },
  });
  if (!budget) {
    throw new Error('Could not find this budget.');
  }

  const [expenseSumAggregate, CategoryGroups] = await Promise.all([
    //total spent for all expenses
    prisma.expense.aggregate({
      where: { userId: userId, budgetId: budget.id, type: 'EXPENSE' },
      _sum: { amountBase: true },
    }),
    //total spent grouped by category
    prisma.expense.groupBy({
      by: ['categoryId'],
      where: { budgetId: budgetId, userId: userId, type: 'EXPENSE' },
      _sum: { amountBase: true },
    }),
  ]);
  //total spent, remaining and percentage for all expenses
  const totalSpent =
    expenseSumAggregate._sum.amountBase ?? new Prisma.Decimal(0);
  const remaining = budget.totalAmount.sub(totalSpent);
  const percentage = totalSpent.div(budget.totalAmount).times(100);

  //find the categories to create BudgetCategoryBreakdowns
  const categoryIds = CategoryGroups.map((group) => group.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });

  //combine group by category amounts spent with categories to create BudgetCategoryBreakdowns
  const categoryBreakdownArray = CategoryGroups.map(
    (group): BudgetCategoryBreakdown => {
      const category = categories.find(
        (category) => category.id === group.categoryId
      );
      if (!category) {
        throw new Error('Something Crazy went wrong internally.');
      }
      //total, remaining and percentage for each category
      const totalGroupAmount = group._sum.amountBase ?? new Prisma.Decimal(0);
      const groupPercentage = totalGroupAmount
        .div(budget.totalAmount)
        .times(100);

      //categoryBreakdown object
      return {
        categoryId: category.id,
        categoryName: category.name,
        spent: totalGroupAmount.toNumber(),
        percentageOfTotal: groupPercentage.toNumber(),
      };
    }
  );

  return {
    ...budget,
    totalSpent: totalSpent.toNumber(),
    remaining: remaining.toNumber(),
    percentageUsed: percentage.toNumber(),
    categoryBreakdown: categoryBreakdownArray,
  };
}

export async function getBudgetDetailService(
  userId: string,
  budgetId: string
): Promise<BudgetDetail> {
  const budget = await getBudgetService(userId, budgetId);

  const expenses = await filterExpenseService(userId, {
    page: 1,
    limit: 100,
    sortBy: 'date',
    sortOrder: 'desc',
    startDate: budget.startDate || undefined,
    endDate: budget.endDate || undefined,
    budgetId: budgetId,
  });
  return { ...budget, expenses };
}
export async function getAllBudgetsService(
  userId: string
): Promise<Array<Budget>> {
  const budgets = await prisma.budget.findMany({ where: { userId: userId } });
  return budgets;
}

export async function getAllBudgetSummariesService(
  userId: string
): Promise<Array<BudgetSummary>> {
  const [budgets, expensesGroupedByBudget] = await Promise.all([
    //total spent for all expenses
    prisma.budget.findMany({ where: { userId: userId } }),
    prisma.expense.groupBy({
      by: ['budgetId'],
      where: { userId: userId, type: 'EXPENSE' },
      _sum: { amountBase: true },
    }),
  ]);

  const budgetSummaryArray = budgets.map((budget): BudgetSummary => {
    const groupedExpenses = expensesGroupedByBudget.find(
      (group) => group.budgetId === budget.id
    );
    if (!groupedExpenses) {
      return {
        ...budget,
        totalSpent: 0,
        remaining: budget.totalAmount.toNumber(),
        percentageUsed: 0,
        categoryBreakdown: [],
      };
    }

    const totalSpent = groupedExpenses._sum.amountBase ?? new Prisma.Decimal(0);
    const remaining = budget.totalAmount.sub(totalSpent);
    const percentage = budget.totalAmount.equals(0)
      ? new Prisma.Decimal(0)
      : totalSpent.div(budget.totalAmount).times(100);

    return {
      ...budget,
      totalSpent: totalSpent.toNumber(),
      remaining: remaining.toNumber(),
      percentageUsed: percentage.toNumber(),
      categoryBreakdown: [],
    };
  });

  return budgetSummaryArray;
}

//some real duplication smell here differentiating and validating from EVENT and VACATION types
export async function createBudgetService(
  userId: string,
  budgetData: CreateBudgetBackendInput
): Promise<Budget> {
  if (
    budgetData.type === 'VACATION' &&
    (!budgetData.startDate || !budgetData.endDate)
  ) {
    throw new Error('This Vacation Budget does not have a start date.');
  }

  if (
    budgetData.type === 'EVENT' &&
    (!budgetData.startDate || !budgetData.endDate)
  ) {
    throw new Error('This Event Budget does not have a start date.');
  }

  if (budgetData.type === 'VACATION') {
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
        type: 'VACATION',
        AND: [
          { startDate: { lt: budgetData.endDate || undefined } },
          { endDate: { gt: budgetData.startDate || undefined } },
        ],
      },
    });

    if (overlappingBudget) {
      throw new Error('This Vacation Budget overlaps with another.');
    }
  }

  if (budgetData.type === 'EVENT') {
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
        type: 'EVENT',
        AND: [
          { startDate: { lt: budgetData.endDate || undefined } },
          { endDate: { gt: budgetData.startDate || undefined } },
        ],
      },
    });

    if (overlappingBudget) {
      throw new Error('This Event Budget overlaps with another.');
    }
  }

  const newBudget = await prisma.budget.create({
    data: {
      userId: userId,
      name: budgetData.name,
      type: budgetData.type,
      currency: budgetData.currency,
      totalAmount: budgetData.totalAmount,
      startDate: budgetData.startDate,
      endDate: budgetData.endDate,
      startTime: budgetData.startTime,
      endTime: budgetData.endTime,
      notes: budgetData.notes,
    },
  });

  return newBudget;
}

//some real duplication smell here differentiating and validating from EVENT and VACATION types
export async function updateBudgetService(
  userId: string,
  budgetId: string,
  budgetData: UpdateBudgetBackendInput
): Promise<Budget> {
  const oldBudget = await prisma.budget.findUnique({
    where: { id: budgetId, userId: userId },
  });
  if (!oldBudget) {
    throw new Error('Could not find this Budget.');
  }

  const newBudget = {
    name: budgetData.name ?? oldBudget.name,
    type: budgetData.type ?? oldBudget.type,
    currency: budgetData.currency ?? oldBudget.currency,
    totalAmount: budgetData.totalAmount ?? oldBudget.totalAmount,
    startDate: budgetData.startDate ?? oldBudget.startDate,
    endDate: budgetData.endDate ?? oldBudget.endDate,
    startTime: budgetData.startTime ?? oldBudget.startTime,
    endTime: budgetData.endTime ?? oldBudget.endTime,
    notes: budgetData.notes ?? oldBudget.notes,
  };

  if (
    newBudget.type === 'VACATION' &&
    (!newBudget.startDate || !newBudget.endDate)
  ) {
    throw new Error('This Vacation Budget does not have a start date.');
  }

  if (
    newBudget.type === 'EVENT' &&
    (!newBudget.startDate || !newBudget.endDate)
  ) {
    throw new Error('This Event Budget does not have a start date.');
  }

  if (newBudget.type === 'VACATION') {
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
        type: 'VACATION',
        id: { not: budgetId },
        AND: [
          { startDate: { lt: newBudget.endDate || undefined } },
          { endDate: { gt: newBudget.startDate || undefined } },
        ],
      },
    });

    if (overlappingBudget) {
      throw new Error('This Vacation Budget overlaps with another.');
    }
  }

  if (newBudget.type === 'EVENT') {
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
        type: 'EVENT',
        id: { not: budgetId },
        AND: [
          { startDate: { lt: newBudget.endDate || undefined } },
          { endDate: { gt: newBudget.startDate || undefined } },
        ],
      },
    });

    if (overlappingBudget) {
      throw new Error('This Event Budget overlaps with another.');
    }
  }

  const updatedBudget = await prisma.budget.update({
    where: { id: budgetId, userId: userId },
    data: {
      ...(budgetData.name !== undefined && { name: budgetData.name }),
      ...(budgetData.type !== undefined && { type: budgetData.type }),
      ...(budgetData.currency !== undefined && {
        currency: budgetData.currency,
      }),
      ...(budgetData.totalAmount !== undefined && {
        totalAmount: budgetData.totalAmount,
      }),
      ...(budgetData.startDate !== undefined && {
        startDate: budgetData.startDate,
      }),
      ...(budgetData.endDate !== undefined && { endDate: budgetData.endDate }),
      ...(budgetData.startTime !== undefined && {
        startTime: budgetData.startTime,
      }),
      ...(budgetData.endTime !== undefined && { endTime: budgetData.endTime }),
      ...(budgetData.notes !== undefined && { notes: budgetData.notes }),
    },
  });

  return updatedBudget;
}

export async function deleteBudgetService(
  userId: string,
  budgetId: string
): Promise<Budget> {
  const oldBudget = await prisma.budget.findUnique({
    where: { id: budgetId, userId: userId },
  });

  if (!oldBudget) {
    throw new Error('Could not find this Budget.');
  }

  const deletedBudget = await prisma.budget.delete({
    where: { id: budgetId, userId: userId },
  });

  return deletedBudget;
}
