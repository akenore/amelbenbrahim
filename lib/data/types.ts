import type { Role } from "@/lib/auth/roles";

export const postCategories = {
  cabinet: "Vie du cabinet",
  conseils: "Conseils",
  congres: "Congrès et formation",
} as const;

export type PostCategory = keyof typeof postCategories;
export type PostStatus = "draft" | "published";

export type MediaImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: PostCategory;
  cover: MediaImage | null;
  status: PostStatus;
  featured: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  /** Name of the team member who last saved the article (dashboard only). */
  updatedBy?: string;
};

export const patientTypes = {
  enfant: "Enfant",
  adolescent: "Adolescent",
  adulte: "Adulte",
} as const;

export type PatientType = keyof typeof patientTypes;

export type AppointmentRequest = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email: string;
  patient: PatientType;
  treatment: string;
  preferredTime: string;
  message: string;
  status: "new" | "handled";
  handledAt: string | null;
  /** Name of the team member who marked the request as handled. */
  handledBy: string | null;
};

/** WhatsApp alert sent (or attempted) for an appointment request. */
export type RequestAlert = {
  recipientName: string;
  status: "sent" | "failed";
  error: string | null;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  /** Incremented to revoke every open session of this user. */
  sessionVersion: number;
  mustChangePassword: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  /** International number, digits only (e.g. 21698123456). */
  whatsapp: string | null;
  /** Receives a WhatsApp alert for each new appointment request. */
  notifyWhatsapp: boolean;
};

/** User data safe to pass to the dashboard UI. */
export type TeamMember = Omit<AdminUser, "passwordHash" | "sessionVersion">;
