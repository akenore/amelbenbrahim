"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, count, eq, ne, or, sql } from "drizzle-orm";
import sharp from "sharp";
import { z } from "zod";
import { checkBootstrapCredentials } from "@/lib/auth/bootstrap";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/lib/auth/password";
import { endSession, requireUser, startSession } from "@/lib/auth/session";
import { postCategories, type MediaImage, type PostCategory } from "@/lib/data/types";
import { getDb, pgCode, type Tx } from "@/lib/db";
import { appointmentRequests, media, posts, users } from "@/lib/db/schema";
import { fromTunisInput, slugify } from "@/lib/format";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Refresh every public page that can show posts. */
function refreshSite() {
  revalidatePath("/", "layout");
}

/* ------------------------------------------------------------------ */
/* Session                                                             */
/* ------------------------------------------------------------------ */

export type LoginState = { error?: string };

const landing = { admin: "/dashboard", editor: "/dashboard", assistant: "/dashboard/demandes" } as const;

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = await clientIp();
  if (!rateLimit(`login:${ip}`, 6, 15 * 60 * 1000)) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Renseignez votre e-mail et votre mot de passe." };

  let user: typeof users.$inferSelect | undefined;
  try {
    const db = getDb();
    [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      // First run: the ADMIN_EMAIL / ADMIN_PASSWORD pair creates the first administrator.
      // Once an account exists, these variables no longer grant access.
      const [{ n }] = await db.select({ n: count() }).from(users);
      if (n > 0 || !checkBootstrapCredentials(email, password)) {
        await burnPasswordCheck(password);
        return { error: "Identifiants incorrects." };
      }
      const passwordHash = await hashPassword(password);
      user = await db.transaction(async (tx) => {
        // Two simultaneous first logins still create a single administrator.
        await tx.execute(sql`lock table ${users} in share row exclusive mode`);
        const [existing] = await tx.select().from(users).limit(1);
        if (existing) return existing.email === email ? existing : undefined;
        const [created] = await tx
          .insert(users)
          .values({ name: process.env.ADMIN_NAME?.trim() || "Dr. Amel Ben Brahim", email, role: "admin", passwordHash })
          .returning();
        return created;
      });
      if (!user) return { error: "Identifiants incorrects." };
    } else if (!(await verifyPassword(password, user.passwordHash))) {
      return { error: "Identifiants incorrects." };
    } else if (!user.active) {
      return { error: "Ce compte est désactivé." };
    }

    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));
    await startSession(user);
  } catch (error) {
    console.error("[login]", error);
    return {
      error: String(error).includes("AUTH_SECRET")
        ? "L’accès n’est pas configuré sur le serveur (variable AUTH_SECRET)."
        : "Service momentanément indisponible. Réessayez dans un instant.",
    };
  }
  if (!user) return { error: "Identifiants incorrects." };
  redirect(landing[user.role]);
}

export async function logout() {
  await endSession();
  redirect("/dashboard/connexion");
}

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

export type SavePostState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"title" | "slug" | "excerpt" | "content" | "publishedAt", string>>;
  savedAt?: string;
  slug?: string;
};

const coverSchema = z
  .object({
    // Uploaded media (/media), practice photos (/img) or local stock copies (/img/stock).
    src: z.string().regex(/^\/(media\/|img\/(stock\/)?)[\w-]+(\.[\w-]+)*$/),
    alt: z.string().max(200),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  })
  .nullable();

const postSchema = z.object({
  id: z.string().max(64),
  title: z.string().trim().min(3, "Le titre doit contenir au moins 3 caractères.").max(160, "Titre trop long (160 caractères max)."),
  slug: z.string().trim().max(90),
  excerpt: z.string().trim().min(20, "Rédigez un résumé d’au moins 20 caractères.").max(320, "Résumé trop long (320 caractères max)."),
  content: z.string().trim().min(40, "Le contenu de l’article est trop court."),
  category: z.enum(Object.keys(postCategories) as [PostCategory, ...PostCategory[]]),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  publishedAt: z.string(),
  seoTitle: z.string().trim().max(70, "Titre SEO trop long (70 caractères max)."),
  seoDescription: z.string().trim().max(170, "Description SEO trop longue (170 caractères max)."),
});

async function uniqueSlug(tx: Tx, base: string, selfId: string) {
  const root = slugify(base) || "article";
  // slugify() only outputs [a-z0-9-], so the LIKE pattern needs no escaping.
  const taken = await tx
    .select({ slug: posts.slug })
    .from(posts)
    .where(and(ne(posts.id, selfId), or(eq(posts.slug, root), sql`${posts.slug} like ${`${root}-%`}`)));
  const used = new Set(taken.map((t) => t.slug));
  let slug = root;
  for (let i = 2; used.has(slug); i++) slug = `${root}-${i}`;
  return slug;
}

/**
 * Deletes uploaded images that no article uses any more (as cover or inside its text).
 * With `ids`, only those images, right away; otherwise uploads older than a day
 * (an image added to an unsaved draft is kept meanwhile).
 */
async function removeUnusedMedia(tx: Tx, ids?: string[]) {
  if (ids && ids.length === 0) return;
  const scope = ids ? sql`"media"."id" in ${ids}` : sql`"media"."created_at" < now() - interval '1 day'`;
  await tx.execute(sql`
    delete from ${media}
    where ${scope}
      and not exists (
        select 1 from ${posts} p
        where p.cover->>'src' = '/media/' || "media"."id" or strpos(p.content, '/media/' || "media"."id") > 0
      )`);
}

/** /media/<id> references in a cover and a Markdown text. */
function mediaIds(cover: MediaImage | null, content: string) {
  const ids = new Set(Array.from(content.matchAll(/\/media\/([a-z0-9-]+\.(?:webp|jpg|png))/g), (m) => m[1]));
  if (cover?.src.startsWith("/media/")) ids.add(cover.src.slice("/media/".length));
  return [...ids];
}

export async function savePost(_prev: SavePostState, formData: FormData): Promise<SavePostState> {
  const me = await requireUser("posts");

  const parsed = postSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    content: String(formData.get("content") ?? ""),
    category: String(formData.get("category") ?? "cabinet"),
    status: formData.get("intent") === "publish" ? "published" : formData.get("intent") === "draft" ? "draft" : String(formData.get("status") ?? "draft"),
    featured: formData.get("featured") === "on",
    publishedAt: String(formData.get("publishedAt") ?? ""),
    seoTitle: String(formData.get("seoTitle") ?? ""),
    seoDescription: String(formData.get("seoDescription") ?? ""),
  });

  if (!parsed.success) {
    const errors: SavePostState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<SavePostState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Certains champs sont à corriger.", errors };
  }

  let cover: MediaImage | null = null;
  try {
    cover = coverSchema.parse(JSON.parse(String(formData.get("cover") || "null")));
  } catch {
    return { status: "error", message: "Image de couverture invalide." };
  }

  const data = parsed.data;
  const publishedAt = data.publishedAt ? fromTunisInput(data.publishedAt) : new Date().toISOString();
  if (!publishedAt) return { status: "error", errors: { publishedAt: "Date invalide." }, message: "Date invalide." };

  const now = new Date().toISOString();
  const isNew = !data.id;
  const id = data.id || randomUUID();

  let saved: { slug: string } | null;
  try {
    saved = await getDb().transaction(async (tx) => {
      const [existing] = isNew ? [] : await tx.select().from(posts).where(eq(posts.id, id)).for("update");
      if (!isNew && !existing) return null;
      const slug = await uniqueSlug(tx, data.slug || data.title, id);
      if (data.featured) {
        // A single featured post keeps the home page composition intentional.
        await tx.update(posts).set({ featured: false }).where(and(eq(posts.featured, true), ne(posts.id, id)));
      }
      const values = {
        slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        cover,
        status: data.status,
        featured: data.featured,
        publishedAt: new Date(publishedAt),
        updatedAt: new Date(now),
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        updatedBy: me.name,
      };
      if (existing) await tx.update(posts).set(values).where(eq(posts.id, id));
      else await tx.insert(posts).values({ id, ...values, createdAt: new Date(now) });
      if (existing) await removeUnusedMedia(tx, mediaIds(existing.cover, existing.content));
      await removeUnusedMedia(tx);
      return { slug };
    });
  } catch (error) {
    if (pgCode(error) !== "23505") throw error;
    return { status: "error", message: "Un autre enregistrement a eu lieu au même moment. Réessayez." };
  }

  if (!saved) return { status: "error", message: "Cet article n’existe plus." };
  refreshSite();
  if (isNew) redirect(`/dashboard/articles/${id}?cree=1`);
  return { status: "success", savedAt: now, slug: saved.slug, message: "Modifications enregistrées." };
}

export async function deletePost(formData: FormData) {
  await requireUser("posts");
  const id = String(formData.get("id") ?? "");
  await getDb().transaction(async (tx) => {
    const [removed] = await tx.delete(posts).where(eq(posts.id, id)).returning();
    if (removed) await removeUnusedMedia(tx, mediaIds(removed.cover, removed.content));
    await removeUnusedMedia(tx);
  });
  refreshSite();
  redirect("/dashboard/articles?supprime=1");
}

export async function setPostStatus(formData: FormData) {
  const me = await requireUser("posts");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";
  await getDb()
    .update(posts)
    .set({
      status,
      updatedAt: sql`now()`,
      updatedBy: me.name,
      // Publishing now a post that was scheduled for later.
      ...(status === "published" ? { publishedAt: sql`least(${posts.publishedAt}, now())` } : null),
    })
    .where(eq(posts.id, id));
  refreshSite();
  revalidatePath("/dashboard", "layout");
}

/* ------------------------------------------------------------------ */
/* Images                                                              */
/* ------------------------------------------------------------------ */

export type UploadResult = { ok: true; image: MediaImage } | { ok: false; error: string };

const MAX_UPLOAD = 10 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  const me = await requireUser("posts");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Aucun fichier reçu." };
  if (!ACCEPTED.has(file.type)) return { ok: false, error: "Format non pris en charge (JPG, PNG, WebP ou AVIF)." };
  if (file.size > MAX_UPLOAD) return { ok: false, error: "Image trop lourde (10 Mo maximum)." };

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });
    const name = `${randomUUID()}.webp`;
    await getDb()
      .insert(media)
      .values({ id: name, mime: "image/webp", data, width: info.width, height: info.height, size: data.byteLength, createdBy: me.id });
    return { ok: true, image: { src: `/media/${name}`, alt: "", width: info.width, height: info.height } };
  } catch {
    return { ok: false, error: "Impossible de lire cette image." };
  }
}

/* ------------------------------------------------------------------ */
/* Appointment requests                                                */
/* ------------------------------------------------------------------ */

export async function setRequestStatus(formData: FormData) {
  const me = await requireUser("requests");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "handled" ? "handled" : "new";
  if (!UUID.test(id)) return;
  await getDb()
    .update(appointmentRequests)
    .set(status === "handled" ? { status, handledAt: new Date(), handledBy: me.name } : { status, handledAt: null, handledBy: null })
    .where(eq(appointmentRequests.id, id));
  revalidatePath("/dashboard", "layout");
}

export async function deleteRequest(formData: FormData) {
  await requireUser("requests");
  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) return;
  await getDb().delete(appointmentRequests).where(eq(appointmentRequests.id, id));
  revalidatePath("/dashboard", "layout");
}
