import prisma from '../config/db';
import { Budget, Prisma } from '../../generated/prisma/client';
import {
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../validators/budgetValidators';
import type { BudgetSummary, BudgetCategoryBreakdown } from '../types/budget';

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
      where: { userId: userId, budgetId: budget.id },
      _sum: { amountBase: true },
    }),
    //total spent grouped by category
    prisma.expense.groupBy({
      by: ['categoryId'],
      where: { budgetId: budgetId, userId: userId },
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
      //match category ids to find category name
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
    budget: budget,
    totalSpent: totalSpent.toNumber(),
    remaining: remaining.toNumber(),
    percentageUsed: percentage.toNumber(),
    categoryBreakdown: categoryBreakdownArray,
  };
}

export async function getAllBudgetsService(
  userId: string
): Promise<Array<Budget>> {
  const budgets = await prisma.budget.findMany({ where: { userId: userId } });
  return budgets;
}

export async function createBudgetService(
  userId: string,
  budgetData: CreateBudgetInput
): Promise<Budget> {
  if (
    budgetData.type === 'VACATION' &&
    budgetData.startDate &&
    budgetData.endDate
  ) {
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
        type: 'VACATION',
        AND: [
          { startDate: { lt: budgetData.endDate } },
          { endDate: { gt: budgetData.startDate } },
        ],
      },
    });

    if (overlappingBudget) {
      throw new Error('This Vacation Budget overlaps with another.');
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

export async function updateBudgetService(
  userId: string,
  budgetId: string,
  budgetData: UpdateBudgetInput
): Promise<Budget> {
  const oldBudget = await prisma.budget.findUnique({
    where: { id: budgetId, userId: userId },
  });
  if (!oldBudget) {
    throw new Error('Could not find this Budget.');
  }

  if (
    budgetData.type === 'VACATION' &&
    budgetData.startDate &&
    budgetData.endDate
  ) {
    const overlappingBudget = await prisma.budget.findFirst({
      where: {
        userId: userId,
        type: 'VACATION',
        id: { not: budgetId },
        AND: [
          { startDate: { lt: budgetData.endDate } },
          { endDate: { gt: budgetData.startDate } },
        ],
      },
    });

    if (overlappingBudget) {
      throw new Error('This Vacation Budget overlaps with another.');
    }
  }

  const updatedBudget = await prisma.budget.update({
    where: { id: budgetId, userId: userId },
    data: {
      ...(budgetData.name && { name: budgetData.name }),
      ...(budgetData.type && { type: budgetData.type }),
      ...(budgetData.currency && { currency: budgetData.currency }),
      ...(budgetData.totalAmount && { totalAmount: budgetData.totalAmount }),
      ...(budgetData.startDate && { startDate: budgetData.startDate }),
      ...(budgetData.endDate && { endDate: budgetData.endDate }),
      ...(budgetData.startTime && { startTime: budgetData.startTime }),
      ...(budgetData.endTime && { endTime: budgetData.endTime }),
      ...(budgetData.notes && { notes: budgetData.notes }),
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
