import { getEntitlements } from "@nexablend/services";

export async function GET() {
  const tenantId = "demo"; // DEV ONLY: replace with real tenant from auth later
  const mods = Array.from(await getEntitlements(tenantId));
  return Response.json({ tenantId, modules: mods });
}

