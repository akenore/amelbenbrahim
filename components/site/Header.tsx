"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRightIcon, InstagramLogoIcon, FacebookLogoIcon, PhoneIcon } from "@phosphor-icons/react";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { nav, site } from "@/lib/site";

const ease = [0.32, 0.72, 0, 1] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > 480 && y > prev + 4);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-4 pt-4 md:pt-5">
        <motion.header
          animate={{ y: hidden && !open ? -110 : 0 }}
          transition={{ duration: 0.7, ease }}
          className={`pointer-events-auto flex w-full max-w-295 items-center justify-between gap-4 rounded-full py-2 pl-2 pr-2 transition-[background-color,box-shadow] duration-700 ease-luxe lg:w-max lg:justify-start ${
            scrolled || open
              ? "bg-elevated/75 shadow-luxe ring-1 ring-line backdrop-blur-xl"
              : "bg-elevated/40 ring-1 ring-line backdrop-blur-md"
          }`}
        >
          <Link href="/" className="flex items-center gap-3 rounded-full pr-2" onClick={() => setOpen(false)}>
            <Image src="/img/logo.png" alt="" width={40} height={40} className="h-10 w-10 rounded-full" preload />
            <span className="flex flex-col leading-none">
              <span className="font-display text-[17px] tracking-tight">Dr. Amel Ben Brahim</span>
              <span className="mt-1 text-[11px] uppercase tracking-[0.22em] text-ink-muted">Orthodontiste</span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block" onMouseLeave={() => setHovered(null)}>
            <ul className="flex items-center">
              {nav.map((item) => (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    onMouseEnter={() => setHovered(item.href)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`relative z-10 block rounded-full px-4 py-2.5 text-[14.5px] transition-colors duration-500 ease-luxe ${
                      isActive(item.href) ? "text-gold-ink" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-hover"
                      className="absolute inset-0 rounded-full bg-gold-soft"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/contact#rendez-vous"
              className="group hidden items-center gap-2 rounded-full bg-btn py-1.5 pl-5 pr-1.5 text-[14px] text-btn-ink transition-transform duration-500 ease-luxe active:scale-[0.98] sm:flex"
            >
              Prendre rendez-vous
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-btn-icon transition-transform duration-500 ease-luxe group-hover:translate-x-0.5 group-hover:-translate-y-px">
                <ArrowUpRightIcon size={14} weight="light" />
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="relative flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line lg:hidden"
            >
              <span
                className={`absolute h-px w-5 bg-ink transition-transform duration-500 ease-luxe ${open ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                className={`absolute h-px w-5 bg-ink transition-transform duration-500 ease-luxe ${open ? "-rotate-45" : "translate-y-1"}`}
              />
            </button>
          </div>
        </motion.header>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease } }}
            transition={{ duration: 0.5, ease }}
            className="fixed inset-0 z-30 flex flex-col bg-bg/90 px-6 pb-10 pt-32 backdrop-blur-2xl lg:hidden"
          >
            <nav aria-label="Navigation mobile" className="flex-1">
              <ul className="flex flex-col gap-2">
                {[{ href: "/", label: "Accueil" }, ...nav].map((item, i) => (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: 56, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0 }}
                      transition={{ duration: 0.8, ease, delay: 0.08 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`font-display block py-1 text-5xl leading-tight ${
                          (item.href === "/" ? pathname === "/" : isActive(item.href)) ? "text-gold-ink italic" : "text-ink"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
              className="flex flex-col gap-5 border-t border-line pt-6"
            >
              <Link
                href="/contact#rendez-vous"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-full bg-btn py-2 pl-6 pr-2 text-btn-ink"
              >
                Prendre rendez-vous
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-btn-icon">
                  <ArrowUpRightIcon size={16} weight="light" />
                </span>
              </Link>
              <div className="flex items-center justify-between text-sm text-ink-soft">
                <a href={site.phones.landline.href} className="flex items-center gap-2">
                  <PhoneIcon size={18} weight="light" /> {site.phones.landline.display}
                </a>
                <div className="flex gap-4">
                  <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <InstagramLogoIcon size={22} weight="light" />
                  </a>
                  <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FacebookLogoIcon size={22} weight="light" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
