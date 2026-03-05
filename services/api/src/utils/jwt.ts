import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  email: string;
  type: string;
}
export interface AccessTokenPayload {
  sub: string;
  email: string;
  type: string;
}

export function generateAccessToken(userId: string, email: string): string {
  const payload = { sub: userId, email: email, type: 'access' };
  const token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  return token;
}

export function generateRefreshToken(
  userId: string,
  sessionId: string,
  email: string
): string {
  const payload = {
    sub: userId,
    sessionId: sessionId,
    email: email,
    type: 'refresh',
  };
  const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return token;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  return payload as RefreshTokenPayload;
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  return payload as AccessTokenPayload;
}
