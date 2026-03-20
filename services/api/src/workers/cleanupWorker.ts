import prisma from '../config/db';
import { Prisma } from '../../generated/prisma/client';

export async function cleanupExpiredSessions(): Promise<Prisma.BatchPayload> {
  const expiredSessions = await prisma.session.deleteMany({
    where: {
      OR: [{ expiresAt: { lte: new Date() } }, { revoked: true }],
    },
  });

  return expiredSessions;
}

//deletes exchange rates older than 30 days
export async function cleanupOldExchangeRates(): Promise<Prisma.BatchPayload> {
  const oldExchangeRates = await prisma.exchangeRate.deleteMany({
    where: {
      fetchedAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  });

  return oldExchangeRates;
}

export async function cleanupWorker(): Promise<void> {
  const sessionsCleaned = await cleanupExpiredSessions();
  const exchangeRatesCleaned = await cleanupOldExchangeRates();
  console.log(
    `Cleanup complete: ${sessionsCleaned.count} sessions removed, ${exchangeRatesCleaned.count} exchange rates removed`
  );
}
