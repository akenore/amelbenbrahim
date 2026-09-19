"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

const TEXT =
  "Un sourire aligné ne se résume pas à des dents droites. C’est une fonction retrouvée, une confiance qui s’installe et un visage en harmonie. Chaque plan de traitement est conçu pour vous, puis suivi avec précision jusqu’au dernier rendez-vous.";

const EMPHASIS = new Set(["fonction", "confiance", "harmonie."]);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  const emphasis = EMPHASIS.has(word);
  return (
    <motion.span style={{ opacity }} className={emphasis ? "italic text-gold-ink" : undefined}>
      {word}{" "}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph travels through the viewport. */
export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = TEXT.split(" ");

  return (
    <section aria-label="Notre philosophie" className="mx-auto max-w-350 px-4 pb-16 pt-8 md:px-8 md:pb-24 md:pt-12">
      <p ref={ref} className="font-display max-w-248 text-[2rem] leading-[1.28] md:text-5xl md:leading-[1.22]">
        {reduce
          ? TEXT
          : words.map((word, i) => (
              <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
            ))}
      </p>
      <div className="mt-14 flex items-center gap-6">
        <div aria-hidden className="mask-signature h-14 w-52 bg-gold md:h-16 md:w-64" />
        <p className="text-sm leading-snug text-ink-muted">
          Dr. Amel Ben Brahim
          <br />
          Spécialiste en orthopédie dento-faciale
        </p>
      </div>
    </section>
  );
}
