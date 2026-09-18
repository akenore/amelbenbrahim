"use client";

import { motion, useReducedMotion } from "motion/react";

const LEFT = "M462 222 V40 H262 A127.5 127.5 0 0 0 262 295 H462 V602 H178 A133.5 133.5 0 0 1 178 335 H232";
const RIGHT = "M530 222 V40 H730 A127.5 127.5 0 0 1 730 295 H530 V602 H814 A133.5 133.5 0 0 0 814 335 H760";

/** Monogram that traces itself when scrolled into view. */
export function MonogramDraw({ className, strokeWidth = 8 }: { className?: string; strokeWidth?: number }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 992 648" className={className} aria-hidden>
      {[LEFT, RIGHT].map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 2.4, delay: i * 0.3, ease: [0.65, 0, 0.35, 1] }}
        />
      ))}
    </svg>
  );
}
