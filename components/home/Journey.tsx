"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CalendarCheck, ChatsCircle, Cube, ShieldCheck, Sparkle, type Icon } from "@phosphor-icons/react";

const steps: { title: string; text: string; Icon: Icon }[] = [
  {
    title: "Premier rendez-vous",
    text: "Un temps d’écoute, un examen clinique complet, des photographies et les radiographies nécessaires.",
    Icon: ChatsCircle,
  },
  {
    title: "Plan de traitement",
    text: "Analyse de votre cas, simulation numérique lorsqu’elle s’impose et un devis détaillé, expliqué point par point.",
    Icon: Cube,
  },
  {
    title: "Mise en place",
    text: "Pose de l’appareil ou remise des aligneurs, avec des conseils clairs pour les premiers jours.",
    Icon: Sparkle,
  },
  {
    title: "Suivi personnalisé",
    text: "Des rendez-vous réguliers pour ajuster, vérifier et vous accompagner jusqu’au résultat.",
    Icon: CalendarCheck,
  },
  {
    title: "Contention",
    text: "Un résultat stabilisé et des contrôles pour préserver votre sourire dans la durée.",
    Icon: ShieldCheck,
  },
];

function useDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

function Card({ step, index, progress }: { step: (typeof steps)[number]; index: number; progress?: MotionValue<number> }) {
  const start = index / steps.length;
  const idle = useMotionValue(0);
  const fill = useTransform(progress ?? idle, [start, start + 1 / steps.length], [0, 1]);
  const { Icon } = step;
  return (
    <li className="w-[82vw] shrink-0 snap-start sm:w-[420px]">
      <div className="h-full rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
        <div className="relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-[calc(2rem-0.375rem)] bg-elevated p-8 md:p-10">
          <span className="absolute inset-x-0 top-0 h-px bg-line" />
          {progress && (
            <motion.span style={{ scaleX: fill }} className="absolute inset-x-0 top-0 h-px origin-left bg-gold" />
          )}
          <Icon size={40} weight="thin" className="text-gold-ink" aria-hidden />
          <h3 className="font-display mt-auto pt-16 text-3xl leading-tight">{step.title}</h3>
          <p className="mt-4 leading-relaxed text-ink-soft">{step.text}</p>
        </div>
      </div>
    </li>
  );
}

function Intro() {
  return (
    <div className="max-w-md shrink-0 lg:w-[380px]">
      <h2 id="parcours-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
        Votre parcours au cabinet
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        Un déroulé clair, sans surprise, où chaque décision est prise avec vous.
      </p>
    </div>
  );
}

function PinnedJourney() {
  const wrapper = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrapper, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 64));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section ref={wrapper} aria-labelledby="parcours-titre" className="relative" style={{ height: `calc(100dvh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
        <motion.ul ref={track} style={{ x }} className="flex items-stretch gap-6 pl-8 will-change-transform xl:pl-[max(2rem,calc((100vw_-_1400px)/2_+_2rem))]">
          <li className="flex shrink-0 items-center pr-16">
            <Intro />
          </li>
          {steps.map((step, i) => (
            <Card key={step.title} step={step} index={i} progress={scrollYProgress} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function StackedJourney() {
  return (
    <section aria-labelledby="parcours-titre" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <Intro />
      </div>
      <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 md:scroll-px-8 md:px-8 [scrollbar-width:none]">
        {steps.map((step, i) => (
          <Card key={step.title} step={step} index={i} />
        ))}
      </ul>
    </section>
  );
}

/** Desktop: vertical scroll pans the steps horizontally. Mobile: swipeable row. */
export function Journey() {
  const desktop = useDesktop();
  const reduce = useReducedMotion();
  return desktop && !reduce ? <PinnedJourney /> : <StackedJourney />;
}
