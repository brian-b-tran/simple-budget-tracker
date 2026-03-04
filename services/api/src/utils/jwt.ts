import jwt from 'jsonwebtoken';
import { env } from '../config/env';
function generateAccessToken(userId: string, email: string): string {
  const payload = { sub: userId, email: email, type: 'access' };
  const token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });

  return token;
}

function generateRefreshToken(userId: string, sessionId: string): string {
  const payload = { sub: userId, sessionId: sessionId, type: 'refresh' };
  const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  return token;
}

export { generateAccessToken, generateRefreshToken };
