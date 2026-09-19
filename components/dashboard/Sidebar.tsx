"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowSquareOut, Newspaper, SignOut, SquaresFour, Tray, UsersThree } from "@phosphor-icons/react";
import { logout } from "@/app/dashboard/actions";
import { Monogram } from "@/components/brand/Monogram";
import { Avatar } from "@/components/dashboard/Avatar";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { can, roles, type Area } from "@/lib/auth/roles";
import type { TeamMember } from "@/lib/data/types";

const links: { href: string; label: string; Icon: typeof SquaresFour; exact?: boolean; area?: Area }[] = [
  { href: "/dashboard", label: "Vue d’ensemble", Icon: SquaresFour, exact: true },
  { href: "/dashboard/articles", label: "Articles", Icon: Newspaper, area: "posts" },
  { href: "/dashboard/demandes", label: "Demandes de RDV", Icon: Tray, area: "requests" },
  { href: "/dashboard/utilisateurs", label: "Utilisateurs", Icon: UsersThree, area: "users" },
];

export function Sidebar({ user, newRequests }: { user: TeamMember; newRequests: number }) {
  const pathname = usePathname();
  const active = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));
  const visible = links.filter((l) => !l.area || can(user.role, l.area));

  return (
    <aside className="sticky top-0 z-20 border-b border-line bg-bg/85 backdrop-blur-xl lg:h-[100dvh] lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-full items-center gap-2 px-4 py-3 lg:flex-col lg:items-stretch lg:px-5 lg:py-7">
        <Link href="/dashboard" className="flex items-center gap-3 lg:px-2">
          <Monogram strokeWidth={30} className="h-7 w-auto text-gold" />
          <span className="hidden text-[13px] uppercase tracking-[0.2em] text-ink-muted sm:inline">Espace cabinet</span>
        </Link>

        <nav aria-label="Tableau de bord" className="ml-auto lg:ml-0 lg:mt-12">
          <ul className="flex gap-1 lg:flex-col">
            {visible.map(({ href, label, Icon, exact }) => {
              const on = active(href, exact);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={on ? "page" : undefined}
                    title={label}
                    className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-[14.5px] transition-colors duration-300 lg:px-4 ${
                      on ? "bg-btn text-btn-ink" : "text-ink-soft hover:bg-gold-soft hover:text-ink"
                    }`}
                  >
                    <Icon size={20} weight="light" />
                    <span className="hidden md:inline">{label}</span>
                    {href === "/dashboard/demandes" && newRequests > 0 && (
                      <span
                        className={`ml-auto rounded-full px-2 py-0.5 text-[12px] ${on ? "bg-btn-icon" : "bg-gold-soft text-gold-ink"}`}
                        aria-label={`${newRequests} nouvelles demandes`}
                      >
                        {newRequests}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1 lg:mt-auto lg:flex-col lg:items-stretch lg:gap-1">
          <Link
            href="/dashboard/compte"
            aria-current={pathname.startsWith("/dashboard/compte") ? "page" : undefined}
            className={`flex items-center gap-3 rounded-2xl p-1.5 transition-colors lg:mb-3 lg:p-2 ${
              pathname.startsWith("/dashboard/compte") ? "bg-gold-soft" : "hover:bg-gold-soft"
            }`}
            title="Mon compte"
          >
            <Avatar name={user.name} size="sm" />
            <span className="hidden min-w-0 lg:block">
              <span className="block truncate text-[14px]">{user.name}</span>
              <span className="block text-[12px] text-ink-muted">{roles[user.role].label}</span>
            </span>
          </Link>
          <a
            href="/"
            target="_blank"
            className="hidden items-center gap-3 rounded-full px-3 py-2.5 text-[14.5px] text-ink-soft hover:bg-gold-soft hover:text-ink sm:flex lg:px-4"
          >
            <ArrowSquareOut size={20} weight="light" />
            <span className="hidden lg:inline">Voir le site</span>
          </a>
          <form action={logout}>
            <button
              type="submit"
              title="Déconnexion"
              className="flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-[14.5px] text-ink-soft hover:bg-gold-soft hover:text-ink lg:px-4"
            >
              <SignOut size={20} weight="light" />
              <span className="hidden lg:inline">Déconnexion</span>
            </button>
          </form>
          <ThemeToggle className="lg:ml-1" />
        </div>
      </div>
    </aside>
  );
}
