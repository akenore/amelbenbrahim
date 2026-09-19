// Practice facts shown across the site and in structured data.
// Sources: amelbenbrahim.com, directory listings (allo-docteur, lerdvmedical, med.tn)
// and the doctor's Instagram bio. Items marked VERIFY need the doctor's confirmation.

/**
 * SITE_NOINDEX=true keeps a demo or staging copy (e.g. demo.amelbenbrahim.com) out of search
 * engines. Read on the server at runtime, so it can be set without rebuilding.
 */
export const noIndex = () => process.env.SITE_NOINDEX === "true";

export const site = {
  name: "Dr. Amel Ben Brahim",
  shortName: "Dr. Ben Brahim",
  title: "Spécialiste en orthodontie",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amelbenbrahim.com").replace(/\/$/, ""),
  email: "contact@amelbenbrahim.com",
  phones: {
    landline: { display: "72 224 452", href: "tel:+21672224452" },
    mobile: { display: "97 891 853", href: "tel:+21697891853" },
  },
  // VERIFY: assumes the mobile line is reachable on WhatsApp.
  whatsapp: "https://wa.me/21697891853",
  address: {
    // VERIFY: listings mention both the 4th and the 6th floor.
    building: "Immeuble City Center",
    street: "39 Avenue Habib Bourguiba",
    landmark: "à côté de la Jarre",
    postalCode: "8000",
    city: "Nabeul",
    country: "Tunisie",
    countryCode: "TN",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Dr+Amel+Ben+Brahim+orthodontiste+City+Center+Nabeul",
  mapsEmbed:
    "https://www.google.com/maps?q=Immeuble+City+Center,+Avenue+Habib+Bourguiba,+8000+Nabeul,+Tunisie&output=embed",
  hours: "Consultations sur rendez-vous",
  social: {
    instagram: "https://www.instagram.com/dramelbenbrahim/",
    facebook: "https://www.facebook.com/amel.benbrahim2/",
  },
} as const;

export const nav = [
  { href: "/docteur", label: "Le docteur" },
  { href: "/traitements", label: "Traitements" },
  { href: "/infos-patients", label: "Infos patients" },
  { href: "/actualites", label: "Actualités" },
  { href: "/contact", label: "Contact" },
] as const;

export const credentials = [
  {
    title: "Faculté de médecine dentaire de Monastir",
    detail: "Diplômée en médecine dentaire, spécialiste en orthopédie dento-faciale.",
  },
  {
    title: "Hôpitaux de Paris et Faculté René Descartes",
    detail: "Ancienne attachée des Hôpitaux de Paris et de la Faculté de chirurgie dentaire de Montrouge (Paris V).",
  },
  {
    title: "Présidente de l’ATREO",
    detail: "Association Tunisienne d’Études et de Recherches en Orthodontie, affiliée à la Fédération mondiale d’orthodontie.",
  },
  {
    title: "Conférencière officielle DTMD",
    detail: "Digital Technology in Medicine and Dentistry : enseignement des flux numériques en orthodontie.",
  },
  {
    title: "Congrès internationaux",
    detail: "Intervenante au Congrès francophone d’orthodontie (Monastir, 2024) et au Congrès international d’orthodontie (Rio de Janeiro, 2025).",
  },
] as const;
