import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, EyeSlash, NotePencil, Plus, Star, Trash } from "@phosphor-icons/react/dist/ssr";
import { deletePost, setPostStatus } from "@/app/dashboard/actions";
import { postState, StatusBadge } from "@/components/dashboard/StatusBadge";
import { ConfirmSubmit, PendingSubmit } from "@/components/dashboard/ui";
import { getAllPosts } from "@/lib/admin";
import { postCategories } from "@/lib/data/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Articles" };

const filters = {
  tous: { label: "Tous", match: () => true },
  publies: { label: "Publiés", match: (s: string) => s === "published" },
  programmes: { label: "Programmés", match: (s: string) => s === "scheduled" },
  brouillons: { label: "Brouillons", match: (s: string) => s === "draft" },
} as const;

type FilterKey = keyof typeof filters;

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-line-strong text-ink-soft transition-colors hover:bg-gold-soft hover:text-ink hover:ring-gold";

export default async function ArticlesPage({ searchParams }: PageProps<"/dashboard/articles">) {
  const sp = await searchParams;
  const key = (typeof sp.filtre === "string" && sp.filtre in filters ? sp.filtre : "tous") as FilterKey;
  const all = await getAllPosts();
  const posts = all.filter((p) => filters[key].match(postState(p)));

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">Articles</h1>
          <p className="mt-2 text-ink-muted">
            Les articles publiés apparaissent dans les Actualités et sur la page d’accueil.
          </p>
        </div>
        <Link
          href="/dashboard/articles/nouveau"
          className="group inline-flex items-center gap-3 self-start rounded-full bg-btn py-1.5 pl-5 pr-1.5 text-btn-ink transition-transform duration-500 ease-luxe active:scale-[0.98] md:self-auto"
        >
          Nouvel article
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-btn-icon">
            <Plus size={16} weight="light" />
          </span>
        </Link>
      </header>

      {sp.supprime && (
        <p role="status" className="mt-6 rounded-2xl bg-gold-soft px-5 py-3 text-[14px] text-gold-ink">
          L’article a été supprimé.
        </p>
      )}

      <nav aria-label="Filtrer les articles" className="mt-8 flex flex-wrap gap-2">
        {(Object.keys(filters) as FilterKey[]).map((k) => {
          const count = all.filter((p) => filters[k].match(postState(p))).length;
          return (
            <Link
              key={k}
              href={k === "tous" ? "/dashboard/articles" : `/dashboard/articles?filtre=${k}`}
              aria-current={k === key ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[14px] ring-1 transition-colors ${
                k === key ? "bg-btn text-btn-ink ring-transparent" : "text-ink-soft ring-line-strong hover:text-ink"
              }`}
            >
              {filters[k].label} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </nav>

      {posts.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] bg-elevated px-8 py-16 text-center ring-1 ring-line">
          <p className="font-display text-2xl">Aucun article ici.</p>
          <p className="mt-2 text-ink-muted">Rédigez votre premier article pour alimenter les actualités du site.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {posts.map((p) => {
            const state = postState(p);
            return (
              <li key={p.id} className="flex flex-col gap-4 rounded-[1.5rem] bg-elevated p-4 ring-1 ring-line sm:flex-row sm:items-center">
                <Link href={`/dashboard/articles/${p.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-sunken">
                    {p.cover && <Image src={p.cover.src} alt="" fill sizes="80px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-normal">
                      {p.featured && <Star size={14} weight="fill" className="shrink-0 text-gold" aria-label="À la une" />}
                      <span className="truncate">{p.title}</span>
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
                      <StatusBadge post={p} />
                      <span>{postCategories[p.category]}</span>
                      <span aria-hidden>·</span>
                      <span>{formatDate(p.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center gap-2 sm:shrink-0">
                  <Link href={`/dashboard/articles/${p.id}`} className={iconBtn} aria-label="Modifier">
                    <NotePencil size={17} weight="light" />
                  </Link>
                  {state === "published" && (
                    <a href={`/actualites/${p.slug}`} target="_blank" className={iconBtn} aria-label="Voir sur le site">
                      <ArrowUpRight size={17} weight="light" />
                    </a>
                  )}
                  <form action={setPostStatus}>
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="status" value={p.status === "published" ? "draft" : "published"} />
                    <PendingSubmit className={iconBtn} ariaLabel={p.status === "published" ? "Repasser en brouillon" : "Publier"}>
                      {p.status === "published" ? <EyeSlash size={17} weight="light" /> : <Eye size={17} weight="light" />}
                    </PendingSubmit>
                  </form>
                  <form action={deletePost}>
                    <input type="hidden" name="id" value={p.id} />
                    <ConfirmSubmit
                      message={`Supprimer définitivement « ${p.title} » ?`}
                      ariaLabel="Supprimer"
                      className={`${iconBtn} hover:!bg-danger/10 hover:!text-danger hover:!ring-danger`}
                    >
                      <Trash size={17} weight="light" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
