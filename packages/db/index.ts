import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __nexablend_prisma__: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.__nexablend_prisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.__nexablend_prisma__ = prisma;
}


