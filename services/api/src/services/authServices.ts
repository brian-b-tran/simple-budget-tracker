import { User } from '../../generated/prisma/client';
import prisma from '../config/db';
import bcrypt from 'bcrypt';

export async function registerUser(
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
