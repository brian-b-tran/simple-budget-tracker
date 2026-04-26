import api from './api';
import {
  CreateExpenseFrontendInput,
  UpdateExpenseFrontendInput,
  FilterExpenseInput,
} from '@expense-app/types';
import { PaginatedExpenses, Expense } from '../types/expenseTypes';
import { handleError } from '../utils/serviceUtils';

export async function getExpense(expenseId: string): Promise<Expense> {
  try {
    const { data } = await api.get<Expense>(`/expenses/${expenseId}`);
    return {
      ...data,
      amountOriginal: Number(data.amountOriginal),
      amountBase: Number(data.amountBase),
      exchangeRateUsed: Number(data.exchangeRateUsed),
    };
  } catch (error: any) {
    return handleError(error);
  }
}

export async function getAllExpenses(): Promise<Array<Expense>> {
  try {
    const { data } = await api.get<Array<Expense>>(`/expenses`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}

export async function getFilteredExpenses(
  filter: FilterExpenseInput
): Promise<PaginatedExpenses> {
  try {
    const { data } = await api.get<PaginatedExpenses>(`/expenses/filter`, {
      params: filter,
    });
    return {
      ...data,
      data: data.data.map((expense) => ({
        ...expense,
        amountOriginal: Number(expense.amountOriginal),
        amountBase: Number(expense.amountBase),
        exchangeRateUsed: Number(expense.exchangeRateUsed),
      })),
    };
  } catch (error: any) {
    return handleError(error);
  }
}

export async function createExpense(
  input: CreateExpenseFrontendInput
): Promise<Expense> {
  try {
    const { data } = await api.post<Expense>(`/expenses`, input);

    return data;
  } catch (error: any) {
    return handleError(error);
  }
}

export async function updateExpense(
  input: UpdateExpenseFrontendInput,
  expenseId: string
): Promise<Expense> {
  try {
    const { data } = await api.put<Expense>(`/expenses/${expenseId}`, input);

    return data;
  } catch (error: any) {
    return handleError(error);
  }
}

export async function deleteExpense(expenseId: string): Promise<Expense> {
  try {
    const { data } = await api.delete<Expense>(`/expenses/${expenseId}`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}
