// The "BB" monogram from the logo, traced as two continuous strokes so it can
// be drawn on screen. Geometry verified against public/img/logo.png.
const LEFT = "M462 222 V40 H262 A127.5 127.5 0 0 0 262 295 H462 V602 H178 A133.5 133.5 0 0 1 178 335 H232";
const RIGHT = "M530 222 V40 H730 A127.5 127.5 0 0 1 730 295 H530 V602 H814 A133.5 133.5 0 0 0 814 335 H760";

type MonogramProps = {
  className?: string;
  strokeWidth?: number;
  /** Draw the strokes on mount (CSS only, runs before hydration). */
  animate?: boolean;
  delay?: number;
  title?: string;
};

export function Monogram({ className, strokeWidth = 26, animate = false, delay = 0, title }: MonogramProps) {
  const pathProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
    strokeDasharray: animate ? 1 : undefined,
    className: animate ? "animate-draw" : undefined,
  };
  return (
    <svg
      viewBox="0 0 992 648"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path d={LEFT} {...pathProps} style={animate ? { animationDelay: `${delay}s` } : undefined} />
      <path d={RIGHT} {...pathProps} style={animate ? { animationDelay: `${delay + 0.25}s` } : undefined} />
    </svg>
  );
}
