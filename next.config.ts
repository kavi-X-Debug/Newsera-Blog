import type { NextConfig } from "next";

const LISTINGS = ["tech", "cybersecurity", "sports", "business", "politics", "science"];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // External news images vary by host; keep lazy loading without on-the-fly optimization
    unoptimized: true,
  },
  async rewrites() {
    // Keep the public `?page=N` URLs, but serve them from pre-built, cacheable pages.
    return {
      beforeFiles: [
      ...LISTINGS.map((slug) => ({
        source: `/${slug}`,
        has: [{ type: "query" as const, key: "page", value: "(?<page>\\d+)" }],
        destination: `/${slug}/page/:page`,
      })),
      {
        source: "/",
        has: [{ type: "query" as const, key: "page", value: "(?<page>\\d+)" }],
        destination: "/news-page/:page",
      },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
