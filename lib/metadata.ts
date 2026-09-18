import type { Metadata } from "next";
import { site } from "@/lib/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article" | "profile";
  absoluteTitle?: boolean;
  article?: { publishedTime: string; modifiedTime: string };
};

const defaultImage = { url: "/og/cover.jpg", width: 1200, height: 630, alt: "Dr. Amel Ben Brahim, orthodontiste à Nabeul" };

/** Complete per-page metadata: Next.js replaces (not merges) openGraph objects. */
export function pageMeta({ title, description, path, image, type = "website", absoluteTitle, article }: PageMeta): Metadata {
  const img = image ?? defaultImage;
  const ogTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "fr_TN",
      siteName: site.name,
      url: path,
      title: ogTitle,
      description,
      images: [img],
      ...(type === "article" && article
        ? { publishedTime: article.publishedTime, modifiedTime: article.modifiedTime, authors: [site.name] }
        : {}),
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [img.url] },
  };
}
