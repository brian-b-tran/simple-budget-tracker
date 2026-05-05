import { z } from 'zod';

export const budgetBaseSchema = z.object({
  name: z.string(),
  type: z.enum(['MONTHLY', 'YEARLY', 'QUARTERLY', 'VACATION', 'EVENT']),
  currency: z.string().length(3),
  totalAmount: z.number().positive(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  notes: z.string().optional(),
});
export const createBudgetFrontendSchema = budgetBaseSchema;
export const createBudgetBackendSchema = budgetBaseSchema;

export const updateBudgetFrontendSchema = createBudgetFrontendSchema.partial();
export const updateBudgetBackendSchema = createBudgetBackendSchema.partial();

export type CreateBudgetFrontendInput = z.infer<
  typeof createBudgetFrontendSchema
>;
export type CreateBudgetBackendInput = z.infer<
  typeof createBudgetBackendSchema
>;
export type UpdateBudgetFrontendInput = z.infer<
  typeof updateBudgetFrontendSchema
>;
export type UpdateBudgetBackendInput = z.infer<
  typeof updateBudgetBackendSchema
>;
