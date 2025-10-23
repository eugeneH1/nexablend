import { PrismaClient, EntitlementStatus, SubscriptionStatus, BillingProvider } from '@prisma/client';

const db = new PrismaClient();

/**
 * Optional: if you want to attach OWNER membership to an existing auth user,
 * set SEED_OWNER_EMAIL in your env to an email that already exists in the User table.
 * e.g. SEED_OWNER_EMAIL=owner@example.com pnpm -C packages/db seed
 */
const OWNER_EMAIL = process.env.SEED_OWNER_EMAIL || '';

async function upsertModuleCatalog() {
  const defs = [
    { key: 'core',     name: 'Core',      isCore: true },
    { key: 'bookings', name: 'Bookings' },
    { key: 'pos',      name: 'Point of Sale' },
    { key: 'finance',  name: 'Finance & Tax' },
    { key: 'reports',  name: 'Reports' },
  ];

  for (const m of defs) {
    await db.module.upsert({
      where: { key: m.key },
      update: { name: m.name, isCore: !!m.isCore },
      create: { key: m.key, name: m.name, isCore: !!m.isCore },
    });
  }
}

async function createTenantWithEntitlements() {
  const tenant = await db.tenant.upsert({
    where: { slug: 'demo-shop' },
    update: {},
    create: { slug: 'demo-shop', name: 'Demo Shop' },
  });

  const modules = await db.module.findMany({ where: { key: { in: ['core', 'pos', 'reports'] } } });

  for (const mod of modules) {
    await db.tenantEntitlement.upsert({
      where: { tenantId_moduleId: { tenantId: tenant.id, moduleId: mod.id } },
      update: { status: EntitlementStatus.ACTIVE, startsAt: new Date() },
      create: {
        tenantId: tenant.id,
        moduleId: mod.id,
        status: EntitlementStatus.ACTIVE,
        startsAt: new Date(),
      },
    });
  }

  return tenant;
}

async function createPlanAndSubscription(tenantId: string) {
  const starter = await db.plan.upsert({
    where: { key: 'starter' },
    update: {
      name: 'Starter',
      priceCents: 19900,
      currency: 'ZAR',
      includedModules: ['core', 'reports'], // stored as JSON (string[])
    },
    create: {
      key: 'starter',
      name: 'Starter',
      priceCents: 19900,
      currency: 'ZAR',
      includedModules: ['core', 'reports'],
    },
  });

  const now = new Date();
  const monthFromNow = new Date(now.getTime());
  monthFromNow.setMonth(now.getMonth() + 1);

  await db.subscription.upsert({
    where: {
      // synthetic key: one active sub per tenant for seeding
      id: `seed-sub-${tenantId}`,
    },
    update: {
      status: SubscriptionStatus.ACTIVE,
      provider: BillingProvider.NONE,
      currentPeriodStart: now,
      currentPeriodEnd: monthFromNow,
    },
    create: {
      id: `seed-sub-${tenantId}`,
      tenantId,
      planId: starter.id,
      status: SubscriptionStatus.ACTIVE,
      provider: BillingProvider.NONE,
      currentPeriodStart: now,
      currentPeriodEnd: monthFromNow,
    },
  });
}

async function createCatalogAndCustomers(tenantId: string) {
  await db.customer.createMany({
    data: [
      { tenantId, name: 'Alice Mokoena', email: 'alice@example.com' },
      { tenantId, name: 'Bob Dlamini',   email: 'bob@example.com' },
      { tenantId, name: 'Carla Naidoo',  phone: '0720000001' },
    ],
    skipDuplicates: true,
  });

  await db.product.createMany({
    data: [
      { tenantId, name: 'Haircut', sku: 'SERV-HAIRCUT', price: 12000, vatRate: 1500, durationMins: 30 },
      { tenantId, name: 'Shave',   sku: 'SERV-SHAVE',   price:  6000, vatRate: 1500, durationMins: 15 },
      { tenantId, name: 'Comb',    sku: 'SKU-COMB',     price:  3500, vatRate: 1500 },
    ],
    skipDuplicates: true,
  });
}

async function createSampleOrders(tenantId: string) {
  const [alice] = await db.customer.findMany({ where: { tenantId }, take: 1 });
  const [haircut, shave, comb] = await db.product.findMany({
    where: { tenantId, name: { in: ['Haircut', 'Shave', 'Comb'] } },
    orderBy: { name: 'asc' },
  });

  // simple orderNo generator based on count (fine for seed)
  const count = await db.order.count({ where: { tenantId } });
  const nextNo = count + 1;

  const order = await db.order.create({
    data: {
      tenantId,
      customerId: alice?.id,
      orderNo: nextNo,
      totalCents: (haircut?.price ?? 0) + (comb?.price ?? 0), // snapshot total
      status: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: new Date(),
      updatedAt: new Date(),
      items: {
        create: [
          {
            tenantId,
            productId: haircut?.id,
            name: haircut?.name ?? 'Haircut',
            unitPrice: haircut?.price ?? 12000,
            quantity: 1,
            vatRate: haircut?.vatRate ?? 1500,
          },
          {
            tenantId,
            productId: comb?.id,
            name: comb?.name ?? 'Comb',
            unitPrice: comb?.price ?? 3500,
            quantity: 1,
            vatRate: comb?.vatRate ?? 1500,
          },
        ],
      },
    },
  });

  return order;
}

async function attachOwnerMembershipIfUserExists(tenantId: string) {
  if (!OWNER_EMAIL) return;

  const user = await db.user.findUnique({ where: { email: OWNER_EMAIL } });
  if (!user) {
    console.warn(`SEED_OWNER_EMAIL provided but user not found: ${OWNER_EMAIL}`);
    return;
  }

  await db.membership.upsert({
    where: { userId_tenantId: { userId: user.id, tenantId } },
    update: { role: 'OWNER', isPrimary: true },
    create: { userId: user.id, tenantId, role: 'OWNER', isPrimary: true },
  });

  console.log(`Attached OWNER membership to ${OWNER_EMAIL}`);
}

async function main() {
  await upsertModuleCatalog();
  const tenant = await createTenantWithEntitlements();
  await createPlanAndSubscription(tenant.id);
  await createCatalogAndCustomers(tenant.id);
  await createSampleOrders(tenant.id);
  await attachOwnerMembershipIfUserExists(tenant.id);

  console.log('✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

