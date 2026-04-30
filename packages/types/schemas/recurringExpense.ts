import { z } from 'zod';

export const recurringExpenseBaseSchema = z.object({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
  currencyOriginal: z.string().length(3).optional(),
  categoryId: z.uuid(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.int().positive(),
  startDate: z.date(),
  endDate: z.date().optional(),
  budgetId: z.uuid().optional(),
  notes: z.string().optional(),
  type: z.enum(['EXPENSE', 'INCOME']),
});

export const createRecurringExpenseFrontendSchema = recurringExpenseBaseSchema;
export const createRecurringExpenseBackendSchema = recurringExpenseBaseSchema;

export const updateRecurringExpenseFrontendSchema =
  createRecurringExpenseBackendSchema.partial();
export const updateRecurringExpenseBackendSchema =
  createRecurringExpenseBackendSchema.partial();

export type CreateRecurringExpenseFrontendInput = z.infer<
  typeof createRecurringExpenseFrontendSchema
>;
export type CreateRecurringExpenseBackendInput = z.infer<
  typeof createRecurringExpenseBackendSchema
>;
export type UpdateRecurringExpenseFrontendInput = z.infer<
  typeof updateRecurringExpenseFrontendSchema
>;
export type UpdateRecurringExpenseBackendInput = z.infer<
  typeof updateRecurringExpenseBackendSchema
>;
