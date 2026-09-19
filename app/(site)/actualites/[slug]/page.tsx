import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Markdown } from "@/components/news/Markdown";
import { PostCard, PostMeta } from "@/components/news/PostCard";
import { ShareLinks } from "@/components/news/ShareLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/site/PageHeader";
import { getPublishedPost, getRelatedPosts } from "@/lib/posts";
import { absolute, articleSchema, breadcrumbs } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/actualites/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return pageMeta({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/actualites/${post.slug}`,
    type: "article",
    article: { publishedTime: post.publishedAt, modifiedTime: post.updatedAt },
    image: post.cover
      ? { url: post.cover.src, width: post.cover.width, height: post.cover.height, alt: post.cover.alt }
      : undefined,
  });
}

export default async function ArticlePage({ params }: PageProps<"/actualites/[slug]">) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const related = await getRelatedPosts(post);

  return (
    <>
      <article>
        <header className="mx-auto max-w-350 px-4 pb-12 pt-32 md:px-8 md:pt-40">
          <Breadcrumbs
            items={[
              { name: "Actualités", href: "/actualites" },
              { name: post.title, href: `/actualites/${post.slug}` },
            ]}
          />
          <div className="mx-auto mt-12 max-w-4xl text-center">
            <PostMeta post={post} className="animate-rise justify-center" />
            <h1
              className="font-display animate-rise mt-6 text-[2.6rem] leading-[1.06] md:text-6xl xl:text-7xl"
              style={{ animationDelay: "0.1s" }}
            >
              {post.title}
            </h1>
            <p
              className="animate-rise mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl"
              style={{ animationDelay: "0.2s" }}
            >
              {post.excerpt}
            </p>
            <div className="animate-rise mt-9 flex items-center justify-center gap-3" style={{ animationDelay: "0.3s" }}>
              <Image src="/img/logo.png" alt="" width={44} height={44} className="h-11 w-11 rounded-full" />
              <div className="text-left text-sm leading-tight">
                <p>Dr. Amel Ben Brahim</p>
                <p className="text-ink-muted">Orthodontiste à Nabeul</p>
              </div>
            </div>
          </div>
        </header>

        {post.cover && (
          <div className="mx-auto max-w-350 px-4 md:px-8">
            <div className="animate-fade rounded-[2.5rem] bg-ink/3 p-2 ring-1 ring-line" style={{ animationDelay: "0.3s" }}>
              <div className="relative aspect-4/3 overflow-hidden rounded-4xl md:aspect-21/9">
                <Image src={post.cover.src} alt={post.cover.alt} fill preload sizes="100vw" className="object-cover" />
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto grid max-w-350 grid-cols-1 gap-10 px-4 py-20 md:px-8 md:py-28 lg:grid-cols-12">
          <aside className="lg:col-span-2 lg:col-start-2">
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-xs uppercase tracking-[0.22em] text-ink-muted">Partager</p>
              <ShareLinks url={absolute(`/actualites/${post.slug}`)} title={post.title} />
            </div>
          </aside>
          <div className="min-w-0 lg:col-span-7">
            <Markdown>{post.content}</Markdown>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="a-lire" className="border-t border-line bg-sunken">
          <div className="mx-auto max-w-350 px-4 py-16 md:px-8 md:py-24">
            <h2 id="a-lire" className="font-display text-4xl leading-[1.08] md:text-5xl">
              À lire aussi
            </h2>
            <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="pt-16 md:pt-24">
        <CtaBlock />
      </div>
      <JsonLd data={articleSchema(post)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Actualités", path: "/actualites" },
          { name: post.title, path: `/actualites/${post.slug}` },
        ])}
      />
    </>
  );
}
