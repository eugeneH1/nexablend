"use client"

import Link from "next/link"
import { useSession } from "@/lib/auth-client"
import { UserMenu } from "@/components/auth/user-menu"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Nexablend
            </Link>
            {session && (
              <div className="ml-8 flex space-x-4">
                <Link
                  href="/bookings"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Bookings
                </Link>
                {/* Add more navigation links for other modules */}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}