import { db, Role } from '@nexablend/db';

const roleOrder = [Role.CASHIER, Role.STAFF, Role.ADMIN, Role.OWNER];

export function hasAtLeast(userRole: Role | null | undefined, min: Role) {
  if (!userRole) return false;
  return roleOrder.indexOf(userRole) >= roleOrder.indexOf(min);
}

export async function getActiveMembership(userId: string) {
  return db.membership.findFirst({
    where: { userId, isPrimary: true },
    include: { tenant: true },
  });
}

export async function requireEntitlement(tenantId: string, moduleKey: string) {
  const entitlement = await db.tenantEntitlement.findFirst({
    where: {
      tenantId,
      module: { key: moduleKey },
      status: 'ACTIVE',
    },
  });
  return Boolean(entitlement);
}

