"use client"

import { getEntitlements } from "@nexablend/services";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";

function BookingsContent() {
  const { data: session } = useSession();
  const [entitlements, setEntitlements] = useState<Set<string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkEntitlements() {
      if (!session?.user?.tenantId) {
        // For now, use demo tenant if no tenantId is set
        const tenantId = "demo";
        const entitlementsSet = await getEntitlements(tenantId);
        setEntitlements(entitlementsSet);
      } else {
        const entitlementsSet = await getEntitlements(session.user.tenantId);
        setEntitlements(entitlementsSet);
      }
      setLoading(false);
    }

    if (session) {
      checkEntitlements();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!entitlements?.has("bookings")) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <h2 className="text-lg font-semibold text-yellow-800">Bookings Module Not Available</h2>
          <p className="text-yellow-700 mt-2">
            The bookings module is not enabled for your tenant. Please contact your administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600 mb-4">Manage your bookings here.</p>
        <form action="/api/bookings" method="post">
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Test Booking
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AuthGuard>
      <BookingsContent />
    </AuthGuard>
  );
}

