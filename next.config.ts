import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  // External packages for server components (moved from experimental in Next.js 15)
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default nextConfig;
