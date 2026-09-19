import type { StaticImageData } from "next/image";

// Static imports give next/image intrinsic sizes and blur placeholders.
import doctorSmile from "@/public/img/Dr.Amel-2-scaled-1.jpg";
import doctorCare from "@/public/img/Dr.Amel-4-scaled-1.jpg";
import doctorChair from "@/public/img/Dr.Amel-5-scaled-1.jpg";
import doctorScreen from "@/public/img/Dr.Amel-9-1.jpg";
import faq from "@/public/img/FAQs-1.png";
import reception from "@/public/img/Reception-scaled-1.jpg";
import lounge from "@/public/img/Sale-d_attente-2-scaled-1.jpg";
import desk from "@/public/img/Sale-d_attente-3-scaled-1.jpg";
import armchairs from "@/public/img/Sale-d_attente-4-1-2048x1789.jpg";
import team from "@/public/img/l_equipe-2-1.jpg";

export const photos = {
  doctorSmile: {
    src: doctorSmile,
    alt: "Le Dr. Amel Ben Brahim souriante, présentant un aligneur à une patiente",
  },
  doctorCare: {
    src: doctorCare,
    alt: "Le Dr. Amel Ben Brahim et son assistante pendant un soin orthodontique",
  },
  doctorChair: {
    src: doctorChair,
    alt: "Contrôle orthodontique au fauteuil avec l’assistante du cabinet",
  },
  doctorScreen: {
    src: doctorScreen,
    alt: "Le Dr. Amel Ben Brahim analysant une empreinte numérique à l’écran",
  },
  faq: { src: faq, alt: "Modèle de dent à côté d’un point d’interrogation" },
  reception: {
    src: reception,
    alt: "L’accueil du cabinet en marbre blanc et ses deux assistantes",
  },
  lounge: {
    src: lounge,
    alt: "Salle d’attente lumineuse avec vue sur Nabeul",
  },
  desk: { src: desk, alt: "Comptoir d’accueil en marbre et lumière indirecte" },
  armchairs: {
    src: armchairs,
    alt: "Fauteuils de la salle d’attente et composition d’orchidées",
  },
  team: {
    src: team,
    alt: "Le Dr. Amel Ben Brahim entourée de son équipe au cabinet",
  },
} as const;

/** `focus` is a CSS object-position used when the photo is cropped. */
export type Photo = { src: StaticImageData | string; alt: string; focus?: string };

/** Absolute URL of a photo (Open Graph, sitemap, JSON-LD). */
export function photoUrl(photo: Photo) {
  return typeof photo.src === "string" ? photo.src : photo.src.src;
}

// Illustrative photography from Unsplash (free Unsplash license). These never
// show the practice or its patients; alt texts stay descriptive, not claims.
const unsplash = (id: string, alt: string, focus?: string): Photo => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`,
  alt,
  focus,
});

export const stock = {
  alignerFit: unsplash("1777793636393-a0fec488f3fb", "Mise en place d’un aligneur transparent sur les dents"),
  retainer: unsplash("1695275857301-19e5a9995108", "Gouttière transparente tenue par une main gantée"),
  bracesModels: unsplash("1720685193942-5a1c5ac7fd80", "Modèles dentaires avec attaches céramique et attaches métalliques", "50% 38%"),
  bracesSmile: unsplash("1656514894252-fb336a3ad6a6", "Sourire avec un appareil orthodontique fixe"),
  child: unsplash("1593183230686-69876b0cb240", "Enfant qui rit aux éclats", "50% 35%"),
  teen: unsplash("1603472559212-8820d4e0e041", "Adolescente souriante portant des bagues, en noir et blanc"),
  adult: unsplash("1489278353717-f64c6ee8a4d2", "Femme au sourire lumineux", "60% 40%"),
  adultSmile: unsplash("1567516364473-233c4b6fcfbe", "Gros plan sur un sourire aligné"),
  scanner: unsplash("1667133295315-820bb6481730", "Empreinte optique en cours, modèle 3D des dents à l’écran", "50% 40%"),
  scan3d: unsplash("1600170311833-c2cf5280ce49", "Analyse d’une radiographie et d’un modèle dentaire 3D sur tablette"),
  apple: unsplash("1552255349-450c59a5ec8e", "Pomme coupée en fines tranches"),
  childMouth: unsplash("1674649205910-ce785b24c134", "Enfant qui porte la main à sa bouche"),
} satisfies Record<string, Photo>;
