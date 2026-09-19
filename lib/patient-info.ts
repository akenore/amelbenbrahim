import { photos, stock, type Photo } from "@/lib/images";

export const firstVisit = {
  intro:
    "La première consultation est un temps d’écoute et d’examen. Nous faisons le point sur vos attentes, examinons les dents, les mâchoires et le sourire, puis vous expliquons clairement les options possibles.",
  bring: [
    "Vos radiographies dentaires récentes, si vous en avez",
    "La liste de vos traitements médicaux en cours",
    "Le carnet de santé, pour un enfant",
    "La présence d’un parent, pour un patient mineur",
    "Vos questions : notez-les pour ne rien oublier",
  ],
  after: [
    { title: "Un diagnostic expliqué", text: "Ce que nous observons, avec des mots simples et des images à l’appui." },
    { title: "Les options possibles", text: "Chaque technique adaptée à votre cas, avec ses avantages et ses contraintes." },
    { title: "Un devis détaillé", text: "Remis après le bilan, sans engagement et sans surprise en cours de route." },
  ],
};

export const dailyLife: { title: string; points: string[]; photo?: Photo; tone: "tint" | "photo" | "plain" | "noir"; span: string }[] = [
  {
    title: "Hygiène",
    tone: "tint",
    span: "lg:col-span-7",
    points: [
      "Brossez-vous les dents après chaque repas, en insistant autour des attaches.",
      "Utilisez des brossettes interdentaires et, si possible, un fil dentaire adapté.",
      "Gardez un petit kit de brossage dans votre sac.",
    ],
  },
  {
    title: "Alimentation",
    tone: "photo",
    span: "lg:col-span-5",
    photo: stock.apple,
    points: [
      "Coupez les fruits et aliments durs en petits morceaux.",
      "Évitez ce qui colle ou croque fort : caramels, chewing-gums, noix entières.",
      "Limitez les boissons sucrées ou acides entre les repas.",
    ],
  },
  {
    title: "Sport et loisirs",
    tone: "plain",
    span: "lg:col-span-5",
    points: [
      "Portez un protège-dents pour les sports de contact.",
      "Pour les instruments à vent, une courte période d’adaptation est normale.",
    ],
  },
  {
    title: "Avec des aligneurs",
    tone: "noir",
    span: "lg:col-span-7",
    points: [
      "Portez les gouttières environ 22 heures par jour.",
      "Retirez-les pour manger ; avec les gouttières en place, ne buvez que de l’eau.",
      "Rangez-les toujours dans leur étui, jamais dans une serviette.",
    ],
  },
];

export const emergencies = [
  {
    q: "Une attache s’est décollée",
    a: "Pas d’urgence absolue : si elle reste sur le fil, laissez-la en place et couvrez-la de cire si elle frotte. Appelez le cabinet pour programmer un rendez-vous de recollage.",
  },
  {
    q: "Un fil pique la joue",
    a: "Posez un peu de cire orthodontique sur l’extrémité du fil. Si la gêne persiste, contactez le cabinet : un rendez-vous court suffit en général à régler le problème.",
  },
  {
    q: "J’ai perdu ou cassé une gouttière",
    a: "Remettez la gouttière précédente (ou la suivante si le changement était proche) et appelez le cabinet pour savoir comment poursuivre.",
  },
  {
    q: "Mon fil de contention s’est décollé",
    a: "Contactez le cabinet rapidement : un fil décollé ne maintient plus les dents, qui peuvent se déplacer en quelques jours.",
  },
  {
    q: "J’ai mal après un réglage",
    a: "Une sensibilité de quelques jours est normale après une pose, une activation ou un changement de gouttière. Privilégiez une alimentation molle. Si la douleur est forte ou dure, appelez-nous.",
  },
  {
    q: "Choc sur les dents",
    a: "En cas de traumatisme dentaire (chute, choc pendant le sport), consultez rapidement un dentiste ou le cabinet, même si l’appareil semble intact.",
  },
];

export const areas = [
  "Nabeul",
  "Hammamet",
  "Dar Chaâbane El Fehri",
  "Béni Khiar",
  "Korba",
  "Grombalia",
  "Menzel Temime",
  "Kélibia",
];

export const visitPhoto: Photo = photos.reception;
