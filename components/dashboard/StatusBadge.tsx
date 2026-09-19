import type { Post } from "@/lib/data/types";

export function postState(post: Post) {
  if (post.status === "draft") return "draft" as const;
  return post.publishedAt > new Date().toISOString() ? ("scheduled" as const) : ("published" as const);
}

const styles = {
  published: { label: "Publié", cls: "bg-success/10 text-success ring-success/30" },
  scheduled: { label: "Programmé", cls: "bg-gold-soft text-gold-ink ring-gold/30" },
  draft: { label: "Brouillon", cls: "bg-ink/5 text-ink-muted ring-line-strong" },
};

export function StatusBadge({ post }: { post: Post }) {
  const s = styles[postState(post)];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] ring-1 ${s.cls}`}>{s.label}</span>;
}
