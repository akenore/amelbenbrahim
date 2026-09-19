"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";
import { z } from "zod";
import { checkBootstrapCredentials } from "@/lib/auth/bootstrap";
import { burnPasswordCheck, hashPassword, verifyPassword } from "@/lib/auth/password";
import { endSession, requireUser, startSession } from "@/lib/auth/session";
import { UPLOADS_DIR, mutateDatabase, readDatabase } from "@/lib/data/store";
import { postCategories, type AdminUser, type MediaImage, type Post, type PostCategory } from "@/lib/data/types";
import { fromTunisInput, slugify } from "@/lib/format";
import { clientIp, rateLimit } from "@/lib/rate-limit";

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

  let user: AdminUser | undefined;
  try {
    const db = await readDatabase();
    user = db.users.find((u) => u.email === email);

    // First run: the ADMIN_EMAIL / ADMIN_PASSWORD pair creates the first administrator.
    // Once an account exists, these variables no longer grant access.
    if (!user && db.users.length === 0) {
      if (!checkBootstrapCredentials(email, password)) {
        await burnPasswordCheck(password);
        return { error: "Identifiants incorrects." };
      }
      const passwordHash = await hashPassword(password);
      user = await mutateDatabase((d) => {
        if (d.users.length > 0) return d.users.find((u) => u.email === email);
        const created: AdminUser = {
          id: randomUUID(),
          name: process.env.ADMIN_NAME?.trim() || "Dr. Amel Ben Brahim",
          email,
          role: "admin",
          passwordHash,
          active: true,
          sessionVersion: 1,
          mustChangePassword: false,
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
        };
        d.users.push(created);
        return created;
      });
    } else if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
      if (!user) await burnPasswordCheck(password);
      return { error: user && !user.active ? "Ce compte est désactivé." : "Identifiants incorrects." };
    }
    if (!user) return { error: "Identifiants incorrects." };

    const id = user.id;
    await mutateDatabase((d) => {
      const u = d.users.find((x) => x.id === id);
      if (u) u.lastLoginAt = new Date().toISOString();
    });
    await startSession(user);
  } catch {
    return { error: "L’accès n’est pas configuré sur le serveur (variable AUTH_SECRET)." };
  }
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

function uniqueSlug(base: string, posts: Post[], selfId: string) {
  const root = slugify(base) || "article";
  let slug = root;
  for (let i = 2; posts.some((p) => p.slug === slug && p.id !== selfId); i++) slug = `${root}-${i}`;
  return slug;
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

  const saved = await mutateDatabase((db) => {
    const slug = uniqueSlug(data.slug || data.title, db.posts, id);
    const existing = db.posts.find((p) => p.id === id);
    if (!isNew && !existing) return null;
    const post: Post = {
      id,
      slug,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      cover,
      status: data.status,
      featured: data.featured,
      publishedAt,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      updatedBy: me.name,
    };
    if (data.featured) {
      // A single featured post keeps the home page composition intentional.
      for (const p of db.posts) if (p.id !== id) p.featured = false;
    }
    if (existing) Object.assign(existing, post);
    else db.posts.unshift(post);
    return post;
  });

  if (!saved) return { status: "error", message: "Cet article n’existe plus." };
  refreshSite();
  if (isNew) redirect(`/dashboard/articles/${id}?cree=1`);
  return { status: "success", savedAt: now, slug: saved.slug, message: "Modifications enregistrées." };
}

export async function deletePost(formData: FormData) {
  await requireUser("posts");
  const id = String(formData.get("id") ?? "");
  const removed = await mutateDatabase((db) => {
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const [post] = db.posts.splice(index, 1);
    const stillUsed = db.posts.some((p) => p.cover?.src === post.cover?.src);
    return { post, stillUsed };
  });
  if (removed?.post.cover?.src.startsWith("/media/") && !removed.stillUsed) {
    await unlink(path.join(UPLOADS_DIR, path.basename(removed.post.cover.src))).catch(() => undefined);
  }
  refreshSite();
  redirect("/dashboard/articles?supprime=1");
}

export async function setPostStatus(formData: FormData) {
  const me = await requireUser("posts");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "published" ? "published" : "draft";
  await mutateDatabase((db) => {
    const post = db.posts.find((p) => p.id === id);
    if (!post) return;
    post.status = status;
    post.updatedAt = new Date().toISOString();
    post.updatedBy = me.name;
    if (status === "published" && post.publishedAt > post.updatedAt) post.publishedAt = post.updatedAt;
  });
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
  await requireUser("posts");
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
    await mkdir(UPLOADS_DIR, { recursive: true });
    const name = `${randomUUID()}.webp`;
    await writeFile(path.join(UPLOADS_DIR, name), data);
    return { ok: true, image: { src: `/media/${name}`, alt: "", width: info.width, height: info.height } };
  } catch {
    return { ok: false, error: "Impossible de lire cette image." };
  }
}

/* ------------------------------------------------------------------ */
/* Appointment requests                                                */
/* ------------------------------------------------------------------ */

export async function setRequestStatus(formData: FormData) {
  await requireUser("requests");
  const id = String(formData.get("id") ?? "");
  const status = formData.get("status") === "handled" ? "handled" : "new";
  await mutateDatabase((db) => {
    const request = db.requests.find((r) => r.id === id);
    if (request) request.status = status;
  });
  revalidatePath("/dashboard", "layout");
}

export async function deleteRequest(formData: FormData) {
  await requireUser("requests");
  const id = String(formData.get("id") ?? "");
  await mutateDatabase((db) => {
    db.requests = db.requests.filter((r) => r.id !== id);
  });
  revalidatePath("/dashboard", "layout");
}
