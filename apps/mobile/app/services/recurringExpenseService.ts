import {
  CreateRecurringExpenseFrontendInput,
  FilterExpenseInput,
} from '@expense-app/types';
import {
  PaginatedRecurringExpense,
  RecurringExpense,
} from '../types/recurringExpense';
import { handleError } from '../utils/serviceUtils';
import api from './api';

export async function getRecurringExpense(
  recurringId: string
): Promise<RecurringExpense> {
  try {
    const { data } = await api.get<RecurringExpense>(
      `/recurring-expenses/${recurringId}`
    );
    return {
      ...data,
      amountOriginal: Number(data.amountOriginal),
      interval: Number(data.interval),
    };
  } catch (error: any) {
    return handleError(error);
  }
}

export async function createRecurringExpense(
  input: CreateRecurringExpenseFrontendInput
): Promise<RecurringExpense> {
  try {
    const cleanedInput = {
      ...input,
      amountOriginal: parseFloat(input.amountOriginal),
      budgetId: input.budgetId || undefined,
      endDate: input.endDate || undefined,
      notes: input.notes || undefined,
    };
    const { data } = await api.post<RecurringExpense>(
      `/recurring-expenses`,
      cleanedInput
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}
export async function deleteRecurringExpense(recurringId: string) {
  try {
    const { data } = await api.delete<RecurringExpense>(
      `/recurring-expenses/${recurringId}`
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}
export async function getFilteredRecurringExpenses(
  filter: FilterExpenseInput
): Promise<PaginatedRecurringExpense> {
  try {
    console.log('Frontend Recurring Expense service');
    const { data } = await api.get<PaginatedRecurringExpense>(
      `/recurring-expenses/filter`,
      {
        params: filter,
      }
    );
    return {
      ...data,
      data: data.data.map((expense) => ({
        ...expense,
        amountOriginal: Number(expense.amountOriginal),
        amountBase: Number(expense.amountOriginal),
      })),
    };
  } catch (error: any) {
    return handleError(error);
  }
}
