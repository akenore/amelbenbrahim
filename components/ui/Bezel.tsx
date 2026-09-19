/** Double-bezel frame: an outer tray with a hairline and an inner core with concentric radius. */
export function Bezel({
  children,
  className = "",
  innerClassName = "",
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div className={`rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line ${className}`}>
      <div
        className={`relative h-full overflow-hidden rounded-[1.625rem] shadow-[inset_0_1px_1px_rgb(255_255_255/0.12)] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
