import "server-only";
import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import sharp from "sharp";
import { seedPosts } from "@/lib/data/seed";
import { localStockFor } from "@/lib/data/stock-files";
import type { AppointmentRequest, Post } from "@/lib/data/types";
import { databaseUrl } from "@/lib/db";
import * as schema from "@/lib/db/schema";

type SetupDb = PostgresJsDatabase<typeof schema>;

// Held while migrating, so two containers starting together never race.
const MIGRATION_LOCK = 726_310_001;

// Runtime-only locations: excluded from output file tracing.
const MIGRATIONS_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), "drizzle");
const LEGACY_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR ?? path.join(process.cwd(), ".data"));

/**
 * Runs once per server start (instrumentation.ts): applies pending migrations,
 * then, on a brand-new database, imports the former JSON store if one exists
 * (DATA_DIR/db.json and its uploads) or adds the starter articles.
 */
export async function prepareDatabase() {
  const client = postgres(databaseUrl(), { max: 1, connect_timeout: 15, onnotice: () => undefined });
  const db = drizzle({ client, schema, casing: "snake_case" });
  try {
    await client`select pg_advisory_lock(${MIGRATION_LOCK})`;
    await migrate(db, { migrationsFolder: MIGRATIONS_DIR });

    const [initialized] = await db.select().from(schema.appMeta).where(eq(schema.appMeta.key, "initialized"));
    if (!initialized) {
      const legacyFile = path.join(LEGACY_DIR, "db.json");
      const summary = existsSync(legacyFile) ? await importLegacyStore(db, legacyFile) : await seed(db);
      await db.insert(schema.appMeta).values({ key: "initialized", value: summary }).onConflictDoNothing();
      console.log(`[db] ${summary}`);
    }
  } finally {
    await client`select pg_advisory_unlock(${MIGRATION_LOCK})`.catch(() => undefined);
    await client.end({ timeout: 5 });
  }
}

function postRow(post: Post): typeof schema.posts.$inferInsert {
  // Covers saved while the stock photos were served from Unsplash.
  const local = post.cover && localStockFor(post.cover.src);
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    cover: post.cover && local ? { ...post.cover, src: local.src, width: local.width, height: local.height } : post.cover,
    status: post.status,
    featured: post.featured,
    publishedAt: new Date(post.publishedAt),
    createdAt: new Date(post.createdAt),
    updatedAt: new Date(post.updatedAt),
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    updatedBy: post.updatedBy ?? null,
  };
}

/** Only one post may be featured (unique index): keep the first. */
function singleFeatured(rows: (typeof schema.posts.$inferInsert)[]) {
  let seen = false;
  return rows.map((row) => {
    if (!row.featured) return row;
    if (seen) return { ...row, featured: false };
    seen = true;
    return row;
  });
}

async function seed(db: SetupDb) {
  await db.insert(schema.posts).values(singleFeatured(seedPosts.map(postRow))).onConflictDoNothing();
  return `Base initialisée avec ${seedPosts.length} articles de départ.`;
}

type LegacyUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "assistant";
  passwordHash: string;
  active: boolean;
  sessionVersion?: number;
  mustChangePassword?: boolean;
  createdAt: string;
  lastLoginAt: string | null;
};

type LegacyStore = {
  posts?: Post[];
  requests?: Omit<AppointmentRequest, "handledAt" | "handledBy">[];
  users?: LegacyUser[];
};

const mimeTypes: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

async function importLegacyStore(db: SetupDb, file: string) {
  const legacy = JSON.parse(await readFile(file, "utf8")) as LegacyStore;
  const users = legacy.users ?? [];
  const posts = legacy.posts ?? [];
  const requests = legacy.requests ?? [];

  const uploadsDir = path.join(path.dirname(file), "uploads");
  const uploads = existsSync(uploadsDir)
    ? (await readdir(uploadsDir)).filter((name) => /^[a-z0-9-]+\.(webp|jpg|png)$/.test(name))
    : [];

  await db.transaction(async (tx) => {
    if (users.length) {
      await tx
        .insert(schema.users)
        .values(
          users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email.trim().toLowerCase(),
            role: u.role,
            passwordHash: u.passwordHash,
            active: u.active,
            sessionVersion: u.sessionVersion ?? 1,
            mustChangePassword: u.mustChangePassword ?? false,
            createdAt: new Date(u.createdAt),
            lastLoginAt: u.lastLoginAt ? new Date(u.lastLoginAt) : null,
          })),
        )
        .onConflictDoNothing();
    }
    if (posts.length) {
      await tx.insert(schema.posts).values(singleFeatured(posts.map(postRow))).onConflictDoNothing();
    }
    if (requests.length) {
      await tx
        .insert(schema.appointmentRequests)
        .values(
          requests.map((r) => ({
            id: r.id,
            createdAt: new Date(r.createdAt),
            name: r.name,
            phone: r.phone,
            email: r.email ?? "",
            patient: r.patient,
            treatment: r.treatment ?? "",
            preferredTime: r.preferredTime ?? "",
            message: r.message ?? "",
            status: r.status,
          })),
        )
        .onConflictDoNothing();
    }
    for (const name of uploads) {
      const data = await readFile(path.join(uploadsDir, name));
      const meta = await sharp(data).metadata();
      await tx
        .insert(schema.media)
        .values({
          id: name,
          mime: mimeTypes[path.extname(name)],
          data,
          width: meta.width ?? 0,
          height: meta.height ?? 0,
          size: data.byteLength,
        })
        .onConflictDoNothing();
    }
  });

  return `Données importées depuis ${file} : ${users.length} comptes, ${posts.length} articles, ${requests.length} demandes, ${uploads.length} images.`;
}
