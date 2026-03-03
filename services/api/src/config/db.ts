import { env } from './env';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient({ adapter });

if (env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
