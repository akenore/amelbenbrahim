const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Africa/Tunis",
});

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Tunis",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return dateTimeFormatter.format(new Date(iso));
}

export function readingTime(markdown: string) {
  const words = markdown.replace(/[#>*_`[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Tunisia is on UTC+1 all year (no daylight saving time since 2009).
const TUNIS_OFFSET_MS = 60 * 60 * 1000;

/** ISO date -> value for <input type="datetime-local"> in Tunis time. */
export function toTunisInput(iso: string) {
  return new Date(new Date(iso).getTime() + TUNIS_OFFSET_MS).toISOString().slice(0, 16);
}

/** <input type="datetime-local"> value in Tunis time -> ISO date. */
export function fromTunisInput(value: string) {
  const date = new Date(`${value}:00+01:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
