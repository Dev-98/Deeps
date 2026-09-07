import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // So the dev server can be opened from a phone on the same wifi —
  // add your machine's LAN address here if it changes.
  allowedDevOrigins: ["192.168.1.238", "*.local"],
};

export default nextConfig;
