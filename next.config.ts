import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "developer.apple.com" },
      { hostname: "upload.wikimedia.org" },
    ],
  },
};

export default nextConfig;
