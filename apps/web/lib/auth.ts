import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@nexablend/db"

// Load root .env for DATABASE_URL
import path from "node:path"
import dotenv from "dotenv"
dotenv.config({ path: path.join(process.cwd(), "../../.env") })

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NODE_ENV === "production" ? process.env.NEXTAUTH_URL : "",
  ].filter(Boolean) as string[],
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
})

export type Session = typeof auth.$Infer.Session
export type User = import("@prisma/client").User
