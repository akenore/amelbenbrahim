import type { NextConfig } from "next";

// Sent with every response. The Content-Security-Policy (with a per-request nonce) is set in proxy.ts.
const securityHeaders = [
  // HTTPS only, for two years (ignored by browsers on plain http, e.g. localhost).
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]
    : []),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), bluetooth=(), browsing-topics=()",
  },
];

// The dashboard shows patient data (its pages are dynamic, so never cached): keep it out of search engines.
const dashboardHeaders = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    qualities: [70, 80, 90],
    formats: ["image/avif", "image/webp"],
    // All images are served from this origin; keep optimized copies for a month.
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
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/dashboard/:path*", headers: dashboardHeaders },
    ];
  },
};

export default nextConfig;
