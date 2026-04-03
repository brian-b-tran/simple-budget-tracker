import { AxiosResponse } from 'axios';
import api from './api';
import { Expense, Filter, PaginatedExpenses } from '../types/ExpenseTypes';

export async function getExpense(id: string): Promise<Expense> {
  try {
    const response: AxiosResponse<Expense> = await api.get(`/expenses/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'An unexpected error occurred with expense services.';
    throw new Error(errorMessage);
  }
}

export async function getAllExpenses(): Promise<Array<Expense>> {
  try {
    const response: AxiosResponse<Array<Expense>> = await api.get(`/expenses`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'An unexpected error occurred with expense services.';
    throw new Error(errorMessage);
  }
}

export async function getFilteredExpenses(
  filter: Filter
): Promise<PaginatedExpenses> {
  try {
    const response: AxiosResponse<PaginatedExpenses> = await api.get(
      `/expenses`,
      {
        params: filter,
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'An unexpected error occurred with expense services.';
    throw new Error(errorMessage);
  }
}

export async function createExpense(data: Expense): Promise<Expense> {
  try {
    const response: AxiosResponse<Expense> = await api.post(`/expenses/`, {
      params: data,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'An unexpected error occurred with expense services.';
    throw new Error(errorMessage);
  }
}

export async function updateExpense(
  data: Expense,
  id: string
): Promise<Expense> {
  try {
    const response: AxiosResponse<Expense> = await api.put(`/expenses/${id}`, {
      params: data,
      withCredentials: true,
    });

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'An unexpected error occurred with expense services.';
    throw new Error(errorMessage);
  }
}

export async function deleteExpense(id: string): Promise<Expense> {
  try {
    const response: AxiosResponse<Expense> = await api.delete(
      `/expenses/${id}`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      'An unexpected error occurred with expense services.';
    throw new Error(errorMessage);
  }
}
