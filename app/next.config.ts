import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  // Runtime environment variables (server-side)
  // These are read at runtime, not baked in at build time
  serverRuntimeConfig: {
    // Database
    databaseUrl: process.env.DATABASE_URL,
    // Auth
    nextAuthUrl: process.env.NEXTAUTH_URL,
    nextAuthSecret: process.env.NEXTAUTH_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  // Public runtime config (available on client via getConfig)
  publicRuntimeConfig: {
    appName: "WedBeLoving",
    appVersion: process.env.npm_package_version || "1.0.0",
  },
};

export default nextConfig;
