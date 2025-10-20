"use client"

import { signOut, useSession } from "../../lib/auth-client"
import { useState } from "react"

export function UserMenu() {
  const { data: session, isPending } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  if (isPending) {
    return <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
  }

  if (!session) {
    return null
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">
        Welcome, {session.user.name || session.user.email}!
      </span>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "..." : "Sign Out"}
      </button>
    </div>
  )
}
