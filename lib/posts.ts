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

/** Home page news: the featured post first, then the most recent. */
export async function getHomeNews(limit = 3) {
  const rows = await getDb()
    .select()
    .from(posts)
    .where(isLive())
    .orderBy(desc(posts.featured), desc(posts.publishedAt))
    .limit(limit);
  return rows.map(toPost);
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
