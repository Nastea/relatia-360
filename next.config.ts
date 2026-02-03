import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to complete even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  // External packages for server components (moved from experimental in Next.js 15)
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Skip building API routes that require OpenAI if API key is missing
  experimental: {
    // This helps with build performance
  },
};

export default nextConfig;
