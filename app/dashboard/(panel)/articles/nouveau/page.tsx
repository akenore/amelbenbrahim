import type { Metadata } from "next";
import { PostEditor } from "@/components/dashboard/PostEditor";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Nouvel article" };

export default async function NewPostPage() {
  await requireUser("posts");
  return <PostEditor post={null} />;
}
