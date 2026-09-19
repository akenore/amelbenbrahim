import { sql } from "drizzle-orm";
import { boolean, check, customType, index, integer, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import type { MediaImage } from "@/lib/data/types";

// Column names are snake_case in PostgreSQL (casing option in lib/db/index.ts and drizzle.config.ts).

const bytea = customType<{ data: Buffer; driverData: Buffer }>({ dataType: () => "bytea" });
const createdAt = () => timestamp({ withTimezone: true }).notNull().defaultNow();

export const users = pgTable(
  "users",
  {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    email: text().notNull(),
    role: text({ enum: ["admin", "editor", "assistant"] }).notNull(),
    passwordHash: text().notNull(),
    active: boolean().notNull().default(true),
    /** Incremented to revoke every open session of this user. */
    sessionVersion: integer().notNull().default(1),
    mustChangePassword: boolean().notNull().default(false),
    /** International number, digits only (e.g. 21698123456). */
    whatsapp: text(),
    notifyWhatsapp: boolean().notNull().default(false),
    createdAt: createdAt(),
    lastLoginAt: timestamp({ withTimezone: true }),
  },
  (t) => [
    uniqueIndex("users_email_key").on(t.email),
    check("users_role_check", sql`${t.role} in ('admin', 'editor', 'assistant')`),
  ],
);

export const posts = pgTable(
  "posts",
  {
    id: text().primaryKey(),
    slug: text().notNull(),
    title: text().notNull(),
    excerpt: text().notNull(),
    content: text().notNull(),
    category: text({ enum: ["cabinet", "conseils", "congres"] }).notNull(),
    cover: jsonb().$type<MediaImage>(),
    status: text({ enum: ["draft", "published"] }).notNull(),
    featured: boolean().notNull().default(false),
    publishedAt: timestamp({ withTimezone: true }).notNull(),
    createdAt: createdAt(),
    updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    seoTitle: text().notNull().default(""),
    seoDescription: text().notNull().default(""),
    updatedBy: text(),
  },
  (t) => [
    uniqueIndex("posts_slug_key").on(t.slug),
    index("posts_published_idx").on(t.status, t.publishedAt.desc()),
    // A single featured post keeps the home page composition intentional.
    uniqueIndex("posts_single_featured").on(t.featured).where(sql`${t.featured}`),
    check("posts_category_check", sql`${t.category} in ('cabinet', 'conseils', 'congres')`),
    check("posts_status_check", sql`${t.status} in ('draft', 'published')`),
  ],
);

export const appointmentRequests = pgTable(
  "appointment_requests",
  {
    id: uuid().primaryKey().defaultRandom(),
    createdAt: createdAt(),
    name: text().notNull(),
    phone: text().notNull(),
    email: text().notNull().default(""),
    patient: text({ enum: ["enfant", "adolescent", "adulte"] }).notNull(),
    treatment: text().notNull().default(""),
    preferredTime: text().notNull().default(""),
    message: text().notNull().default(""),
    status: text({ enum: ["new", "handled"] }).notNull().default("new"),
    handledAt: timestamp({ withTimezone: true }),
    handledBy: text(),
  },
  (t) => [
    index("appointment_requests_status_idx").on(t.status, t.createdAt.desc()),
    check("appointment_requests_patient_check", sql`${t.patient} in ('enfant', 'adolescent', 'adulte')`),
    check("appointment_requests_status_check", sql`${t.status} in ('new', 'handled')`),
  ],
);

/** Images uploaded from the dashboard. Kept in the database so the app container stays stateless. */
export const media = pgTable("media", {
  /** Public file name, served at /media/<id>. */
  id: text().primaryKey(),
  mime: text().notNull(),
  data: bytea().notNull(),
  width: integer().notNull(),
  height: integer().notNull(),
  size: integer().notNull(),
  createdAt: createdAt(),
  createdBy: uuid().references(() => users.id, { onDelete: "set null" }),
});

/** One row per WhatsApp alert attempt (new appointment request or test message). */
export const notifications = pgTable(
  "notifications",
  {
    id: uuid().primaryKey().defaultRandom(),
    requestId: uuid().references(() => appointmentRequests.id, { onDelete: "cascade" }),
    userId: uuid().references(() => users.id, { onDelete: "set null" }),
    channel: text({ enum: ["whatsapp"] }).notNull().default("whatsapp"),
    recipient: text().notNull(),
    recipientName: text().notNull(),
    status: text({ enum: ["sent", "failed"] }).notNull(),
    providerId: text(),
    error: text(),
    createdAt: createdAt(),
  },
  (t) => [index("notifications_request_idx").on(t.requestId)],
);

/** Small key/value store for one-off setup steps (seed, legacy import). */
export const appMeta = pgTable("app_meta", {
  key: text().primaryKey(),
  value: text().notNull(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});
