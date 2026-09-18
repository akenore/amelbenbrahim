import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type CtaProps = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost" | "light";
  className?: string;
  external?: boolean;
  icon?: React.ReactNode;
};

const styles = {
  solid: "bg-btn text-btn-ink shadow-luxe",
  ghost: "text-ink ring-1 ring-line-strong hover:ring-gold",
  light: "bg-noir-ink text-[#121212]",
} as const;

const iconStyles = {
  solid: "bg-btn-icon",
  ghost: "bg-gold-soft text-gold-ink",
  light: "bg-black/8",
} as const;

/** Pill CTA with the trailing icon nested in its own circle (button-in-button). */
export function Cta({ href, children, variant = "solid", className = "", external, icon }: CtaProps) {
  const content = (
    <>
      <span className="whitespace-nowrap">{children}</span>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105 ${iconStyles[variant]}`}
      >
        {icon ?? <ArrowUpRight size={16} weight="light" />}
      </span>
    </>
  );
  const cls = `group inline-flex items-center gap-3 rounded-full py-1.5 pl-6 pr-1.5 text-[15px] font-normal tracking-wide transition-[transform,box-shadow,background-color] duration-500 ease-luxe active:scale-[0.98] ${styles[variant]} ${className}`;

  if (external) {
    return (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
