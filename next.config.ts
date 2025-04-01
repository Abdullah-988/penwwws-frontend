import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow images from any HTTPS source
      },
      {
        protocol: "http",
        hostname: "**", // Allow images from any HTTP source (optional, less secure)
      },
    ],
    unoptimized: true, // Allow locally uploaded images without optimization
  },
};

export default nextConfig;
