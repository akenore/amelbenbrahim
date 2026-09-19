import type { MetadataRoute } from "next";
import { noIndex, site } from "@/lib/site";

// Read at request time: SITE_NOINDEX is a runtime setting.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (noIndex()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
