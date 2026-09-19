import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowCounterClockwiseIcon,
  BellRingingIcon,
  BellSlashIcon,
  CheckCircleIcon,
  EnvelopeSimpleIcon,
  PhoneIcon,
  TrashIcon,
  WarningCircleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { deleteRequest, setRequestStatus } from "@/app/dashboard/actions";
import { ConfirmSubmit, PendingSubmit } from "@/components/dashboard/ui";
import { REQUESTS_PAGE_SIZE, getRequestCounts, getRequests, type RequestWithAlerts } from "@/lib/admin";
import { requireUser } from "@/lib/auth/session";
import { patientTypes } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";
import { alertRecipients, whatsappConfig } from "@/lib/notify/whatsapp";

export const metadata: Metadata = { title: "Demandes de rendez-vous" };

const tabs = {
  nouvelles: { label: "À traiter", status: "new", count: "new" },
  traitees: { label: "Traitées", status: "handled", count: "handled" },
  toutes: { label: "Toutes", status: null, count: "all" },
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
  const me = await requireUser("requests");
  const sp = await searchParams;
  const key = (typeof sp.onglet === "string" && sp.onglet in tabs ? sp.onglet : "nouvelles") as TabKey;
  const [counts, requests, recipients] = await Promise.all([
    getRequestCounts(),
    getRequests(tabs[key].status),
    alertRecipients(),
  ]);
  const alertsReady = whatsappConfig() !== null;

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">Demandes de rendez-vous</h1>
        <p className="mt-2 text-ink-muted">Envoyées depuis le formulaire de la page Contact.</p>
      </header>

      <AlertsBanner ready={alertsReady} recipients={recipients.map((r) => r.name)} isAdmin={me.role === "admin"} />

      <nav aria-label="Filtrer les demandes" className="mt-8 flex flex-wrap gap-2">
        {(Object.keys(tabs) as TabKey[]).map((k) => {
          const count = counts[tabs[k].count];
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
                  <p className="mt-1 text-[13px] text-ink-muted">
                    Reçue le {formatDateTime(r.createdAt)}
                    {r.status === "handled" && r.handledBy && r.handledAt && (
                      <>
                        {" "}
                        · traitée par {r.handledBy} le {formatDateTime(r.handledAt)}
                      </>
                    )}
                  </p>
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

              <AlertStatus request={r} />

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

      {requests.length === REQUESTS_PAGE_SIZE && (
        <p className="mt-6 text-center text-[13px] text-ink-muted">
          Seules les {REQUESTS_PAGE_SIZE} demandes les plus récentes sont affichées.
        </p>
      )}
    </div>
  );
}

function AlertsBanner({ ready, recipients, isAdmin }: { ready: boolean; recipients: string[]; isAdmin: boolean }) {
  const box = "mt-6 flex items-start gap-3 rounded-2xl px-5 py-4 text-[14px] leading-relaxed ring-1";
  if (!ready) {
    return (
      <p className={`${box} bg-ink/3 text-ink-soft ring-line`}>
        <BellSlashIcon size={20} weight="light" className="mt-0.5 shrink-0" />
        <span>
          Alertes WhatsApp inactives : le serveur n’a pas encore les accès WhatsApp Business.
          {isAdmin && " Renseignez WHATSAPP_TOKEN et WHATSAPP_PHONE_NUMBER_ID (voir le README)."}
        </span>
      </p>
    );
  }
  if (recipients.length === 0) {
    return (
      <p className={`${box} bg-gold-soft text-gold-ink ring-gold/30`}>
        <BellSlashIcon size={20} weight="light" className="mt-0.5 shrink-0" />
        <span>
          Personne ne reçoit encore d’alerte WhatsApp pour les nouvelles demandes.{" "}
          <Link href="/dashboard/compte#alertes" className="underline underline-offset-4">
            Activer les alertes
          </Link>
        </span>
      </p>
    );
  }
  return (
    <p className={`${box} bg-ink/3 text-ink-soft ring-line`}>
      <BellRingingIcon size={20} weight="light" className="mt-0.5 shrink-0 text-gold-ink" />
      <span>
        Chaque nouvelle demande est signalée sur WhatsApp à {recipients.join(", ")}.{" "}
        <Link href="/dashboard/compte#alertes" className="underline underline-offset-4">
          Mes alertes
        </Link>
      </span>
    </p>
  );
}

function AlertStatus({ request }: { request: RequestWithAlerts }) {
  if (request.alerts.length === 0) return null;
  const sent = request.alerts.filter((a) => a.status === "sent");
  const failed = request.alerts.filter((a) => a.status === "failed");
  return (
    <div className="mt-5 space-y-1 text-[13px]">
      {sent.length > 0 && (
        <p className="flex items-center gap-2 text-ink-muted">
          <WhatsappLogoIcon size={16} weight="light" className="shrink-0" />
          Alerte envoyée à {sent.map((a) => a.recipientName).join(", ")}
        </p>
      )}
      {failed.length > 0 && (
        <p className="flex items-center gap-2 text-danger" title={failed.map((a) => a.error).filter(Boolean).join(" · ")}>
          <WarningCircleIcon size={16} weight="light" className="shrink-0" />
          Alerte non remise à {failed.map((a) => a.recipientName).join(", ")}
        </p>
      )}
    </div>
  );
}
