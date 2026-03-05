import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const bearer = req.headers.authorization;
  if (!bearer) {
    res.status(401).json({ message: 'No authorization' });
    return;
  }
  if (bearer.startsWith('Bearer ')) {
    const accessToken = bearer.substring(7, bearer.length);
    try {
      const payload = verifyAccessToken(accessToken);
      req.user = {
        userId: payload.sub,
        email: payload.email,
      };
      next();
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({ message: 'No authorization' });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  } else {
    res.status(401).json({ message: 'No authorization' });
    return;
  }
}
