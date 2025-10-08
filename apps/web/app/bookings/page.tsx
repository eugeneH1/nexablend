import { getEntitlements } from "@nexablend/services";

export default async function BookingsPage() {
  const tenantId = "demo"; // swap for real tenant from auth later
  const entitlements = await getEntitlements(tenantId);
  if (!entitlements.has("bookings")) {
    return <div className="p-6">Bookings is not enabled for your tenant.</div>;
  }
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Bookings</h1>
      <form action="/api/bookings" method="post" className="mt-4">
        <button type="submit" className="border px-3 py-2">Create test booking</button>
      </form>
    </main>
  );
}

