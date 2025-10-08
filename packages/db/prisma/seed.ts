import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {},
    create: { slug: "demo", name: "Demo Tenant" }
  });
  await prisma.tenantModule.upsert({
    where: { tenantId_key: { tenantId: tenant.id, key: "bookings" } },
    update: { status: "ACTIVE" },
    create: { tenantId: tenant.id, key: "bookings", status: "ACTIVE" }
  });
  console.log("✅ Seeded demo tenant with bookings enabled");
}
main().finally(() => prisma.$disconnect());
