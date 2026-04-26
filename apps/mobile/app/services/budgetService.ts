import {
  CreateBudgetFrontendInput,
  UpdateBudgetFrontendInput,
} from '@expense-app/types';
import { Budget, BudgetSummary } from '../types/budgetTypes';
import { handleError } from '../utils/serviceUtils';
import api from './api';

export const getAllBudgets = async (): Promise<Array<BudgetSummary>> => {
  try {
    const { data } = await api.get<Array<BudgetSummary>>(`/budgets`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const getBudget = async (budgetId: string): Promise<BudgetSummary> => {
  try {
    const { data } = await api.get<BudgetSummary>(`/budgets/${budgetId}`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const createBudget = async (
  input: CreateBudgetFrontendInput
): Promise<Budget> => {
  try {
    const { data } = await api.post<Budget>(`/budgets`, input);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const updateBudget = async (
  budgetId: string,
  input: UpdateBudgetFrontendInput
): Promise<Budget> => {
  try {
    const { data } = await api.put<Budget>(`/budgets/${budgetId}`, input);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const deleteBudget = async (budgetId: string): Promise<Budget> => {
  try {
    const { data } = await api.delete<Budget>(`/budgets/${budgetId}`);
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};
