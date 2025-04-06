import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
    domains: ['via.placeholder.com', 'placehold.co'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  // Add this to exclude the not-found page from static generation
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true
};

export default nextConfig;
