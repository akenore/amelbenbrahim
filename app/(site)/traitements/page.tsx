import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/site/PageHeader";
import { Picture } from "@/components/ui/Picture";
import { breadcrumbs } from "@/lib/seo";
import { treatments } from "@/lib/treatments";

export const metadata: Metadata = pageMeta({
  title: "Traitements orthodontiques à Nabeul",
  description:
    "Aligneurs invisibles, orthodontie linguale, bagues céramique et métal, orthodontie de l’enfant et de l’adulte, contention : les traitements du cabinet du Dr. Amel Ben Brahim à Nabeul.",
  path: "/traitements",
});

export default function TreatmentsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Traitements", href: "/traitements" }]}
        title={
          <>
            Une technique pour chaque <em className="text-gold-ink">sourire</em>
          </>
        }
        lead="Chaque traitement commence par un bilan complet. Ensemble, nous choisissons la solution la plus juste pour votre situation, votre âge et votre quotidien."
      />

      <section aria-label="Liste des traitements" className="mx-auto max-w-350 px-4 pb-16 md:px-8 md:pb-24">
        <ul className="border-t border-line-strong">
          {treatments.map((t, i) => (
            <li key={t.slug} className="border-b border-line-strong">
              <Reveal delay={i * 0.04} blur={false} y={20}>
                <Link
                  href={`/traitements/${t.slug}`}
                  className="group relative grid grid-cols-1 items-center gap-6 py-10 md:grid-cols-12 md:gap-8 md:py-12"
                >
                  <div className="relative aspect-16/10 overflow-hidden rounded-3xl md:hidden">
                    <Picture photo={t.image} alt="" fill sizes="100vw" className="object-cover" />
                  </div>
                  <h2 className="font-display text-4xl leading-[1.05] transition-transform duration-700 ease-luxe group-hover:translate-x-2 md:col-span-6 md:text-6xl">
                    {t.name}
                  </h2>
                  <p className="max-w-[40ch] leading-relaxed text-ink-soft md:col-span-4">{t.short}</p>
                  <span className="flex h-12 w-12 items-center justify-center justify-self-start rounded-full ring-1 ring-line-strong transition-[transform,background-color] duration-700 ease-luxe group-hover:-rotate-12 group-hover:bg-gold-soft group-hover:ring-gold md:col-span-2 md:justify-self-end">
                    <ArrowUpRightIcon size={18} weight="light" />
                  </span>
                  <div
                    aria-hidden
                    className="pointer-events-none absolute right-[18%] top-1/2 z-10 hidden aspect-4/5 w-56 -translate-y-1/2 rotate-3 scale-90 overflow-hidden rounded-3xl opacity-0 shadow-luxe transition-[opacity,transform] duration-700 ease-luxe group-hover:rotate-0 group-hover:scale-100 group-hover:opacity-100 md:block"
                  >
                    <Picture photo={t.image} alt="" fill sizes="224px" className="object-cover" />
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <CtaBlock />
      <JsonLd data={breadcrumbs([{ name: "Traitements", path: "/traitements" }])} />
    </>
  );
}
