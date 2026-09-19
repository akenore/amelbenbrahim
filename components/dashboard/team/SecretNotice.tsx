"use client";

import { useState } from "react";
import { Check, Copy, Key } from "@phosphor-icons/react";

/** One-time display of credentials created by an administrator. */
export function SecretNotice({ email, password, onClose }: { email: string; password: string; onClose?: () => void }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(`Espace cabinet : ${location.origin}/dashboard\nE-mail : ${email}\nMot de passe temporaire : ${password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }
  return (
    <div role="status" className="rounded-2xl bg-gold-soft p-5 ring-1 ring-gold/30">
      <p className="flex items-center gap-2 text-[14px] text-gold-ink">
        <Key size={18} weight="light" /> Identifiants à transmettre (affichés une seule fois)
      </p>
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[14px]">
        <dt className="text-ink-muted">E-mail</dt>
        <dd className="break-all">{email}</dd>
        <dt className="text-ink-muted">Mot de passe</dt>
        <dd className="font-mono text-[15px] tracking-wide">{password}</dd>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full bg-btn px-4 py-2 text-[13px] text-btn-ink"
        >
          {copied ? <Check size={14} weight="light" /> : <Copy size={14} weight="light" />}
          {copied ? "Copié" : "Copier les identifiants"}
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-[13px] text-ink-soft ring-1 ring-line-strong">
            J’ai transmis ces informations
          </button>
        )}
      </div>
      <p className="mt-3 text-[12px] text-ink-muted">
        La personne devra choisir son propre mot de passe à sa première connexion.
      </p>
    </div>
  );
}
