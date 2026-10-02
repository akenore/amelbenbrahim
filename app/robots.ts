import type { MetadataRoute } from "next";
import { noIndex, site } from "@/lib/site";

// Read at request time: SITE_NOINDEX is a runtime setting.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  if (noIndex()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  // The assistants that cite sources (ChatGPT, Claude, Perplexity, Gemini, Copilot) are
  // listed explicitly: the practice wants to appear in their answers, and the audit tools
  // look for the rule rather than assuming the default.
  const aiAssistants = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",
    "Applebot-Extended",
  ];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard"] },
      { userAgent: aiAssistants, allow: "/", disallow: ["/dashboard"] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
