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

// Illustrative stock (see note above `stock`). Unsplash photo IDs in comments.
import adultSmileImg from "@/public/img/stock/adult-smile.jpg"; // 1567516364473-233c4b6fcfbe
import adultImg from "@/public/img/stock/adult.jpg"; // 1489278353717-f64c6ee8a4d2
import alignerFitImg from "@/public/img/stock/aligner-fit.jpg"; // 1777793636393-a0fec488f3fb
import appleImg from "@/public/img/stock/apple.jpg"; // 1552255349-450c59a5ec8e
import bracesModelsImg from "@/public/img/stock/braces-models.jpg"; // 1720685193942-5a1c5ac7fd80
import bracesSmileImg from "@/public/img/stock/braces-smile.jpg"; // 1656514894252-fb336a3ad6a6
import childImg from "@/public/img/stock/child.jpg"; // 1593183230686-69876b0cb240
import retainerImg from "@/public/img/stock/retainer.jpg"; // 1695275857301-19e5a9995108
import scan3dImg from "@/public/img/stock/scan-3d.jpg"; // 1600170311833-c2cf5280ce49
import scannerImg from "@/public/img/stock/scanner.jpg"; // 1667133295315-820bb6481730
import teenImg from "@/public/img/stock/teen.jpg"; // 1603472559212-8820d4e0e041

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

// Illustrative photography from Unsplash (Unsplash License), stored locally in
// public/img/stock so it loads from our own origin with blur placeholders.
// These never show the practice or its patients; alt texts stay descriptive.
// Source photo IDs are noted next to each import at the top of this file.
export const stock = {
  alignerFit: { src: alignerFitImg, alt: "Mise en place d’un aligneur transparent sur les dents" },
  retainer: { src: retainerImg, alt: "Gouttière transparente tenue par une main gantée" },
  bracesModels: {
    src: bracesModelsImg,
    alt: "Modèles dentaires avec attaches céramique et attaches métalliques",
    focus: "50% 38%",
  },
  bracesSmile: { src: bracesSmileImg, alt: "Sourire avec un appareil orthodontique fixe" },
  child: { src: childImg, alt: "Enfant qui rit aux éclats", focus: "50% 35%" },
  teen: { src: teenImg, alt: "Adolescente souriante portant des bagues, en noir et blanc" },
  adult: { src: adultImg, alt: "Femme au sourire lumineux", focus: "60% 40%" },
  adultSmile: { src: adultSmileImg, alt: "Gros plan sur un sourire aligné" },
  scanner: { src: scannerImg, alt: "Empreinte optique en cours, modèle 3D des dents à l’écran", focus: "55% 45%" },
  scan3d: { src: scan3dImg, alt: "Analyse d’une radiographie et d’un modèle dentaire 3D sur tablette" },
  apple: { src: appleImg, alt: "Pomme coupée en fines tranches" },
} satisfies Record<string, Photo>;
