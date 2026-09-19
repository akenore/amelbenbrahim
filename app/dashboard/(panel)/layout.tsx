import Link from "next/link";
import { ShieldWarningIcon } from "@phosphor-icons/react/dist/ssr";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { getOverview } from "@/lib/admin";
import { can } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const newRequests = can(user.role, "requests") ? (await getOverview()).newRequests : 0;
  return (
    <div className="lg:flex">
      <Sidebar user={user} newRequests={newRequests} />
      <div className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-12">
        {user.mustChangePassword && (
          <Link
            href="/dashboard/compte#mot-de-passe"
            className="mx-auto mb-8 flex max-w-6xl items-center gap-3 rounded-2xl bg-gold-soft px-5 py-4 text-[14px] text-gold-ink ring-1 ring-gold/30"
          >
            <ShieldWarningIcon size={20} weight="light" className="shrink-0" />
            Vous utilisez un mot de passe temporaire. Choisissez votre mot de passe personnel dans « Mon compte ».
          </Link>
        )}
        {children}
      </div>
    </div>
  );
}
