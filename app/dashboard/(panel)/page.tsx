import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, NotePencil, Phone, Plus, ShieldWarning } from "@phosphor-icons/react/dist/ssr";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getOverview } from "@/lib/admin";
import { can } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";
import { patientTypes } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Vue d’ensemble" };

function greeting() {
  const hour = Number(new Intl.DateTimeFormat("fr-FR", { hour: "numeric", hour12: false, timeZone: "Africa/Tunis" }).format(new Date()));
  return hour < 18 ? "Bonjour" : "Bonsoir";
}

const panel = "rounded-[1.75rem] bg-elevated p-6 ring-1 ring-line md:p-8";
const roundBtn =
  "flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-line-strong hover:bg-gold-soft hover:ring-gold";

export default async function OverviewPage({ searchParams }: PageProps<"/dashboard">) {
  const user = await requireUser();
  const sp = await searchParams;
  const o = await getOverview();
  const posts = can(user.role, "posts");
  const requests = can(user.role, "requests");

  const tiles = [
    ...(posts
      ? [
          { label: "Articles publiés", value: o.published, href: "/dashboard/articles?filtre=publies" },
          { label: "Brouillons", value: o.drafts, href: "/dashboard/articles?filtre=brouillons" },
          { label: "Programmés", value: o.scheduled, href: "/dashboard/articles?filtre=programmes" },
        ]
      : []),
    ...(requests
      ? [{ label: "Nouvelles demandes", value: o.newRequests, href: "/dashboard/demandes", accent: o.newRequests > 0 }]
      : []),
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {sp.acces === "refuse" && (
        <p role="alert" className="mb-8 flex items-center gap-3 rounded-2xl bg-danger/10 px-5 py-4 text-[14px] text-danger">
          <ShieldWarning size={20} weight="light" /> Cette section n’est pas accessible avec votre rôle.
        </p>
      )}

      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-ink-muted">
            {greeting()}, {user.name}
          </p>
          <h1 className="font-display mt-2 text-4xl leading-tight md:text-5xl">Vue d’ensemble</h1>
        </div>
        {posts && (
          <Link
            href="/dashboard/articles/nouveau"
            className="group inline-flex items-center gap-3 self-start rounded-full bg-btn py-1.5 pl-5 pr-1.5 text-btn-ink transition-transform duration-500 ease-luxe active:scale-[0.98] md:self-auto"
          >
            Nouvel article
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-btn-icon">
              <Plus size={16} weight="light" />
            </span>
          </Link>
        )}
      </header>

      <div className={`mt-10 grid grid-cols-2 gap-3 ${tiles.length >= 4 ? "lg:grid-cols-4" : tiles.length === 3 ? "lg:grid-cols-3" : ""}`}>
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`group rounded-[1.5rem] p-6 ring-1 transition-colors duration-300 ${
              "accent" in t && t.accent ? "bg-btn text-btn-ink ring-transparent" : "bg-elevated ring-line hover:ring-gold"
            }`}
          >
            <p className={`text-[13px] ${"accent" in t && t.accent ? "opacity-80" : "text-ink-muted"}`}>{t.label}</p>
            <p className="font-display mt-4 text-5xl">{t.value}</p>
          </Link>
        ))}
      </div>

      <div className={`mt-10 grid grid-cols-1 gap-6 ${posts && requests ? "lg:grid-cols-2" : ""}`}>
        {requests && (
          <section aria-labelledby="dernieres-demandes" className={panel}>
            <div className="flex items-center justify-between">
              <h2 id="dernieres-demandes" className="font-display text-2xl">
                Dernières demandes
              </h2>
              <Link href="/dashboard/demandes" className="text-sm text-gold-ink hover:underline">
                Tout voir
              </Link>
            </div>
            {o.latestRequests.length === 0 ? (
              <p className="mt-8 text-ink-muted">
                Aucune demande pour l’instant. Les demandes envoyées depuis la page Contact apparaîtront ici.
              </p>
            ) : (
              <ul className="mt-6 divide-y divide-line">
                {o.latestRequests.map((r) => (
                  <li key={r.id} className="flex items-center gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <p className="truncate">
                        {r.name}
                        {r.status === "new" && (
                          <span className="ml-2 rounded-full bg-gold-soft px-2 py-0.5 text-[11px] text-gold-ink">Nouvelle</span>
                        )}
                      </p>
                      <p className="truncate text-[13px] text-ink-muted">
                        {patientTypes[r.patient]}
                        {r.treatment ? `, ${r.treatment}` : ""} · {formatDateTime(r.createdAt)}
                      </p>
                    </div>
                    <a href={`tel:${r.phone}`} aria-label={`Appeler ${r.name}`} className={roundBtn}>
                      <Phone size={16} weight="light" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {posts && (
          <section aria-labelledby="derniers-articles" className={panel}>
            <div className="flex items-center justify-between">
              <h2 id="derniers-articles" className="font-display text-2xl">
                Derniers articles
              </h2>
              <Link href="/dashboard/articles" className="text-sm text-gold-ink hover:underline">
                Tout voir
              </Link>
            </div>
            <ul className="mt-6 divide-y divide-line">
              {o.latestPosts.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate">{p.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-[13px] text-ink-muted">
                      <StatusBadge post={p} />
                      <span className="truncate">
                        modifié le {formatDateTime(p.updatedAt)}
                        {p.updatedBy ? ` par ${p.updatedBy}` : ""}
                      </span>
                    </div>
                  </div>
                  <Link href={`/dashboard/articles/${p.id}`} aria-label={`Modifier ${p.title}`} className={roundBtn}>
                    <NotePencil size={16} weight="light" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <a href="/" target="_blank" className="mt-10 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink">
        Voir le site <ArrowUpRight size={14} weight="light" />
      </a>
    </div>
  );
}
