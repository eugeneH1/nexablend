import { getEntitlements, requireModule } from "@nexablend/services";

export async function POST(req: Request) {
  const tenantId = "demo"; // DEV ONLY
  const entitlements = await getEntitlements(tenantId);
  return requireModule("bookings", async () => {
    // pretend to create a booking
    return Response.json({ ok: true, id: "bk_123" });
  })({ entitlements });
}

