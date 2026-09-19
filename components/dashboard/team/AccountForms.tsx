"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { changePassword, sendWhatsappTest, updateAlerts, updateProfile, type TeamFormState } from "@/app/dashboard/team-actions";
import { PASSWORD_MIN } from "@/lib/auth/policy";
import type { TeamMember } from "@/lib/data/types";
import { formatWhatsapp } from "@/lib/phone";

const field =
  "w-full rounded-2xl bg-bg px-4 py-3 text-[15px] ring-1 ring-line-strong transition-shadow focus:outline-none focus:ring-2 focus:ring-gold-ink aria-invalid:ring-danger";
const panel = "rounded-[1.75rem] bg-elevated p-6 ring-1 ring-line md:p-8";

function Feedback({ state }: { state: TeamFormState }) {
  if (state.status === "success" && state.message) {
    return (
      <p role="status" className="flex items-center gap-2 text-[14px] text-success">
        <CheckCircleIcon size={18} weight="light" /> {state.message}
      </p>
    );
  }
  if (state.status === "error" && state.message) return <p role="alert" className="text-[14px] text-danger">{state.message}</p>;
  return <span />;
}

function Field({
  id,
  label,
  error,
  hint,
  ...input
}: { id: string; label: string; error?: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[13px] text-ink-soft">
        {label}
      </label>
      <input id={id} aria-invalid={Boolean(error)} className={field} {...input} />
      {error ? <p className="text-[13px] text-danger">{error}</p> : hint ? <p className="text-[12px] text-ink-muted">{hint}</p> : null}
    </div>
  );
}

export function ProfileForm({ user }: { user: TeamMember }) {
  const [state, action, pending] = useActionState<TeamFormState, FormData>(updateProfile, { status: "idle" });
  const e = state.errors ?? {};
  return (
    <form action={action} className={panel}>
      <h2 className="font-display text-2xl">Profil</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field id="pf-name" name="name" label="Nom affiché" defaultValue={user.name} required autoComplete="name" error={e.name} />
        <Field id="pf-email" name="email" type="email" label="E-mail de connexion" defaultValue={user.email} required autoComplete="email" error={e.email} />
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <Feedback state={state} />
        <button type="submit" disabled={pending} className="rounded-full bg-btn px-6 py-3 text-[14px] text-btn-ink disabled:opacity-50">
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<TeamFormState, FormData>(changePassword, { status: "idle" });
  const e = state.errors ?? {};
  return (
    <form action={action} id="mot-de-passe" className={`${panel} scroll-mt-24`}>
      <h2 className="font-display text-2xl">Mot de passe</h2>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        <Field id="pw-current" name="current" type="password" label="Mot de passe actuel" required autoComplete="current-password" error={e.current} />
        <Field
          id="pw-new"
          name="password"
          type="password"
          label="Nouveau mot de passe"
          required
          minLength={PASSWORD_MIN}
          autoComplete="new-password"
          error={e.password}
          hint={`${PASSWORD_MIN} caractères minimum.`}
        />
        <Field id="pw-confirm" name="confirm" type="password" label="Confirmation" required autoComplete="new-password" error={e.confirm} />
      </div>
      <div className="mt-6 flex items-center justify-between gap-4">
        <Feedback state={state} />
        <button type="submit" disabled={pending} className="rounded-full bg-btn px-6 py-3 text-[14px] text-btn-ink disabled:opacity-50">
          {pending ? "Modification…" : "Changer le mot de passe"}
        </button>
      </div>
    </form>
  );
}

export function AlertsForm({ user, ready }: { user: TeamMember; ready: boolean }) {
  const [state, action, pending] = useActionState<TeamFormState, FormData>(updateAlerts, { status: "idle" });
  const [test, setTest] = useState<{ ok: boolean; message: string } | null>(null);
  const [testing, startTest] = useTransition();
  const e = state.errors ?? {};

  return (
    <form action={action} id="alertes" className={`${panel} scroll-mt-24`}>
      <h2 className="font-display text-2xl">Alertes WhatsApp</h2>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
        Recevez un message à chaque nouvelle demande de rendez-vous, sans avoir à garder l’espace cabinet ouvert. Le
        message indique le nom du patient, son téléphone et ses disponibilités.
      </p>
      {!ready && (
        <p className="mt-5 rounded-2xl bg-gold-soft px-4 py-3 text-[13px] leading-relaxed text-gold-ink ring-1 ring-gold/30">
          Vous pouvez déjà enregistrer votre numéro : les alertes partiront dès que le compte WhatsApp Business du
          cabinet sera relié au site.
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start">
        <Field
          id="al-whatsapp"
          name="whatsapp"
          type="tel"
          inputMode="tel"
          label="Numéro WhatsApp"
          defaultValue={user.whatsapp ? formatWhatsapp(user.whatsapp) : ""}
          placeholder="98 123 456"
          autoComplete="tel"
          error={e.whatsapp}
          hint="8 chiffres pour un numéro tunisien, sinon l’indicatif du pays (+33…)."
        />
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-bg px-4 py-3 ring-1 ring-line-strong md:mt-7">
          <span className="text-[15px]">Recevoir les alertes</span>
          <input type="checkbox" name="notify" defaultChecked={user.notifyWhatsapp} className="peer sr-only" />
          <span
            aria-hidden
            className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors duration-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:bg-gold peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-ink"
          />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        {test ? (
          <p role={test.ok ? "status" : "alert"} className={`flex items-center gap-2 text-[14px] ${test.ok ? "text-success" : "text-danger"}`}>
            {test.ok ? <CheckCircleIcon size={18} weight="light" /> : <WarningCircleIcon size={18} weight="light" />} {test.message}
          </p>
        ) : (
          <Feedback state={state} />
        )}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!ready || !user.whatsapp || testing}
            title={!user.whatsapp ? "Enregistrez d’abord votre numéro" : undefined}
            onClick={() =>
              startTest(async () => {
                setTest(null);
                setTest(await sendWhatsappTest());
              })
            }
            className="rounded-full px-5 py-3 text-[14px] ring-1 ring-line-strong transition-colors hover:bg-gold-soft hover:ring-gold disabled:opacity-50 disabled:hover:bg-transparent"
          >
            {testing ? "Envoi…" : "Envoyer un test"}
          </button>
          <button
            type="submit"
            disabled={pending}
            onClick={() => setTest(null)}
            className="rounded-full bg-btn px-6 py-3 text-[14px] text-btn-ink disabled:opacity-50"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </form>
  );
}
