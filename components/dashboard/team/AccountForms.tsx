"use client";

import { useActionState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { changePassword, updateProfile, type TeamFormState } from "@/app/dashboard/team-actions";
import { PASSWORD_MIN } from "@/lib/auth/policy";
import type { TeamMember } from "@/lib/data/types";

const field =
  "w-full rounded-2xl bg-bg px-4 py-3 text-[15px] ring-1 ring-line-strong transition-shadow focus:outline-none focus:ring-2 focus:ring-gold aria-[invalid=true]:ring-danger";
const panel = "rounded-[1.75rem] bg-elevated p-6 ring-1 ring-line md:p-8";

function Feedback({ state }: { state: TeamFormState }) {
  if (state.status === "success" && state.message) {
    return (
      <p role="status" className="flex items-center gap-2 text-[14px] text-success">
        <CheckCircle size={18} weight="light" /> {state.message}
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
