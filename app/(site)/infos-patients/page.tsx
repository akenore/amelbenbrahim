import type { Metadata } from "next";
import { ArrowUpRight, Clock, MapPin, Phone, Warning } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "@/components/brand/Monogram";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/site/PageHeader";
import { Cta } from "@/components/ui/Cta";
import { FaqList } from "@/components/ui/FaqList";
import { Picture } from "@/components/ui/Picture";
import { photos } from "@/lib/images";
import { pageMeta } from "@/lib/metadata";
import { areas, dailyLife, emergencies, firstVisit, visitPhoto } from "@/lib/patient-info";
import { breadcrumbs, faqSchema } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Infos patients : première consultation, conseils et urgences",
  description:
    "Préparer sa première consultation d’orthodontie, vivre au quotidien avec un appareil, réagir en cas d’urgence orthodontique : les conseils du cabinet du Dr. Amel Ben Brahim à Nabeul.",
  path: "/infos-patients",
});

const tones = {
  tint: "bg-gold-soft",
  plain: "bg-elevated",
  noir: "bg-noir text-noir-ink",
  photo: "text-white",
} as const;

export default function PatientInfoPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Infos patients", href: "/infos-patients" }]}
        title={
          <>
            Tout savoir avant <em className="text-gold-ink">votre venue</em>
          </>
        }
        lead="Préparer votre première consultation, prendre soin de votre appareil au quotidien et savoir réagir en cas de petit souci : l’essentiel, réuni en une page."
      >
        <div className="flex flex-wrap gap-3">
          <Cta href="/contact#rendez-vous">Prendre rendez-vous</Cta>
          <Cta href="#urgences" variant="ghost">
            Urgences orthodontiques
          </Cta>
        </div>
      </PageHeader>

      {/* First visit */}
      <section aria-labelledby="premiere" className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8 md:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <h2 id="premiere" className="font-display text-4xl leading-[1.08] md:text-5xl">
                Votre première consultation
              </h2>
              <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-soft">{firstVisit.intro}</p>
            </Reveal>
            <ol className="mt-12 space-y-8">
              {firstVisit.after.map((step, i) => (
                <li key={step.title}>
                  <Reveal delay={i * 0.06} blur={false} className="grid grid-cols-[3rem_1fr] gap-4">
                    <span className="font-display text-3xl leading-none text-gold-ink">{i + 1}</span>
                    <div>
                      <h3 className="font-display text-2xl leading-tight">{step.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink-soft">{step.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          <Reveal blur={false} delay={0.1} className="lg:col-span-5">
            <div className="rounded-[2.25rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
              <div className="overflow-hidden rounded-[calc(2.25rem-0.375rem)] bg-elevated">
                <div className="relative aspect-[16/10]">
                  <Picture photo={visitPhoto} fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover" />
                </div>
                <div className="p-7 md:p-9">
                  <h3 className="text-[11px] uppercase tracking-[0.22em] text-ink-muted">À apporter</h3>
                  <ul className="mt-5 space-y-3.5">
                    {firstVisit.bring.map((item) => (
                      <li key={item} className="flex gap-3.5 leading-relaxed">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Daily life */}
      <section aria-labelledby="quotidien" className="bg-sunken">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
          <Reveal>
            <h2 id="quotidien" className="font-display max-w-3xl text-4xl leading-[1.08] md:text-5xl">
              Au quotidien avec un appareil
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
            {dailyLife.map((card, i) => (
              <Reveal key={card.title} delay={(i % 2) * 0.08} blur={false} className={card.span}>
                <div className="h-full rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
                  <div
                    className={`relative isolate flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-[calc(2rem-0.375rem)] p-8 md:p-10 ${tones[card.tone]}`}
                  >
                    {card.photo && (
                      <>
                        <Picture photo={card.photo} fill sizes="(min-width: 1024px) 40vw, 100vw" className="-z-10 object-cover" />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/5" />
                      </>
                    )}
                    {card.tone === "noir" && (
                      <Monogram strokeWidth={6} className="absolute -right-8 -top-6 -z-10 w-[55%] text-[#e4c68a] opacity-20" />
                    )}
                    <h3 className="font-display text-3xl leading-tight md:text-4xl">{card.title}</h3>
                    <ul className="mt-5 space-y-2.5">
                      {card.points.map((point) => (
                        <li
                          key={point}
                          className={`flex gap-3 leading-relaxed ${card.tone === "photo" || card.tone === "noir" ? "text-white/85" : "text-ink-soft"}`}
                        >
                          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Emergencies */}
      <section id="urgences" aria-labelledby="urgences-titre" className="mx-auto max-w-[1400px] scroll-mt-28 px-4 py-24 md:px-8 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <Reveal>
                <h2 id="urgences-titre" className="font-display text-4xl leading-[1.08] md:text-5xl">
                  Urgences orthodontiques : les bons réflexes
                </h2>
                <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-ink-soft">
                  La plupart des petits incidents ne sont pas graves. Voici comment réagir en attendant votre rendez-vous.
                </p>
                <div className="mt-8 flex items-start gap-4 rounded-2xl bg-gold-soft p-5 text-[15px] leading-relaxed ring-1 ring-gold/30">
                  <Warning size={22} weight="light" className="mt-0.5 shrink-0 text-gold-ink" />
                  <p>
                    En cas de doute, de douleur importante ou de choc sur les dents, appelez le cabinet sans attendre.
                  </p>
                </div>
                <div className="mt-8">
                  <Cta href={site.phones.landline.href} external icon={<Phone size={16} weight="light" />}>
                    {site.phones.landline.display}
                  </Cta>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.1} blur={false} className="lg:col-span-7">
            <FaqList items={emergencies} />
          </Reveal>
        </div>
      </section>

      {/* Access */}
      <section aria-labelledby="venir" className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8 md:pb-32">
        <div className="rounded-[2.25rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
          <div className="grid grid-cols-1 gap-10 rounded-[calc(2.25rem-0.375rem)] bg-elevated p-8 md:p-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 id="venir" className="font-display text-4xl leading-[1.08] md:text-5xl">
                Venir au cabinet
              </h2>
              <div className="mt-8 space-y-5 text-lg">
                <p className="flex gap-4">
                  <MapPin size={24} weight="light" className="mt-1 shrink-0 text-gold-ink" />
                  <span className="leading-relaxed">
                    {site.address.building}, {site.address.street}
                    <br />
                    {site.address.landmark}, {site.address.postalCode} {site.address.city}
                  </span>
                </p>
                <p className="flex gap-4">
                  <Clock size={24} weight="light" className="mt-1 shrink-0 text-gold-ink" />
                  <span>{site.hours}</span>
                </p>
              </div>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-gold-ink underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
              >
                Itinéraire Google Maps <ArrowUpRight size={14} weight="light" />
              </a>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <h3 className="font-display text-2xl">Des patients de tout le Cap Bon</h3>
              <p className="mt-3 max-w-[52ch] leading-relaxed text-ink-soft">
                Au centre de Nabeul, le cabinet accueille des familles venues de toute la région.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {areas.map((a) => (
                  <li key={a} className="rounded-full px-4 py-2 text-[14.5px] ring-1 ring-line-strong">
                    {a}
                  </li>
                ))}
              </ul>
              <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-2xl">
                <Parallax className="absolute inset-0" distance={40} zoom>
                  <Picture photo={photos.lounge} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[50%_40%]" />
                </Parallax>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBlock />
      <JsonLd data={breadcrumbs([{ name: "Infos patients", path: "/infos-patients" }])} />
      <JsonLd data={faqSchema(emergencies)} />
    </>
  );
}
