import prisma from '../config/db';
import { Budget, Prisma } from '../../generated/prisma/client';
import {
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../validators/budgetValidators';
import type { BudgetSummary } from '../types/budget';

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
  const expenseSumAggregate = await prisma.expense.aggregate({
    where: { userId: userId, budgetId: budget.id },
    _sum: { amountBase: true },
  });

  const totalSpent =
    expenseSumAggregate._sum.amountBase ?? new Prisma.Decimal(0);

  const remaining = budget.totalAmount.sub(totalSpent);
  const percentage = totalSpent.div(budget.totalAmount).times(100);

  return {
    budget: budget,
    totalSpent: totalSpent.toNumber(),
    remaining: remaining.toNumber(),
    percentageUsed: percentage.toNumber(),
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
