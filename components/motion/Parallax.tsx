"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Total travel in px across the element's pass through the viewport. */
  distance?: number;
  /** Slight zoom-out while scrolling, for images inside a clipped frame. */
  zoom?: boolean;
};

/** Transform-only parallax driven by Motion's scroll timeline. */
export function Parallax({ children, className, distance = 80, zoom = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative h-full w-full will-change-transform"
        style={reduce ? undefined : { y, scale: zoom ? scale : 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
