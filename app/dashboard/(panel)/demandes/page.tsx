import type { Metadata } from "next";
import Link from "next/link";
import { ArrowCounterClockwiseIcon, CheckCircleIcon, EnvelopeSimpleIcon, PhoneIcon, TrashIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { deleteRequest, setRequestStatus } from "@/app/dashboard/actions";
import { ConfirmSubmit, PendingSubmit } from "@/components/dashboard/ui";
import { getRequests } from "@/lib/admin";
import { requireUser } from "@/lib/auth/session";
import { patientTypes } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Demandes de rendez-vous" };

const tabs = {
  nouvelles: { label: "À traiter", status: "new" },
  traitees: { label: "Traitées", status: "handled" },
  toutes: { label: "Toutes", status: null },
} as const;

type TabKey = keyof typeof tabs;

function formatPhone(phone: string) {
  return /^\d{8}$/.test(phone) ? phone.replace(/(\d{2})(\d{3})(\d{3})/, "$1 $2 $3") : phone;
}

function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits.length === 8 ? `216${digits}` : digits}`;
}

const chip =
  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] ring-1 ring-line-strong transition-colors hover:bg-gold-soft hover:ring-gold";

export default async function RequestsPage({ searchParams }: PageProps<"/dashboard/demandes">) {
  await requireUser("requests");
  const sp = await searchParams;
  const key = (typeof sp.onglet === "string" && sp.onglet in tabs ? sp.onglet : "nouvelles") as TabKey;
  const all = await getRequests();
  const status = tabs[key].status;
  const requests = status ? all.filter((r) => r.status === status) : all;

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">Demandes de rendez-vous</h1>
        <p className="mt-2 text-ink-muted">Envoyées depuis le formulaire de la page Contact.</p>
      </header>

      <nav aria-label="Filtrer les demandes" className="mt-8 flex flex-wrap gap-2">
        {(Object.keys(tabs) as TabKey[]).map((k) => {
          const count = tabs[k].status ? all.filter((r) => r.status === tabs[k].status).length : all.length;
          return (
            <Link
              key={k}
              href={k === "nouvelles" ? "/dashboard/demandes" : `/dashboard/demandes?onglet=${k}`}
              aria-current={k === key ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-[14px] ring-1 transition-colors ${
                k === key ? "bg-btn text-btn-ink ring-transparent" : "text-ink-soft ring-line-strong hover:text-ink"
              }`}
            >
              {tabs[k].label} <span className="opacity-60">{count}</span>
            </Link>
          );
        })}
      </nav>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-[1.75rem] bg-elevated px-8 py-16 text-center ring-1 ring-line">
          <CheckCircleIcon size={40} weight="thin" className="mx-auto text-gold-ink" />
          <p className="font-display mt-4 text-2xl">{key === "nouvelles" ? "Tout est à jour." : "Aucune demande."}</p>
          <p className="mt-2 text-ink-muted">Les nouvelles demandes apparaîtront ici dès leur envoi.</p>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-2">
          {requests.map((r) => (
            <li key={r.id} className="flex flex-col rounded-[1.75rem] bg-elevated p-6 ring-1 ring-line md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-display truncate text-2xl">{r.name}</p>
                  <p className="mt-1 text-[13px] text-ink-muted">Reçue le {formatDateTime(r.createdAt)}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] ring-1 ${
                    r.status === "new" ? "bg-gold-soft text-gold-ink ring-gold/30" : "bg-ink/5 text-ink-muted ring-line-strong"
                  }`}
                >
                  {r.status === "new" ? "À traiter" : "Traitée"}
                </span>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[14px]">
                <div>
                  <dt className="text-ink-muted">Patient</dt>
                  <dd className="mt-0.5">{patientTypes[r.patient]}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Traitement</dt>
                  <dd className="mt-0.5">{r.treatment || "Non précisé"}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Téléphone</dt>
                  <dd className="mt-0.5">{formatPhone(r.phone)}</dd>
                </div>
                <div>
                  <dt className="text-ink-muted">Disponibilités</dt>
                  <dd className="mt-0.5">{r.preferredTime || "Non précisées"}</dd>
                </div>
                {r.message && (
                  <div className="col-span-2">
                    <dt className="text-ink-muted">Message</dt>
                    <dd className="mt-1 whitespace-pre-line rounded-2xl bg-sunken p-4 leading-relaxed">{r.message}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-5">
                <a href={`tel:${r.phone}`} className={chip}>
                  <PhoneIcon size={16} weight="light" /> Appeler
                </a>
                <a href={whatsappLink(r.phone)} target="_blank" rel="noopener noreferrer" className={chip}>
                  <WhatsappLogoIcon size={16} weight="light" /> WhatsApp
                </a>
                {r.email && (
                  <a href={`mailto:${r.email}`} className={chip}>
                    <EnvelopeSimpleIcon size={16} weight="light" /> E-mail
                  </a>
                )}
                <div className="ml-auto flex gap-2">
                  <form action={setRequestStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <input type="hidden" name="status" value={r.status === "new" ? "handled" : "new"} />
                    <PendingSubmit className={`${chip} ${r.status === "new" ? "bg-btn text-btn-ink ring-transparent hover:bg-btn" : ""}`}>
                      {r.status === "new" ? (
                        <>
                          <CheckCircleIcon size={16} weight="light" /> Marquer traitée
                        </>
                      ) : (
                        <>
                          <ArrowCounterClockwiseIcon size={16} weight="light" /> Rouvrir
                        </>
                      )}
                    </PendingSubmit>
                  </form>
                  <form action={deleteRequest}>
                    <input type="hidden" name="id" value={r.id} />
                    <ConfirmSubmit
                      message={`Supprimer la demande de ${r.name} ?`}
                      ariaLabel="Supprimer la demande"
                      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted ring-1 ring-line-strong transition-colors hover:bg-danger/10 hover:text-danger hover:ring-danger"
                    >
                      <TrashIcon size={16} weight="light" />
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
