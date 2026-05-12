import { CreateRecurringExpenseFrontendInput } from '@expense-app/types';
import { RecurringExpense } from '../types/recurringExpense';
import { handleError } from '../utils/serviceUtils';
import api from './api';

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
