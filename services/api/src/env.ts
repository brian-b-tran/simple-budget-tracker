import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3000),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
