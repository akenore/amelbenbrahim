"use client";

import { useActionState, useState, useTransition } from "react";
import { ArrowsClockwiseIcon, ProhibitIcon, TrashIcon, UserCheckIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { deleteUser, resetUserPassword, updateUser, type TeamFormState } from "@/app/dashboard/team-actions";
import { Avatar } from "@/components/dashboard/Avatar";
import { SecretNotice } from "@/components/dashboard/team/SecretNotice";
import { roles, type Role } from "@/lib/auth/roles";
import type { TeamMember } from "@/lib/data/types";
import { formatDateTime } from "@/lib/format";

const iconBtn =
  "flex h-10 w-10 items-center justify-center rounded-full text-ink-soft ring-1 ring-line-strong transition-colors hover:bg-gold-soft hover:text-ink hover:ring-gold disabled:opacity-40";

function MemberRow({ member, isSelf }: { member: TeamMember; isSelf: boolean }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [resetState, resetAction, resetting] = useActionState<TeamFormState, FormData>(resetUserPassword, { status: "idle" });
  const [dismissed, setDismissed] = useState<number | undefined>();

  function update(fields: Record<string, string>) {
    const fd = new FormData();
    fd.set("id", member.id);
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    setError(null);
    startTransition(async () => {
      const res = await updateUser(fd);
      if (!res.ok) setError(res.error);
    });
  }

  function remove() {
    if (!window.confirm(`Supprimer définitivement le compte de ${member.name} ?`)) return;
    const fd = new FormData();
    fd.set("id", member.id);
    setError(null);
    startTransition(async () => {
      const res = await deleteUser(fd);
      if (!res.ok) setError(res.error);
    });
  }

  return (
    <li className={`rounded-3xl bg-elevated p-5 ring-1 ring-line transition-opacity md:p-6 ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Avatar name={member.name} muted={!member.active} />
          <div className="min-w-0">
            <p className="flex flex-wrap items-center gap-2">
              <span className="truncate text-[16px]">{member.name}</span>
              {isSelf && <span className="rounded-full bg-gold-soft px-2 py-0.5 text-[11px] text-gold-ink">Vous</span>}
              {!member.active && (
                <span className="rounded-full bg-ink/6 px-2 py-0.5 text-[11px] text-ink-muted">Désactivé</span>
              )}
              {member.active && member.mustChangePassword && (
                <span className="rounded-full bg-ink/6 px-2 py-0.5 text-[11px] text-ink-muted">Mot de passe temporaire</span>
              )}
            </p>
            <p className="truncate text-[13px] text-ink-muted">
              {member.email} · {member.lastLoginAt ? `dernière connexion le ${formatDateTime(member.lastLoginAt)}` : "jamais connecté"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`role-${member.id}`}>
            Rôle de {member.name}
          </label>
          <select
            id={`role-${member.id}`}
            value={member.role}
            disabled={isSelf || pending}
            onChange={(e) => update({ role: e.target.value })}
            className="rounded-full bg-bg px-4 py-2.5 text-[14px] ring-1 ring-line-strong focus:outline-none focus:ring-2 focus:ring-gold-ink disabled:opacity-60"
          >
            {(Object.keys(roles) as Role[]).map((key) => (
              <option key={key} value={key}>
                {roles[key].label}
              </option>
            ))}
          </select>
          {!isSelf && (
            <>
              <form action={resetAction}>
                <input type="hidden" name="id" value={member.id} />
                <button
                  type="submit"
                  disabled={resetting}
                  className={iconBtn}
                  title="Réinitialiser le mot de passe"
                  aria-label={`Réinitialiser le mot de passe de ${member.name}`}
                  onClick={(e) => {
                    if (!window.confirm(`Générer un nouveau mot de passe pour ${member.name} ? Ses sessions ouvertes seront fermées.`)) e.preventDefault();
                  }}
                >
                  <ArrowsClockwiseIcon size={17} weight="light" />
                </button>
              </form>
              <button
                type="button"
                disabled={pending}
                onClick={() => update({ active: String(!member.active) })}
                className={iconBtn}
                title={member.active ? "Désactiver le compte" : "Réactiver le compte"}
                aria-label={member.active ? `Désactiver le compte de ${member.name}` : `Réactiver le compte de ${member.name}`}
              >
                {member.active ? <ProhibitIcon size={17} weight="light" /> : <UserCheckIcon size={17} weight="light" />}
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={remove}
                className={`${iconBtn} hover:bg-danger/10! hover:text-danger! hover:ring-danger!`}
                title="Supprimer le compte"
                aria-label={`Supprimer le compte de ${member.name}`}
              >
                <TrashIcon size={17} weight="light" />
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-center gap-2 text-[14px] text-danger">
          <WarningCircleIcon size={16} weight="light" /> {error}
        </p>
      )}
      {resetState.status === "error" && resetState.message && <p className="mt-4 text-[14px] text-danger">{resetState.message}</p>}
      {resetState.secret && resetState.nonce !== dismissed && (
        <div className="mt-5">
          <SecretNotice {...resetState.secret} onClose={() => setDismissed(resetState.nonce)} />
        </div>
      )}
    </li>
  );
}

export function MemberList({ members, selfId }: { members: TeamMember[]; selfId: string }) {
  return (
    <ul className="space-y-3">
      {members.map((m) => (
        <MemberRow key={m.id} member={m} isSelf={m.id === selfId} />
      ))}
    </ul>
  );
}
