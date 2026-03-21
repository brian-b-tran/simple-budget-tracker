import prisma from '../config/db';
import { Prisma } from '../../generated/prisma/client';
import { withRetry } from '../utils/retry';
export async function cleanupExpiredSessions(): Promise<Prisma.BatchPayload> {
  return await withRetry(() =>
    prisma.session.deleteMany({
      where: {
        OR: [{ expiresAt: { lte: new Date() } }, { revoked: true }],
      },
    })
  );
}

//deletes exchange rates older than 30 days
export async function cleanupOldExchangeRates(): Promise<Prisma.BatchPayload> {
  return await withRetry(() =>
    prisma.exchangeRate.deleteMany({
      where: {
        fetchedAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    })
  );
}
