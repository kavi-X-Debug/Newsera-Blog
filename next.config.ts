import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // External news images vary by host; keep lazy loading without on-the-fly optimization
    unoptimized: true,
  },
};

export default nextConfig;
