"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

type ParallaxProps = {
  children: React.ReactNode;
  className?: string;
  /** Total travel in px across the element's pass through the viewport. */
  distance?: number;
  /**
   * Image mode: the child is a photo inside a clipped frame. The moving layer is
   * oversized by the travel distance (plus a slight zoom-out), so its edges never
   * enter the frame, whatever the scroll position.
   */
  zoom?: boolean;
};

/** Transform-only parallax driven by Motion's scroll timeline. */
export function Parallax({ children, className, distance = 80, zoom = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance / 2, -distance / 2]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  const overscan = Math.abs(distance) / 2;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className={zoom ? "absolute inset-x-0 will-change-transform" : "relative h-full w-full will-change-transform"}
        style={{
          ...(zoom ? { top: -overscan, bottom: -overscan } : null),
          ...(reduce ? null : { y, scale: zoom ? scale : 1 }),
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
