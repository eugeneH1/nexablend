"use client"

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { LoginForm } from "@/components/auth/login-form";

export default function Home() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Nexablend</h1>
          <p className="text-lg text-gray-600">Your multi-tenant business platform</p>
        </div>
        <LoginForm />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {session.user.name || session.user.email}!</h1>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <Link href="/bookings" className="text-blue-600 hover:underline">
            Go to Bookings →
          </Link>
        </div>
      </div>
    </div>
  );
}

