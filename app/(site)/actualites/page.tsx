import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsGrid } from "@/components/news/NewsGrid";
import { PageHeader } from "@/components/site/PageHeader";
import { getPublishedPosts } from "@/lib/posts";
import { breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Actualités et conseils en orthodontie",
  description:
    "Conseils d’orthodontie, vie du cabinet et congrès : les actualités du Dr. Amel Ben Brahim, orthodontiste à Nabeul.",
  path: "/actualites",
});

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Actualités", href: "/actualites" }]}
        title={
          <>
            Actualités et <em className="text-gold-ink">conseils</em>
          </>
        }
        lead="La vie du cabinet, des conseils pour prendre soin de votre sourire et les temps forts de la formation continue."
      />
      <section aria-label="Articles" className="mx-auto max-w-350 px-4 pb-16 md:px-8 md:pb-24">
        <NewsGrid posts={posts} />
      </section>
      <JsonLd data={breadcrumbs([{ name: "Actualités", path: "/actualites" }])} />
    </>
  );
}
