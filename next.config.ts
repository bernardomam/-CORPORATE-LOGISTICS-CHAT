import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = (process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "https://corporate-logistics-chat-mo7z.vercel.app" : "http://localhost:3002")).replace(/\/+$/, "");
    return [{ source: "/api/:path*", destination: backend + "/api/:path*" }];
  },
  allowedDevOrigins: ["192.168.15.3"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;