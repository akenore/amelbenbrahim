"use client";

import { useActionState } from "react";
import { ArrowRightIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { login, type LoginState } from "@/app/dashboard/actions";

const field =
  "w-full rounded-2xl bg-elevated px-4 py-3.5 text-[16px] ring-1 ring-line-strong transition-shadow focus:outline-none focus:ring-2 focus:ring-gold";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-[14px] text-ink-soft">
          Adresse e-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="username" required className={field} />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-[14px] text-ink-soft">
          Mot de passe
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={field} />
      </div>
      {state.error && (
        <p role="alert" className="flex items-start gap-2 text-[14px] text-danger">
          <WarningCircleIcon size={18} weight="light" className="mt-0.5 shrink-0" /> {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="group mt-2 flex items-center justify-between rounded-full bg-btn py-1.5 pl-6 pr-1.5 text-btn-ink transition-[transform,opacity] duration-500 ease-luxe active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Connexion…" : "Se connecter"}
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-btn-icon transition-transform duration-500 ease-luxe group-hover:translate-x-0.5">
          <ArrowRightIcon size={16} weight="light" />
        </span>
      </button>
    </form>
  );
}
