// packages/services/permissions.ts
export const Permissions = {
  'customers.read': ['CASHIER','STAFF','ADMIN','OWNER'],
  'customers.write': ['STAFF','ADMIN','OWNER'],
  'products.read': ['STAFF','ADMIN','OWNER'],
  'products.write': ['ADMIN','OWNER'],
  'orders.create': ['CASHIER','STAFF','ADMIN','OWNER'],
  'billing.manage': ['OWNER','ADMIN'],
} as const;

export function can(role: string | null | undefined, perm: keyof typeof Permissions) {
  if (!role) return false;
  return Permissions[perm].includes(role as any);
}

