"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { CalendarCheckIcon, ChatsCircleIcon, CubeIcon, ShieldCheckIcon, SparkleIcon, type Icon } from "@phosphor-icons/react";

const steps: { title: string; text: string; Icon: Icon }[] = [
  {
    title: "Premier rendez-vous",
    text: "Un temps d’écoute, un examen clinique complet, des photographies et les radiographies nécessaires.",
    Icon: ChatsCircleIcon,
  },
  {
    title: "Plan de traitement",
    text: "Analyse de votre cas, simulation numérique lorsqu’elle s’impose et un devis détaillé, expliqué point par point.",
    Icon: CubeIcon,
  },
  {
    title: "Mise en place",
    text: "Pose de l’appareil ou remise des aligneurs, avec des conseils clairs pour les premiers jours.",
    Icon: SparkleIcon,
  },
  {
    title: "Suivi personnalisé",
    text: "Des rendez-vous réguliers pour ajuster, vérifier et vous accompagner jusqu’au résultat.",
    Icon: CalendarCheckIcon,
  },
  {
    title: "Contention",
    text: "Un résultat stabilisé et des contrôles pour préserver votre sourire dans la durée.",
    Icon: ShieldCheckIcon,
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
    <li className="w-[82vw] shrink-0 snap-start sm:w-105">
      <div className="h-full rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line">
        <div className="relative flex h-full min-h-85 flex-col overflow-hidden rounded-[1.625rem] bg-elevated p-8 md:p-10">
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
    <div className="max-w-md shrink-0 lg:w-95">
      <h2 id="parcours-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
        Votre parcours au cabinet
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        Un déroulé clair, sans surprise, où chaque décision est prise avec vous.
      </p>
    </div>
  );
}

type PinLayout = { distance: number; height: number; top: number; start: number };

/**
 * The pinned block is exactly as tall as its content and stays vertically
 * centred while pinned, so no empty band appears before or after it.
 * Horizontal travel = track overflow; vertical scroll length = the same distance.
 */
function PinnedJourney() {
  const wrapper = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [layout, setLayout] = useState<PinLayout>({ distance: 0, height: 0, top: 96, start: 0 });
  const { scrollY } = useScroll();
  const end = layout.start + Math.max(1, layout.distance);
  const x = useTransform(scrollY, [layout.start, end], [0, -layout.distance], { clamp: true });
  const progress = useTransform(scrollY, [layout.start, end], [0, 1], { clamp: true });

  useEffect(() => {
    const el = track.current;
    const section = wrapper.current;
    if (!el || !section) return;
    const measure = () => {
      const height = el.offsetHeight;
      const distance = Math.max(0, el.scrollWidth - window.innerWidth + 64);
      const top = Math.max(96, Math.round((window.innerHeight - height) / 2)); // clear the floating menu
      const start = Math.round(section.getBoundingClientRect().top + window.scrollY - top);
      setLayout((prev) =>
        prev.distance === distance && prev.height === height && prev.top === top && prev.start === start
          ? prev
          : { distance, height, top, start },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body); // content above can change height (images, fonts)
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section
      ref={wrapper}
      aria-labelledby="parcours-titre"
      className="relative"
      style={{ height: layout.height ? layout.height + layout.distance : undefined }}
    >
      <div className="sticky overflow-hidden" style={{ top: layout.top }}>
        <motion.ul ref={track} style={{ x }} className="flex items-stretch gap-6 pl-8 will-change-transform xl:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]">
          <li className="flex shrink-0 items-center pr-16">
            <Intro />
          </li>
          {steps.map((step, i) => (
            <Card key={step.title} step={step} index={i} progress={progress} />
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

function StackedJourney() {
  return (
    <section aria-labelledby="parcours-titre" className="py-16 md:py-24">
      <div className="mx-auto max-w-350 px-4 md:px-8">
        <Intro />
      </div>
      <ul className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 md:scroll-px-8 md:px-8 scrollbar-none">
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
