import z from 'zod';

export const userRegisterSchema = z.object({
  email: z.email().min(1),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/,
      'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
    ),
});

export const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
