import { z } from 'zod';

export const createRecurringExpenseSchema = z.object({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
  currencyOriginal: z.string().length(3).optional(),
  categoryId: z.uuid(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
  interval: z.int().positive().default(1),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  budgetId: z.uuid().optional(),
  notes: z.string().optional(),
  type: z.enum(['EXPENSE', 'INCOME']).default('EXPENSE'),
});

export const updateRecurringExpenseSchema = z.object({
  amountOriginal: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' })
    .optional(),
  currencyOriginal: z.string().length(3).optional(),
  categoryId: z.uuid().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  interval: z.int().positive().default(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  budgetId: z.uuid().optional(),
  notes: z.string().optional(),
  type: z.enum(['EXPENSE', 'INCOME']).default('EXPENSE').optional(),
});

export type CreateRecurringInput = z.infer<typeof createRecurringExpenseSchema>;
export type UpdateRecurringInput = z.infer<typeof updateRecurringExpenseSchema>;
