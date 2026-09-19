import Link from "next/link";
import { ArrowUpRightIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { MonogramDraw } from "@/components/brand/MonogramDraw";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

/** The one deliberate colour block of the page: the logo's black and gold. */
export function CtaBlock() {
  return (
    <section aria-labelledby="rdv-titre" className="px-4 pb-24 md:px-8 md:pb-32">
      <div className="mx-auto max-w-350 rounded-[2.75rem] bg-[#0d0d0e]/4 p-2 ring-1 ring-line">
        <div className="relative isolate overflow-hidden rounded-[2.25rem] bg-[#0d0d0e] px-6 py-20 text-[#f3efe6] md:px-16 md:py-28">
          <MonogramDraw
            className="pointer-events-none absolute -bottom-16 -right-10 -z-10 w-[80%] text-[#e4c68a] opacity-30 md:-right-20 md:w-[55%]"
            strokeWidth={5}
          />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top_left,rgb(228_198_138/0.14),transparent_55%)]" />

          <Reveal className="max-w-3xl">
            <h2 id="rdv-titre" className="font-display text-4xl leading-[1.06] md:text-7xl">
              Votre sourire commence par <em className="text-[#e4c68a]">une rencontre.</em>
            </h2>
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-[#f3efe6]/75">
              Réservez votre bilan orthodontique au cabinet, à Nabeul. Nous vous recontactons pour fixer le créneau qui vous
              convient.
            </p>
          </Reveal>

          <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center gap-3">
            <Link
              href="/contact#rendez-vous"
              className="group inline-flex items-center gap-3 rounded-full bg-[#e4c68a] py-1.5 pl-6 pr-1.5 text-[15px] text-[#121212] transition-transform duration-500 ease-luxe active:scale-[0.98]"
            >
              Prendre rendez-vous
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 transition-transform duration-500 ease-luxe group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:scale-105">
                <ArrowUpRightIcon size={16} weight="light" />
              </span>
            </Link>
            <a
              href={site.phones.landline.href}
              className="inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[15px] ring-1 ring-white/20 transition-colors duration-500 ease-luxe hover:ring-[#e4c68a]"
            >
              <PhoneIcon size={18} weight="light" /> {site.phones.landline.display}
            </a>
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-[15px] ring-1 ring-white/20 transition-colors duration-500 ease-luxe hover:ring-[#e4c68a]"
            >
              <WhatsappLogoIcon size={18} weight="light" /> WhatsApp
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
