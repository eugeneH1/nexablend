import { PrismaClient } from "@prisma/client";
export type ModuleKey = "bookings" | "pos" | "finance";

const prisma = new PrismaClient();

export async function getEntitlements(tenantId: string): Promise<Set<ModuleKey>> {
  const rows = await prisma.tenantModule.findMany({
    where: { tenantId, status: "ACTIVE" }
  });
  return new Set(rows.map(r => r.key as ModuleKey));
}

