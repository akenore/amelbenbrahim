// Client-safe phone helpers (dashboard forms and server code).

/** Digits only with the country code (216 for an 8-digit Tunisian number), or null if invalid. */
export function normalizeWhatsapp(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length === 8) digits = `216${digits}`;
  return /^[1-9]\d{7,14}$/.test(digits) ? digits : null;
}

export function formatWhatsapp(digits: string) {
  const tn = /^216(\d{2})(\d{3})(\d{3})$/.exec(digits);
  return tn ? `+216 ${tn[1]} ${tn[2]} ${tn[3]}` : `+${digits}`;
}
