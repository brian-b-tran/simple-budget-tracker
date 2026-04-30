import { CreateRecurringExpenseFrontendInput } from '@expense-app/types';
import { RecurringExpense } from '../types/recurringExpense';
import { handleError } from '../utils/serviceUtils';
import api from './api';

export async function createRecurringExpense(
  input: CreateRecurringExpenseFrontendInput
): Promise<RecurringExpense> {
  try {
    const { data } = await api.post<RecurringExpense>(
      `/recurring-expenses`,
      input
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
}
