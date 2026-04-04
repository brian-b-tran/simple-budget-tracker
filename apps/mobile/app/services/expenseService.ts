import api from './api';
import {
  CreateExpenseFrontendInput,
  UpdateExpenseFrontendInput,
  FilterExpenseInput,
} from '@expense-app/types';
import { PaginatedExpenses, Expense } from '../types/expenseTypes';
import { handleError } from '../utils/serviceUtils';

export async function getExpense(id: string): Promise<Expense> {
  try {
    const { data } = await api.get<Expense>(`/expenses/${id}`);
    return data;
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
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}

export async function createExpense(
  input: CreateExpenseFrontendInput
): Promise<Expense> {
  try {
    const { data } = await api.post<Expense>(`/expenses/`, input);

    return data;
  } catch (error: any) {
    return handleError(error);
  }
}

export async function updateExpense(
  input: UpdateExpenseFrontendInput,
  id: string
): Promise<Expense> {
  try {
    const { data } = await api.put<Expense>(`/expenses/${id}`, input);

    return data;
  } catch (error: any) {
    return handleError(error);
  }
}

export async function deleteExpense(id: string): Promise<Expense> {
  try {
    const { data } = await api.delete<Expense>(`/expenses/${id}`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}
