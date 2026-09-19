"use client";

import { useActionState, useState } from "react";
import { UserPlusIcon } from "@phosphor-icons/react";
import { createUser, type TeamFormState } from "@/app/dashboard/team-actions";
import { SecretNotice } from "@/components/dashboard/team/SecretNotice";
import { PASSWORD_MIN } from "@/lib/auth/policy";
import { roles, type Role } from "@/lib/auth/roles";

const field =
  "w-full rounded-2xl bg-bg px-4 py-3 text-[15px] ring-1 ring-line-strong transition-shadow placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-gold-ink aria-invalid:ring-danger";

export function NewMemberForm() {
  const [state, action, pending] = useActionState<TeamFormState, FormData>(createUser, { status: "idle" });
  const [dismissed, setDismissed] = useState<number | undefined>();
  const [role, setRole] = useState<Role>("editor");
  const e = state.errors ?? {};
  const showSecret = state.secret && state.nonce !== dismissed;

  return (
    <div className="rounded-[1.75rem] bg-elevated p-6 ring-1 ring-line md:p-8">
      <h2 className="font-display flex items-center gap-3 text-2xl">
        <UserPlusIcon size={24} weight="light" className="text-gold-ink" /> Ajouter un membre
      </h2>

      {showSecret && state.secret ? (
        <div className="mt-6 space-y-4">
          <p className="text-[14px] text-ink-soft">{state.message}</p>
          <SecretNotice {...state.secret} onClose={() => setDismissed(state.nonce)} />
        </div>
      ) : (
        <form action={action} className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="nm-name" className="text-[13px] text-ink-soft">
              Nom complet
            </label>
            <input id="nm-name" name="name" required aria-invalid={Boolean(e.name)} className={field} placeholder="Ex. Sonia Trabelsi" />
            {e.name && <p className="text-[13px] text-danger">{e.name}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="nm-email" className="text-[13px] text-ink-soft">
              E-mail de connexion
            </label>
            <input id="nm-email" name="email" type="email" required autoComplete="off" aria-invalid={Boolean(e.email)} className={field} />
            {e.email && <p className="text-[13px] text-danger">{e.email}</p>}
          </div>

          <fieldset className="md:col-span-2">
            <legend className="mb-3 text-[13px] text-ink-soft">Rôle</legend>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {(Object.keys(roles) as Role[]).map((key) => (
                <label
                  key={key}
                  className={`cursor-pointer rounded-2xl p-4 ring-1 transition-colors ${
                    role === key ? "bg-gold-soft ring-gold" : "ring-line-strong hover:ring-gold/60"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={key}
                    checked={role === key}
                    onChange={() => setRole(key)}
                    className="sr-only"
                  />
                  <span className="block text-[15px]">{roles[key].label}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-ink-muted">{roles[key].description}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label htmlFor="nm-password" className="text-[13px] text-ink-soft">
              Mot de passe temporaire (facultatif)
            </label>
            <input
              id="nm-password"
              name="password"
              type="text"
              autoComplete="new-password"
              minLength={PASSWORD_MIN}
              aria-invalid={Boolean(e.password)}
              className={`${field} md:max-w-md`}
              placeholder="Laissez vide pour en générer un automatiquement"
            />
            {e.password ? (
              <p className="text-[13px] text-danger">{e.password}</p>
            ) : (
              <p className="text-[12px] text-ink-muted">La personne le remplacera à sa première connexion.</p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 md:col-span-2">
            {state.status === "error" && state.message ? <p className="text-[14px] text-danger">{state.message}</p> : <span />}
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-btn px-6 py-3 text-[14px] text-btn-ink transition-transform duration-500 ease-luxe active:scale-[0.98] disabled:opacity-50"
            >
              {pending ? "Création…" : "Créer le compte"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
