"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { stock, type Photo } from "@/lib/images";

type Profile = {
  key: string;
  label: string;
  age: string;
  title: string;
  text: string;
  points: string[];
  photo: Photo;
  links: { href: string; label: string }[];
};

const profiles: Profile[] = [
  {
    key: "enfants",
    label: "Enfants",
    age: "De 6 à 12 ans",
    title: "Guider la croissance",
    text: "Dès 7 ans, un premier bilan permet de repérer un décalage des mâchoires, un manque de place ou une habitude qui gêne la croissance. Souvent, une simple surveillance suffit.",
    points: [
      "Dépistage précoce des troubles de croissance",
      "Appareils adaptés à l’âge et bien tolérés",
      "Conseils aux parents : succion du pouce, respiration, déglutition",
    ],
    photo: stock.child,
    links: [{ href: "/traitements/orthodontie-enfant", label: "Orthodontie de l’enfant" }],
  },
  {
    key: "adolescents",
    label: "Adolescents",
    age: "De 12 à 17 ans",
    title: "Le bon moment pour aligner",
    text: "Les dents définitives sont en place et la croissance aide encore : c’est souvent la période idéale pour un traitement complet, avec des options discrètes.",
    points: [
      "Bagues céramique ou métal, selon les envies",
      "Aligneurs transparents lorsque le cas s’y prête",
      "Un suivi régulier qui entretient la motivation",
    ],
    photo: stock.teen,
    links: [
      { href: "/traitements/bagues-ceramique-metal", label: "Bagues céramique et métal" },
      { href: "/traitements/aligneurs-invisibles", label: "Aligneurs invisibles" },
    ],
  },
  {
    key: "adultes",
    label: "Adultes",
    age: "À tout âge",
    title: "Il n’est jamais trop tard",
    text: "Corriger un décalage ancien, préparer un implant ou retrouver un sourire qui vous ressemble : des solutions invisibles s’intègrent à votre vie professionnelle.",
    points: [
      "Aligneurs invisibles ou orthodontie linguale",
      "Coordination avec votre dentiste traitant",
      "Contention pour un résultat durable",
    ],
    photo: stock.adult,
    links: [
      { href: "/traitements/orthodontie-adulte", label: "Orthodontie de l’adulte" },
      { href: "/traitements/orthodontie-linguale", label: "Orthodontie linguale" },
    ],
  },
];

/** All panels stay in the HTML (search engines, no-JS); only the active one is shown. */
export function AgeProfiles() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + profiles.length) % profiles.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section aria-labelledby="ages-titre" className="mx-auto max-w-350 px-4 pb-24 md:px-8 md:pb-36">
      <Reveal className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <h2 id="ages-titre" className="font-display max-w-2xl text-4xl leading-[1.08] md:text-6xl">
          Un accompagnement à chaque âge
        </h2>
        <div role="tablist" aria-label="Profils de patients" className="flex gap-1 self-start rounded-full bg-ink/4 p-1 ring-1 ring-line md:self-auto">
          {profiles.map((p, i) => (
            <button
              key={p.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${p.key}`}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-controls={`panel-${p.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative rounded-full px-5 py-2.5 text-[14.5px] transition-colors duration-500 ease-luxe ${
                active === i ? "text-btn-ink" : "text-ink-soft hover:text-ink"
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="age-tab"
                  className="absolute inset-0 rounded-full bg-btn"
                  transition={{ type: "spring", stiffness: 380, damping: 34 }}
                />
              )}
              <span className="relative">{p.label}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-10 md:mt-16 lg:grid-cols-12 lg:gap-16">
        <Reveal blur={false} className="lg:col-span-6">
          <div className="rounded-[2.25rem] bg-ink/3 p-2 ring-1 ring-line">
            <div className="relative aspect-5/4 overflow-hidden rounded-[1.75rem] lg:aspect-square">
              {profiles.map((p, i) => (
                <div
                  key={p.key}
                  aria-hidden={active !== i}
                  className={`absolute inset-0 transition-[opacity,transform] duration-[1.1s] ease-luxe ${
                    active === i ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                  }`}
                >
                  <Picture photo={p.photo} alt={active === i ? p.photo.alt : ""} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-6 lg:self-center">
          {profiles.map((p, i) => (
            <div
              key={p.key}
              id={`panel-${p.key}`}
              role="tabpanel"
              aria-labelledby={`tab-${p.key}`}
              hidden={active !== i}
              className="animate-rise"
            >
              <p className="text-[15px] text-gold-ink">{p.age}</p>
              <h3 className="font-display mt-3 text-4xl leading-[1.08] md:text-5xl">{p.title}</h3>
              <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-ink-soft">{p.text}</p>
              <ul className="mt-8 space-y-4">
                {p.points.map((point) => (
                  <li key={point} className="flex gap-4 leading-relaxed">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                {p.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group inline-flex items-center gap-2 rounded-full px-5 py-3 text-[14.5px] ring-1 ring-line-strong transition-colors duration-500 ease-luxe hover:bg-gold-soft hover:ring-gold"
                  >
                    {l.label}
                    <ArrowUpRightIcon size={14} weight="light" className="transition-transform duration-500 ease-luxe group-hover:-translate-y-px group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
