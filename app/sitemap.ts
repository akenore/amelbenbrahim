import type { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { photoUrl } from "@/lib/images";
import { treatments } from "@/lib/treatments";

// Lists the articles currently in the database.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();
  const latest = posts[0]?.updatedAt ?? new Date().toISOString();

  const pages: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/docteur`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/traitements`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/infos-patients`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/actualites`, lastModified: latest, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.8 },
    { url: `${site.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [
    ...pages,
    ...treatments.map((t) => ({
      url: `${site.url}/traitements/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [photoUrl(t.image).startsWith("http") ? photoUrl(t.image) : `${site.url}${photoUrl(t.image)}`],
    })),
    ...posts.map((p) => ({
      url: `${site.url}/actualites/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: p.cover ? [p.cover.src.startsWith("http") ? p.cover.src : `${site.url}${p.cover.src}`] : undefined,
    })),
  ];
}
