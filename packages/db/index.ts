// packages/db/src/index.ts
import { PrismaClient } from '@prisma/client';

// Prevent creating many clients in dev (Next.js HMR)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

// Re-export Prisma types & enums for convenience
export * from '@prisma/client';

