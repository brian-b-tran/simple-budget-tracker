import { User } from '../../generated/prisma/client';
import prisma from '../config/db';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { v4 as uuidv4 } from 'uuid';

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
  const refreshToken = generateRefreshToken(user.id, sessionId);
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
