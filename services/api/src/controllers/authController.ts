import { Request, Response } from 'express';
import {
  registerUserService,
  loginUserService,
  refreshTokens,
} from '../services/authServices';
import z from 'zod';
import { env } from '../config/env';

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
      const newUser = await registerUserService(
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

const userLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function loginUserController(
  req: Request,
  res: Response
): Promise<void> {
  const result = userLoginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ Error: result.error });
  } else {
    try {
      const tokens = await loginUserService(
        result.data.email,
        result.data.password
      );
      res.cookie('refreshToken', tokens[1], {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });
      res.status(200).json({ message: 'Logged In.', access: tokens[0] });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  }
}

export async function refreshTokensController(
  req: Request,
  res: Response
): Promise<void> {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }
  try {
    const [access, refresh] = await refreshTokens(refreshToken);
    res.cookie('refreshToken', refresh, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
    res.status(200).json({ message: 'Tokens refreshed.', access: access });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
