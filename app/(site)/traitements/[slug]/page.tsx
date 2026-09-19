import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/site/PageHeader";
import { Cta } from "@/components/ui/Cta";
import { FaqList } from "@/components/ui/FaqList";
import { Picture } from "@/components/ui/Picture";
import { photoUrl } from "@/lib/images";
import { breadcrumbs, faqSchema, treatmentSchema } from "@/lib/seo";
import { getTreatment, treatments } from "@/lib/treatments";

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/traitements/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};
  return pageMeta({
    title: t.seo.title,
    description: t.seo.description,
    path: `/traitements/${t.slug}`,
    image: { url: photoUrl(t.image), alt: t.image.alt },
  });
}

export default async function TreatmentPage({ params }: PageProps<"/traitements/[slug]">) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) notFound();
  const others = treatments.filter((o) => o.slug !== t.slug);

  return (
    <>
      <PageHeader
        crumbs={[
          { name: "Traitements", href: "/traitements" },
          { name: t.name, href: `/traitements/${t.slug}` },
        ]}
        title={t.name}
        lead={t.lead}
      >
        <Cta href="/contact#rendez-vous">Prendre rendez-vous</Cta>
      </PageHeader>

      <div className="mx-auto max-w-350 px-4 md:px-8">
        <div className="animate-fade rounded-[2.5rem] bg-ink/3 p-2 ring-1 ring-line" style={{ animationDelay: "0.3s" }}>
          <div className="relative aspect-4/3 overflow-hidden rounded-4xl md:aspect-21/9">
            <Parallax className="absolute inset-0" distance={80} zoom>
              <Picture photo={t.image} fill preload sizes="100vw" className="object-cover" />
            </Parallax>
          </div>
        </div>
      </div>

      <section aria-labelledby="principe" className="mx-auto max-w-350 px-4 py-16 md:px-8 md:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <h2 id="principe" className="font-display text-4xl leading-[1.08] md:text-5xl">
              Le principe
            </h2>
            <div className="mt-8 space-y-6 text-lg leading-relaxed text-ink-soft">
              {t.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1} blur={false} className="lg:col-span-5">
            <div className="rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line">
              <div className="rounded-[1.625rem] bg-elevated p-8 md:p-10">
                <h2 className="text-xs uppercase tracking-[0.22em] text-ink-muted">Indiqué pour</h2>
                <ul className="mt-6 space-y-4">
                  {t.forWhom.map((item) => (
                    <li key={item} className="flex gap-4 leading-relaxed">
                      <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-ink">
                        <CheckIcon size={12} weight="bold" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="deroulement" className="bg-sunken">
        <div className="mx-auto max-w-350 px-4 py-16 md:px-8 md:py-24">
          <Reveal>
            <h2 id="deroulement" className="font-display text-4xl leading-[1.08] md:text-5xl">
              Comment se déroule le traitement
            </h2>
          </Reveal>
          <ol className={`mt-16 grid grid-cols-1 gap-12 md:gap-8 ${t.steps.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
            {t.steps.map((step, i) => (
              <li key={step.title} className="relative md:pt-10">
                <Reveal delay={i * 0.08} blur={false}>
                  <span aria-hidden className="absolute left-0 right-0 top-0 hidden h-px bg-line-strong md:block" />
                  <span aria-hidden className="absolute left-0 top-[-3.5px] hidden h-2 w-2 rotate-45 bg-gold md:block" />
                  <h3 className="font-display text-2xl leading-tight md:text-[1.7rem]">{step.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="avantages" className="mx-auto max-w-350 px-4 py-16 md:px-8 md:py-24">
        <Reveal>
          <h2 id="avantages" className="font-display text-4xl leading-[1.08] md:text-5xl">
            Pourquoi le choisir
          </h2>
        </Reveal>
        <div className="mt-14 divide-y divide-line-strong border-y border-line-strong">
          {t.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06} blur={false}>
              <div className="grid grid-cols-1 gap-3 py-9 md:grid-cols-12 md:gap-8">
                <h3 className="font-display text-3xl md:col-span-5">{b.title}</h3>
                <p className="max-w-[52ch] text-lg leading-relaxed text-ink-soft md:col-span-7">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="quotidien" className="mx-auto max-w-350 px-4 pb-16 md:px-8 md:pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal blur={false} className="lg:col-span-5">
            <div className="rounded-[2.25rem] bg-ink/3 p-2 ring-1 ring-line">
              <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem]">
                <Parallax className="absolute inset-0" distance={60} zoom>
                  <Picture photo={t.secondary} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </Parallax>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <h2 id="quotidien" className="font-display text-4xl leading-[1.08] md:text-5xl">
              Au quotidien
            </h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Quelques habitudes simples font toute la différence sur le confort et la durée du traitement.
            </p>
            <ul className="mt-10 space-y-6">
              {t.life.map((tip) => (
                <li key={tip} className="flex gap-5 border-t border-line pt-6 text-lg leading-relaxed">
                  <span aria-hidden className="mt-3 h-2 w-2 shrink-0 rotate-45 bg-gold" />
                  {tip}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="questions" className="mx-auto max-w-350 px-4 pb-16 md:px-8 md:pb-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="questions" className="font-display text-4xl leading-[1.08] md:text-5xl">
              Questions fréquentes
            </h2>
          </Reveal>
          <Reveal delay={0.1} blur={false} className="lg:col-span-8">
            <FaqList items={t.faq} />
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="autres" className="mx-auto max-w-350 px-4 pb-16 md:px-8 md:pb-24">
        <h2 id="autres" className="text-xs uppercase tracking-[0.22em] text-ink-muted">
          Autres traitements
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {others.map((o) => (
            <li key={o.slug}>
              <Link
                href={`/traitements/${o.slug}`}
                className="group inline-flex items-center gap-2 rounded-full px-5 py-3 ring-1 ring-line-strong transition-colors duration-500 ease-luxe hover:bg-gold-soft hover:ring-gold"
              >
                {o.name}
                <ArrowUpRightIcon size={14} weight="light" className="transition-transform duration-500 ease-luxe group-hover:-translate-y-px group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <CtaBlock />
      <JsonLd data={treatmentSchema(t)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Traitements", path: "/traitements" },
          { name: t.name, path: `/traitements/${t.slug}` },
        ])}
      />
      <JsonLd data={faqSchema(t.faq)} />
    </>
  );
}
