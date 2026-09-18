import "server-only";
import { cache } from "react";
import { readDatabase } from "@/lib/data/store";
import type { Post } from "@/lib/data/types";

const byDateDesc = (a: Post, b: Post) => b.publishedAt.localeCompare(a.publishedAt);

export const getPublishedPosts = cache(async () => {
  const db = await readDatabase();
  const now = new Date().toISOString();
  return db.posts.filter((p) => p.status === "published" && p.publishedAt <= now).sort(byDateDesc);
});

export const getPublishedPost = cache(async (slug: string) => {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
});

/** Home page news: featured posts first, then the most recent. */
export async function getHomeNews(limit = 3) {
  const posts = await getPublishedPosts();
  const featured = posts.filter((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getRelatedPosts(post: Post, limit = 2) {
  const posts = await getPublishedPosts();
  const others = posts.filter((p) => p.id !== post.id);
  const same = others.filter((p) => p.category === post.category);
  return [...same, ...others.filter((p) => p.category !== post.category)].slice(0, limit);
}
