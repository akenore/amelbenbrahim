import type { Metadata } from "next";
import { PostEditor } from "@/components/dashboard/PostEditor";

export const metadata: Metadata = { title: "Nouvel article" };

export default function NewPostPage() {
  return <PostEditor post={null} />;
}
