function initials(name: string) {
  const words = name
    .replace(/^(dr\.?|docteur)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
}

export function Avatar({ name, size = "md", muted = false }: { name: string; size?: "sm" | "md"; muted?: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-full font-display ${
        size === "sm" ? "h-9 w-9 text-[14px]" : "h-12 w-12 text-[18px]"
      } ${muted ? "bg-ink/[0.06] text-ink-muted" : "bg-btn text-btn-ink"}`}
    >
      {initials(name)}
    </span>
  );
}
