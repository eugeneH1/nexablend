// packages/db/src/index.ts
import {
  PrismaClient,
  Role,
  EntitlementStatus,
  SubscriptionStatus,
  BillingProvider,
  OrderStatus,
  PaymentStatus,
} from '@prisma/client';

// singleton client
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

export { Role, EntitlementStatus, SubscriptionStatus, BillingProvider, OrderStatus, PaymentStatus };

export type { Prisma } from '@prisma/client';

