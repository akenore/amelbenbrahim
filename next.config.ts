import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
    // Illustrative photography (Unsplash license). Practice photos stay local.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com", pathname: "/photo-**" }],
    // Keep optimized copies for a month so a slow or unreachable source rarely matters.
    minimumCacheTTL: 2678400,
  },
  experimental: {
    // Cover photos are uploaded through a Server Action from the dashboard.
    serverActions: { bodySizeLimit: "12mb" },
    proxyClientMaxBodySize: "12mb",
  },
  async redirects() {
    // Keep the URLs of the previous WordPress site working.
    return [
      { source: "/about", destination: "/docteur", permanent: true },
      { source: "/offerings", destination: "/traitements", permanent: true },
      { source: "/blog", destination: "/actualites", permanent: true },
      { source: "/blog/:slug", destination: "/actualites/:slug", permanent: true },
      { source: "/book-now", destination: "/contact", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
