import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "api.dicebear.com" },
      { hostname: "developer.apple.com" },
      { hostname: "upload.wikimedia.org" },
      { hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
