import Link from "next/link";
import { CaretRight } from "@phosphor-icons/react/dist/ssr";

type Crumb = { name: string; href: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="animate-fade text-[13px] text-ink-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="hover:text-ink">
            Accueil
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.href} className="flex items-center gap-1.5">
            <CaretRight size={11} weight="light" aria-hidden />
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-ink-soft">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-ink">
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Title block for inner pages. Animations are CSS so they run before hydration. */
export function PageHeader({
  crumbs,
  title,
  lead,
  children,
}: {
  crumbs: Crumb[];
  title: React.ReactNode;
  lead?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mx-auto max-w-[1400px] px-4 pb-14 pt-32 md:px-8 md:pb-20 md:pt-40">
      <Breadcrumbs items={crumbs} />
      <h1
        className="font-display animate-rise mt-8 max-w-5xl text-[2.9rem] leading-[1.04] md:text-7xl xl:text-[5.2rem]"
        style={{ animationDelay: "0.1s" }}
      >
        {title}
      </h1>
      {lead && (
        <p
          className="animate-rise mt-7 max-w-[46rem] text-lg leading-relaxed text-ink-soft md:text-xl"
          style={{ animationDelay: "0.25s" }}
        >
          {lead}
        </p>
      )}
      {children && (
        <div className="animate-rise mt-10" style={{ animationDelay: "0.4s" }}>
          {children}
        </div>
      )}
    </header>
  );
}
