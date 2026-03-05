import { User } from '../../generated/prisma/client';
import prisma from '../config/db';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';
import type { RefreshTokenPayload } from '../utils/jwt';

export async function registerUserService(
  email: string,
  password: string
): Promise<Omit<User, 'passwordHash'>> {
  if (
    await prisma.user.findUnique({
      where: { email: email },
    })
  ) {
    throw new Error('Email already in use by another user.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { passwordHash: _, ...newUser } = await prisma.user.create({
    data: {
      email: email,
      passwordHash: passwordHash,
    },
  });

  return newUser;
}

export async function loginUserService(
  email: string,
  password: string
): Promise<[string, string]> {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const result = await bcrypt.compare(password, user.passwordHash);
  if (!result) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken(user.id, user.email);

  const sessionId = uuidv4();
  const refreshToken = generateRefreshToken(user.id, sessionId, user.email);
  const refreshHash = await bcrypt.hash(refreshToken, 10);

  let date = new Date();
  date.setDate(date.getDate() + 7);

  const session = await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      refreshTokenHash: refreshHash,
      expiresAt: date,
    },
  });

  return [accessToken, refreshToken];
}

export async function refreshTokens(
  refreshToken: string
): Promise<[string, string]> {
  const payload = verifyRefreshToken(refreshToken);
  const currentSession = await prisma.session.findUnique({
    where: { id: payload.sessionId },
  });
  let date = new Date();
  if (
    !currentSession ||
    currentSession.revoked ||
    currentSession.expiresAt.getTime() < date.getTime()
  ) {
    throw new Error('Session Invalid');
  }
  const result = await bcrypt.compare(
    refreshToken,
    currentSession.refreshTokenHash
  );

  if (!result) {
    throw new Error('Session Invalid');
  }

  const newAccessToken = generateAccessToken(payload.sub, payload.email);
  const newRefreshToken = generateRefreshToken(
    payload.sub,
    payload.sessionId,
    payload.email
  );
  const newRefreshHash = await bcrypt.hash(newRefreshToken, 10);

  date.setDate(date.getDate() + 7);

  await prisma.session.update({
    where: { id: payload.sessionId },
    data: {
      refreshTokenHash: newRefreshHash,
      expiresAt: date,
    },
  });

  return [newAccessToken, newRefreshToken];
}
