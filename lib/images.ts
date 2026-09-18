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

export type Photo = (typeof photos)[keyof typeof photos];
