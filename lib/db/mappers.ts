import type { appointmentRequests, posts, users } from "@/lib/db/schema";
import type { AdminUser, AppointmentRequest, Post, TeamMember } from "@/lib/data/types";

// Database rows use Date objects; the app passes ISO strings around (and to Client Components).

const iso = (date: Date) => date.toISOString();
const isoOrNull = (date: Date | null) => (date ? date.toISOString() : null);

export function toPost(row: typeof posts.$inferSelect): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    cover: row.cover ?? null,
    status: row.status,
    featured: row.featured,
    publishedAt: iso(row.publishedAt),
    createdAt: iso(row.createdAt),
    updatedAt: iso(row.updatedAt),
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    updatedBy: row.updatedBy ?? undefined,
  };
}

export function toRequest(row: typeof appointmentRequests.$inferSelect): AppointmentRequest {
  return {
    id: row.id,
    createdAt: iso(row.createdAt),
    name: row.name,
    phone: row.phone,
    email: row.email,
    patient: row.patient,
    treatment: row.treatment,
    preferredTime: row.preferredTime,
    message: row.message,
    status: row.status,
    handledAt: isoOrNull(row.handledAt),
    handledBy: row.handledBy,
  };
}

export function toUser(row: typeof users.$inferSelect): AdminUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.passwordHash,
    active: row.active,
    sessionVersion: row.sessionVersion,
    mustChangePassword: row.mustChangePassword,
    createdAt: iso(row.createdAt),
    lastLoginAt: isoOrNull(row.lastLoginAt),
    whatsapp: row.whatsapp,
    notifyWhatsapp: row.notifyWhatsapp,
  };
}

export function toTeamMember(row: typeof users.$inferSelect): TeamMember {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    active: row.active,
    mustChangePassword: row.mustChangePassword,
    createdAt: iso(row.createdAt),
    lastLoginAt: isoOrNull(row.lastLoginAt),
    whatsapp: row.whatsapp,
    notifyWhatsapp: row.notifyWhatsapp,
  };
}
