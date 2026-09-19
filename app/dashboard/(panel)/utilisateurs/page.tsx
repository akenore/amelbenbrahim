import type { Metadata } from "next";
import { MemberList } from "@/components/dashboard/team/MemberList";
import { NewMemberForm } from "@/components/dashboard/team/NewMemberForm";
import { getTeam } from "@/lib/admin";
import { roles, type Role } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Utilisateurs" };

export default async function UsersPage() {
  const me = await requireUser("users");
  const team = await getTeam();

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="font-display text-4xl leading-tight md:text-5xl">Utilisateurs</h1>
        <p className="mt-2 max-w-2xl text-ink-muted">
          Donnez accès à votre équipe. Chaque membre a son propre identifiant et ne voit que ce que son rôle autorise.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-8">
          <NewMemberForm />
          <section aria-labelledby="equipe">
            <h2 id="equipe" className="font-display mb-4 text-2xl">
              L’équipe <span className="text-ink-muted">({team.length})</span>
            </h2>
            <MemberList members={team} selfId={me.id} />
          </section>
        </div>

        <aside className="h-fit rounded-[1.75rem] bg-elevated p-6 ring-1 ring-line xl:sticky xl:top-10">
          <h2 className="font-display text-xl">Les rôles</h2>
          <dl className="mt-5 space-y-5">
            {(Object.keys(roles) as Role[]).map((key) => (
              <div key={key}>
                <dt className="text-[14px]">{roles[key].label}</dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-ink-muted">{roles[key].description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 border-t border-line pt-5 text-[13px] leading-relaxed text-ink-muted">
            Les demandes de rendez-vous contiennent des données de patients : ne les ouvrez qu’aux personnes qui en ont
            besoin.
          </p>
        </aside>
      </div>
    </div>
  );
}
