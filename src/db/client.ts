import * as dotenv from 'dotenv';

dotenv.config();

import { PrismaClient } from '@prisma/client';
import { PrismaNeonHttp } from '@prisma/adapter-neon';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const adapter = new PrismaNeonHttp(process.env.DATABASE_URL, {} as any);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
