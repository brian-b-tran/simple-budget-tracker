import { z } from 'zod';
import { currencies } from '../constants/currencies';

const currencyCodes = Object.keys(currencies) as [string, ...string[]];

export const budgetBaseSchema = z.object({
  name: z.string(),
  type: z.enum(['MONTHLY', 'YEARLY', 'QUARTERLY', 'VACATION', 'EVENT']),
  currency: z.enum(currencyCodes),
  totalAmount: z.number().positive(),
  notes: z.string().optional(),
});

const budgetFrontendObject = budgetBaseSchema.extend({
  totalAmount: z
    .string()
    .min(1, 'Amount is required')
    .refine((val) => {
      const parsed = parseFloat(val);
      return !isNaN(parsed) && parsed !== 0;
    }),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.date().optional(),
  endTime: z.date().optional(),
});

const budgetBackendObject = budgetBaseSchema.extend({
  totalAmount: z
    .number()
    .refine((val) => val !== 0, { message: 'Amount cannot be zero' }),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
});

export const createBudgetFrontendSchema = budgetFrontendObject.refine(
  (budgetData) => {
    if (budgetData.type == 'VACATION' || budgetData.type === 'EVENT') {
      if (!budgetData.startDate || !budgetData.endDate) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Budget types VACATION and EVENT need valid start and end dates.',
  }
);

export const createBudgetBackendSchema = budgetBackendObject.refine(
  (budgetData) => {
    if (budgetData.type == 'VACATION' || budgetData.type === 'EVENT') {
      if (!budgetData.startDate || !budgetData.endDate) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Budget types VACATION and EVENT need valid start and end dates.',
  }
);

export const updateBudgetFrontendSchema = budgetFrontendObject.partial().refine(
  (budgetData) => {
    if (budgetData.type == 'VACATION' || budgetData.type === 'EVENT') {
      if (!budgetData.startDate || !budgetData.endDate) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Budget types VACATION and EVENT need valid start and end dates.',
  }
);

export const updateBudgetBackendSchema = budgetBackendObject.partial().refine(
  (budgetData) => {
    if (budgetData.type == 'VACATION' || budgetData.type === 'EVENT') {
      if (!budgetData.startDate || !budgetData.endDate) {
        return false;
      }
    }
    return true;
  },
  {
    message: 'Budget types VACATION and EVENT need valid start and end dates.',
  }
);

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
