// apps/web/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  // keep Prisma native engine external so it stays in node_modules and loads correctly
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;

