import "server-only";
import { readDatabase } from "@/lib/data/store";

export async function getAllPosts() {
  const db = await readDatabase();
  return [...db.posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getPostById(id: string) {
  const db = await readDatabase();
  return db.posts.find((p) => p.id === id) ?? null;
}

export async function getRequests() {
  const db = await readDatabase();
  return [...db.requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOverview() {
  const db = await readDatabase();
  const now = new Date().toISOString();
  return {
    published: db.posts.filter((p) => p.status === "published" && p.publishedAt <= now).length,
    scheduled: db.posts.filter((p) => p.status === "published" && p.publishedAt > now).length,
    drafts: db.posts.filter((p) => p.status === "draft").length,
    newRequests: db.requests.filter((r) => r.status === "new").length,
    latestRequests: [...db.requests].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4),
    latestPosts: [...db.posts].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 4),
  };
}
