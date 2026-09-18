import Image from "next/image";
import Link from "next/link";
import { postCategories, type Post } from "@/lib/data/types";
import { formatDate, readingTime } from "@/lib/format";

export function PostMeta({ post, className = "", compact = false }: { post: Post; className?: string; compact?: boolean }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-muted ${className}`}>
      <span className="text-gold-ink">{postCategories[post.category]}</span>
      <span aria-hidden className="h-px w-4 bg-line-strong" />
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      {!compact && (
        <>
          <span aria-hidden className="h-px w-4 bg-line-strong" />
          <span>{readingTime(post.content)} min de lecture</span>
        </>
      )}
    </p>
  );
}

export function PostCover({ post, sizes, className = "" }: { post: Post; sizes: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[calc(2rem-0.375rem)] bg-sunken ${className}`}>
      {post.cover ? (
        <Image
          src={post.cover.src}
          alt={post.cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--gold-soft),transparent_60%)]" />
      )}
    </div>
  );
}

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="group">
      <Link href={`/actualites/${post.slug}`} className="block">
        <div className="rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
          <PostCover
            post={post}
            sizes={priority ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className={priority ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3]"}
          />
        </div>
        <div className="px-2 pt-6">
          <PostMeta post={post} />
          <h3 className={`font-display mt-3 leading-[1.15] ${priority ? "text-3xl md:text-4xl" : "text-2xl md:text-[1.75rem]"}`}>
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-3 leading-relaxed text-ink-soft">{post.excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
