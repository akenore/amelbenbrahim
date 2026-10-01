import "server-only";
import { cache } from "react";
import { and, desc, eq, lte, ne, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { toPost } from "@/lib/db/mappers";
import { posts } from "@/lib/db/schema";
import type { Post } from "@/lib/data/types";

/** Published and not scheduled for later. */
const isLive = () => and(eq(posts.status, "published"), lte(posts.publishedAt, sql`now()`));

export const getPublishedPosts = cache(async () => {
  const rows = await getDb().select().from(posts).where(isLive()).orderBy(desc(posts.publishedAt));
  return rows.map(toPost);
});

export const getPublishedPost = cache(async (slug: string) => {
  const [row] = await getDb()
    .select()
    .from(posts)
    .where(and(isLive(), eq(posts.slug, slug)))
    .limit(1);
  return row ? toPost(row) : null;
});

/** Home page news: the articles put « à la une » from the dashboard, most recent first. */
export async function getHomeNews(limit = 3) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(and(isLive(), eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return rows.map(toPost);
}

/** Tells apart « nothing published yet » from « nothing chosen for the home page ». */
export async function hasPublishedPosts() {
  const [row] = await getDb().select({ id: posts.id }).from(posts).where(isLive()).limit(1);
  return Boolean(row);
}

/** Same category first, then the most recent. */
export async function getRelatedPosts(post: Post, limit = 2) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(and(isLive(), ne(posts.id, post.id)))
    .orderBy(desc(sql`${posts.category} = ${post.category}`), desc(posts.publishedAt))
    .limit(limit);
  return rows.map(toPost);
}
