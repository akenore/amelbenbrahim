import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import Image from "next/image";
import { Handshake, Medal, Heart } from "@phosphor-icons/react/dist/ssr";
import { CtaBlock } from "@/components/home/CtaBlock";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/site/PageHeader";
import { Cta } from "@/components/ui/Cta";
import { photos } from "@/lib/images";
import { breadcrumbs } from "@/lib/seo";
import { credentials } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Le Dr. Amel Ben Brahim, orthodontiste",
  description:
    "Diplômée de Monastir, ancienne attachée des Hôpitaux de Paris, présidente de l’ATREO : découvrez le parcours du Dr. Amel Ben Brahim, orthodontiste à Nabeul.",
  path: "/docteur",
  type: "profile",
});

const values = [
  {
    title: "Intégrité",
    text: "Des explications honnêtes, un devis clair et un traitement proposé seulement lorsqu’il est utile.",
    Icon: Handshake,
  },
  {
    title: "Excellence",
    text: "Une formation continue et des outils numériques au service de la précision de chaque traitement.",
    Icon: Medal,
  },
  {
    title: "Bienveillance",
    text: "Prendre le temps d’écouter, de rassurer et d’accompagner chaque patient, quel que soit son âge.",
    Icon: Heart,
  },
];

export default function DoctorPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Le docteur", href: "/docteur" }]}
        title={
          <>
            Dr.&nbsp;Amel Ben&nbsp;Brahim, <em className="text-gold-ink">orthodontiste</em>
          </>
        }
        lead="Spécialiste en orthopédie dento-faciale, elle accompagne enfants, adolescents et adultes à Nabeul avec une exigence : un résultat beau, fonctionnel et durable."
      />

      <section className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
          <Reveal blur={false} className="md:col-span-5">
            <div className="rounded-[2.25rem] bg-ink/[0.03] p-2 ring-1 ring-line">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(2.25rem-0.5rem)]">
                <Parallax className="absolute inset-0" distance={50} zoom>
                  <Image
                    src={photos.doctorSmile.src}
                    alt={photos.doctorSmile.alt}
                    fill
                    preload
                    placeholder="blur"
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover object-top"
                  />
                </Parallax>
              </div>
            </div>
          </Reveal>
          <Reveal blur={false} delay={0.1} className="md:col-span-7 md:mt-24">
            <div className="rounded-[2.25rem] bg-ink/[0.03] p-2 ring-1 ring-line">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(2.25rem-0.5rem)]">
                <Parallax className="absolute inset-0" distance={70} zoom>
                  <Image
                    src={photos.doctorScreen.src}
                    alt={photos.doctorScreen.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 768px) 55vw, 100vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="bio-titre" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <h2 id="bio-titre" className="font-display text-4xl leading-[1.08] md:text-5xl">
              Un parcours entre Monastir et Paris
            </h2>
            <div aria-hidden className="mask-signature mt-10 h-14 w-56 bg-gold" />
          </Reveal>
          <Reveal delay={0.1} className="space-y-6 text-lg leading-relaxed text-ink-soft lg:col-span-7">
            <p>
              Diplômée de la Faculté de médecine dentaire de Monastir, le Dr. Amel Ben Brahim s’est spécialisée en
              orthopédie dento-faciale, la discipline qui corrige la position des dents et accompagne la croissance des
              mâchoires.
            </p>
            <p>
              Ancienne attachée des Hôpitaux de Paris et de la Faculté de chirurgie dentaire René Descartes (Paris V),
              elle a exercé dans un environnement hospitalo-universitaire exigeant avant de fonder son cabinet à Nabeul.
            </p>
            <p>
              Aujourd’hui présidente de l’ATREO et conférencière, elle partage son expertise lors de congrès en Tunisie
              et à l’international, notamment sur l’orthodontie numérique et les aligneurs. Au cabinet, cette exigence se
              traduit par des plans de traitement précis et un suivi personnel de chaque patient.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="formation-titre" className="bg-sunken">
        <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-32">
          <Reveal>
            <h2 id="formation-titre" className="font-display max-w-3xl text-4xl leading-[1.08] md:text-5xl">
              Formation et engagements
            </h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
            {credentials.map((c, i) => (
              <Reveal
                key={c.title}
                delay={(i % 3) * 0.06}
                blur={false}
                className={i < 2 ? "md:col-span-3" : "md:col-span-2"}
              >
                <div className="h-full rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
                  <div className="flex h-full flex-col rounded-[calc(2rem-0.375rem)] bg-elevated p-8 md:p-10">
                    <span aria-hidden className="h-2 w-2 rotate-45 bg-gold" />
                    <h3 className="font-display mt-8 text-2xl leading-tight md:text-[1.75rem]">{c.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink-soft">{c.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="valeurs-titre" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-36">
        <Reveal>
          <h2 id="valeurs-titre" className="font-display max-w-3xl text-4xl leading-[1.08] md:text-5xl">
            Trois engagements envers chaque patient
          </h2>
        </Reveal>
        <div className="mt-16 divide-y divide-line-strong border-y border-line-strong">
          {values.map(({ title, text, Icon }, i) => (
            <Reveal key={title} delay={i * 0.06} blur={false}>
              <div className="grid grid-cols-1 items-baseline gap-4 py-10 md:grid-cols-12 md:gap-8">
                <Icon size={34} weight="thin" className="text-gold-ink md:col-span-1" aria-hidden />
                <h3 className="font-display text-3xl md:col-span-4 md:text-4xl">{title}</h3>
                <p className="max-w-[52ch] text-lg leading-relaxed text-ink-soft md:col-span-7">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="equipe-titre" className="mx-auto max-w-[1400px] px-4 pb-24 md:px-8 md:pb-36">
        <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 id="equipe-titre" className="font-display text-4xl leading-[1.08] md:text-5xl">
              Une équipe à vos côtés
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Assistantes, secrétariat et praticienne travaillent ensemble pour que chaque rendez-vous soit fluide, ponctuel
              et chaleureux.
            </p>
            <div className="mt-10">
              <Cta href="/traitements" variant="ghost">
                Voir les traitements
              </Cta>
            </div>
          </Reveal>
          <Reveal blur={false} delay={0.1} className="lg:col-span-8">
            <div className="rounded-[2.25rem] bg-ink/[0.03] p-2 ring-1 ring-line">
              <div className="relative aspect-[3/2] overflow-hidden rounded-[calc(2.25rem-0.5rem)]">
                <Image src={photos.team.src} alt={photos.team.alt} fill placeholder="blur" sizes="(min-width: 1024px) 65vw, 100vw" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBlock />
      <JsonLd data={breadcrumbs([{ name: "Le docteur", path: "/docteur" }])} />
    </>
  );
}
