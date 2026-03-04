import { Request, Response } from 'express';
import { registerUser } from '../services/authServices';
import z from 'zod';

const userRegisterSchema = z.object({
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

export async function registerUserController(
  req: Request,
  res: Response
): Promise<void> {
  const result = userRegisterSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ Error: result.error });
  } else {
    try {
      const newUser = await registerUser(
        result.data.email,
        result.data.password
      );
      res.status(201).json({ message: 'registered.', user: newUser });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}
