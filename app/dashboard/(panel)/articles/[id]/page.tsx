import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { deletePost } from "@/app/dashboard/actions";
import { PostEditor } from "@/components/dashboard/PostEditor";
import { ConfirmSubmit } from "@/components/dashboard/ui";
import { getPostById } from "@/lib/admin";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Modifier l’article" };

export default async function EditPostPage({ params, searchParams }: PageProps<"/dashboard/articles/[id]">) {
  await requireUser("posts");
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <>
      {/* key: fresh editor state when another article is opened */}
      <PostEditor key={post.id} post={post} created={sp.cree === "1"} />
      <form action={deletePost} className="mx-auto mt-16 max-w-7xl border-t border-line pt-8">
        <input type="hidden" name="id" value={post.id} />
        <ConfirmSubmit
          message={`Supprimer définitivement « ${post.title} » ? Cette action est irréversible.`}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[14px] text-danger ring-1 ring-danger/40 transition-colors hover:bg-danger/10"
        >
          <Trash size={16} weight="light" /> Supprimer l’article
        </ConfirmSubmit>
      </form>
    </>
  );
}
