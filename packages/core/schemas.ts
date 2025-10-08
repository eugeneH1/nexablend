import { z } from "zod";
export const CatalogItemSchema = z.object({
  id: z.string().optional(),
  tenantId: z.string(),
  kind: z.enum(["PRODUCT", "SERVICE"]),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  priceMode: z.enum(["INCLUSIVE", "EXCLUSIVE"]),
  durationMin: z.number().int().positive().optional(),
  sku: z.string().optional()
});
export type CatalogItem = z.infer<typeof CatalogItemSchema>;
