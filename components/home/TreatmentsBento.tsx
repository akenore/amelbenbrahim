import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plant } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "@/components/brand/Monogram";
import { Reveal } from "@/components/motion/Reveal";
import { getTreatment, type Treatment } from "@/lib/treatments";

type Tone = "photo" | "noir" | "tint" | "plain";

const cells: { slug: string; tone: Tone; span: string; minH: string }[] = [
  { slug: "aligneurs-invisibles", tone: "photo", span: "lg:col-span-7 lg:row-span-2", minH: "min-h-[440px] lg:min-h-[640px]" },
  { slug: "orthodontie-linguale", tone: "noir", span: "lg:col-span-5", minH: "min-h-[300px]" },
  { slug: "bagues-ceramique-metal", tone: "photo", span: "lg:col-span-5", minH: "min-h-[320px]" },
  { slug: "orthodontie-enfant", tone: "tint", span: "lg:col-span-4", minH: "min-h-[320px]" },
  { slug: "orthodontie-adulte", tone: "photo", span: "lg:col-span-5", minH: "min-h-[320px]" },
  { slug: "contention", tone: "plain", span: "lg:col-span-3", minH: "min-h-[320px]" },
];

function Arrow({ light }: { light?: boolean }) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform duration-700 ease-luxe group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:scale-105 ${
        light ? "bg-white/15 text-white ring-1 ring-white/25 backdrop-blur-sm" : "bg-gold-soft text-gold-ink"
      }`}
    >
      <ArrowUpRight size={18} weight="light" />
    </span>
  );
}

function Cell({ t, tone }: { t: Treatment; tone: Tone }) {
  const light = tone === "photo" || tone === "noir";
  return (
    <Link
      href={`/traitements/${t.slug}`}
      className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-[calc(2rem-0.375rem)] p-7 md:p-9 ${
        tone === "noir" ? "bg-noir text-noir-ink" : tone === "tint" ? "bg-gold-soft" : tone === "plain" ? "bg-elevated" : "text-white"
      }`}
    >
      {tone === "photo" && (
        <>
          <Image
            src={t.image.src}
            alt=""
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="-z-0 object-cover transition-transform duration-[1.4s] ease-luxe group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        </>
      )}
      {tone === "noir" && (
        <Monogram
          strokeWidth={6}
          className="absolute -right-10 -top-6 w-[70%] text-[#e4c68a] opacity-25 transition-transform duration-[1.4s] ease-luxe group-hover:scale-105"
        />
      )}
      {tone === "tint" && (
        <Plant size={120} weight="thin" className="absolute right-6 top-6 text-gold-ink opacity-50" aria-hidden />
      )}

      <div className="relative flex items-end justify-between gap-6">
        <div>
          <h3 className="font-display text-[1.9rem] leading-[1.08] md:text-[2.3rem]">{t.name}</h3>
          <p className={`mt-3 max-w-[26rem] text-[15px] leading-relaxed ${light ? "text-white/80" : "text-ink-soft"}`}>
            {t.short}
          </p>
        </div>
        <Arrow light={light} />
      </div>
    </Link>
  );
}

export function TreatmentsBento() {
  return (
    <section aria-labelledby="traitements-titre" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
      <Reveal className="max-w-3xl">
        <h2 id="traitements-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
          Des traitements pensés pour chaque âge
        </h2>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
          Du premier bilan de l’enfant aux solutions invisibles de l’adulte, chaque technique est choisie pour votre
          situation, jamais par défaut.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:mt-20 lg:grid-cols-12 lg:gap-5">
        {cells.map((cell, i) => {
          const t = getTreatment(cell.slug);
          if (!t) return null;
          return (
            <Reveal key={cell.slug} delay={(i % 3) * 0.08} blur={false} className={`${cell.span} ${cell.minH}`}>
              <div className="h-full rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
                <Cell t={t} tone={cell.tone} />
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
