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
};

export type Database = {
  version: 1;
  posts: Post[];
  requests: AppointmentRequest[];
};
