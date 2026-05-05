import { z } from 'zod';

export const reminderBaseSchema = z.object({
  title: z.string(),
  dateTime: z.coerce.date(),
  recurring: z.boolean().default(false),
  recurrenceFrequency: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .optional(),
  notes: z.string().optional(),
  interval: z.int().positive().default(1),
});

export const createReminderFrontendSchema = reminderBaseSchema;
export const createReminderBackendSchema = reminderBaseSchema;

export const updateReminderFrontendSchema =
  createReminderFrontendSchema.partial();
export const updateReminderBackendSchema =
  createReminderBackendSchema.partial();

export type CreateReminderFrontendInput = z.infer<
  typeof createReminderFrontendSchema
>;
export type CreateReminderBackendInput = z.infer<
  typeof createReminderBackendSchema
>;
export type UpdateReminderFrontendInput = z.infer<
  typeof updateReminderFrontendSchema
>;
export type UpdateReminderBackendInput = z.infer<
  typeof updateReminderBackendSchema
>;
