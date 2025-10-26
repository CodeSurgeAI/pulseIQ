import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed even if there are ESLint warnings/errors.
  // This does NOT disable ESLint in dev; it only skips the blocking step during `next build`.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
