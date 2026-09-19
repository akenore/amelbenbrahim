import { photos, stock, type Photo } from "@/lib/images";

export type Treatment = {
  slug: string;
  name: string;
  short: string;
  lead: string;
  image: Photo;
  /** A photo of the practice shown next to the daily-life advice. */
  secondary: Photo;
  intro: string[];
  forWhom: string[];
  steps: { title: string; text: string }[];
  benefits: { title: string; text: string }[];
  life: string[];
  faq: { q: string; a: string }[];
  seo: { title: string; description: string };
};

export const treatments: Treatment[] = [
  {
    slug: "aligneurs-invisibles",
    name: "Aligneurs invisibles",
    short: "Des gouttières transparentes sur mesure pour aligner les dents en toute discrétion.",
    lead: "Une série de gouttières transparentes, conçues à partir d’un plan numérique, qui déplacent vos dents étape par étape.",
    image: stock.alignerFit,
    secondary: photos.doctorScreen,
    intro: [
      "Les aligneurs sont des gouttières fines et transparentes, fabriquées sur mesure. Chaque série exerce une pression douce et précise qui guide les dents vers leur position idéale.",
      "Le traitement est préparé en amont grâce à une planification numérique : vous visualisez le déplacement prévu de vos dents avant même de commencer.",
    ],
    forWhom: [
      "Adolescents et adultes souhaitant un traitement discret",
      "Encombrements, espaces et décalages légers à modérés",
      "Récidives après un ancien traitement orthodontique",
      "Patients qui veulent conserver une hygiène facile au quotidien",
    ],
    steps: [
      { title: "Bilan et empreinte", text: "Examen clinique, photographies et radiographies, puis empreinte de vos arcades." },
      { title: "Planification numérique", text: "Le déplacement de chaque dent est programmé et vous est présenté avant validation." },
      { title: "Port des gouttières", text: "Les aligneurs se portent environ 22 heures par jour et se changent selon le rythme prescrit." },
      { title: "Suivi régulier", text: "Des contrôles réguliers au cabinet vérifient que chaque étape se déroule comme prévu." },
    ],
    benefits: [
      { title: "Discrétion", text: "Presque invisibles, ils se font oublier au travail comme en photo." },
      { title: "Amovibles", text: "Vous les retirez pour manger et pour vous brosser les dents." },
      { title: "Prévisibilité", text: "La simulation numérique donne une vision claire du résultat visé." },
    ],
    life: [
      "Portez vos gouttières environ 22 heures par jour, y compris la nuit.",
      "Retirez-les pour manger ; lorsqu’elles sont en place, ne buvez que de l’eau.",
      "Brossez-vous les dents avant de les remettre pour éviter d’enfermer des résidus.",
      "Rangez-les toujours dans leur étui : posée sur une serviette, une gouttière est vite jetée par erreur.",
    ],
    faq: [
      {
        q: "Les aligneurs conviennent-ils à tous les cas ?",
        a: "Ils répondent à un grand nombre de situations, mais certains cas complexes sont mieux traités par un appareil fixe. Le bilan permet de choisir la technique la plus adaptée.",
      },
      {
        q: "Est-ce que je peux manger normalement ?",
        a: "Oui. Les gouttières se retirent pendant les repas, puis se remettent après le brossage des dents.",
      },
    ],
    seo: {
      title: "Aligneurs invisibles à Nabeul",
      description:
        "Traitement par aligneurs transparents sur mesure à Nabeul : planification numérique, suivi personnalisé par le Dr. Amel Ben Brahim, spécialiste en orthodontie.",
    },
  },
  {
    slug: "orthodontie-linguale",
    name: "Orthodontie linguale",
    short: "Un appareil fixe posé à l’intérieur des dents, totalement invisible de face.",
    lead: "Des attaches fixées sur la face interne des dents : l’efficacité d’un appareil fixe, sans rien laisser paraître.",
    image: photos.doctorCare,
    secondary: stock.scan3d,
    intro: [
      "En orthodontie linguale, les attaches et le fil sont collés sur la face interne des dents, côté langue. De l’extérieur, personne ne voit que vous êtes en traitement.",
      "C’est une technique de précision, réalisée sur mesure, qui permet de traiter des cas simples comme des cas plus complexes.",
    ],
    forWhom: [
      "Adultes souhaitant une discrétion absolue",
      "Professions exposées au regard ou à la parole en public",
      "Cas nécessitant la précision d’un appareil fixe",
    ],
    steps: [
      { title: "Bilan complet", text: "Analyse clinique et radiologique pour confirmer l’indication linguale." },
      { title: "Fabrication sur mesure", text: "Les attaches sont conçues pour épouser la face interne de vos dents." },
      { title: "Pose", text: "Collage des attaches au cabinet, avec des conseils pour les premiers jours." },
      { title: "Ajustements", text: "Des rendez-vous réguliers font progresser le traitement en douceur." },
    ],
    benefits: [
      { title: "Invisible", text: "Rien ne se voit de face, même en souriant largement." },
      { title: "Précis", text: "Un contrôle fin du mouvement de chaque dent." },
      { title: "Sans contrainte d’observance", text: "L’appareil est fixe : il travaille en continu." },
    ],
    life: [
      "La langue s’habitue aux attaches en quelques jours ; la parole redevient naturelle rapidement.",
      "Utilisez des brossettes pour nettoyer autour des attaches, matin et soir.",
      "Coupez les aliments durs en petits morceaux plutôt que de croquer dedans.",
    ],
    faq: [
      {
        q: "Est-ce que l’appareil lingual gêne la parole ?",
        a: "Une courte période d’adaptation est habituelle. La langue s’habitue en général en quelques jours à quelques semaines.",
      },
      {
        q: "Le brossage est-il plus compliqué ?",
        a: "Il demande un peu plus de soin. Nous vous montrons les bons gestes et les accessoires adaptés dès la pose.",
      },
    ],
    seo: {
      title: "Orthodontie linguale à Nabeul",
      description:
        "Appareil orthodontique lingual, invisible de face, posé sur mesure à Nabeul par le Dr. Amel Ben Brahim, spécialiste en orthopédie dento-faciale.",
    },
  },
  {
    slug: "bagues-ceramique-metal",
    name: "Bagues céramique et métal",
    short: "L’appareil fixe classique, en métal robuste ou en céramique couleur dent.",
    lead: "La référence de l’orthodontie fixe, disponible en métal pour la robustesse ou en céramique pour la discrétion.",
    image: stock.bracesModels,
    secondary: photos.doctorChair,
    intro: [
      "Les bagues, ou attaches, sont collées sur la face visible des dents et reliées par un fil qui guide leur déplacement. C’est une technique éprouvée, efficace sur tous les types de malpositions.",
      "Les attaches en céramique, de la couleur des dents, offrent une alternative plus discrète aux attaches métalliques.",
    ],
    forWhom: [
      "Enfants, adolescents et adultes",
      "Malpositions simples ou complexes",
      "Patients qui préfèrent un appareil fixe sans gestion au quotidien",
    ],
    steps: [
      { title: "Bilan", text: "Examen, photographies et radiographies pour établir le plan de traitement." },
      { title: "Pose des attaches", text: "Collage des attaches et mise en place du premier fil, en une séance." },
      { title: "Activations", text: "Le fil est ajusté lors de rendez-vous réguliers pour faire progresser les dents." },
      { title: "Dépose et contention", text: "Retrait de l’appareil puis mise en place de la contention." },
    ],
    benefits: [
      { title: "Efficacité", text: "Adapté à la grande majorité des situations cliniques." },
      { title: "Choix esthétique", text: "Céramique couleur dent ou métal, selon vos priorités." },
      { title: "Fiabilité", text: "Une technique maîtrisée depuis des décennies." },
    ],
    life: [
      "Évitez les aliments durs ou collants (caramels, noix entières, chewing-gums).",
      "Brossez soigneusement après chaque repas, avec une brossette entre les attaches.",
      "Appliquez un peu de cire orthodontique si une attache frotte contre la joue.",
      "Portez un protège-dents pour les sports de contact.",
    ],
    faq: [
      {
        q: "Céramique ou métal : que choisir ?",
        a: "Les deux sont efficaces. La céramique est plus discrète, le métal plus compact et très résistant. Nous en discutons ensemble lors du bilan.",
      },
      {
        q: "Les bagues font-elles mal ?",
        a: "Une sensibilité peut apparaître quelques jours après la pose ou une activation. Elle reste passagère et se soulage facilement.",
      },
    ],
    seo: {
      title: "Bagues dentaires céramique et métal à Nabeul",
      description:
        "Appareil orthodontique fixe en céramique ou en métal pour enfants, adolescents et adultes à Nabeul. Cabinet du Dr. Amel Ben Brahim.",
    },
  },
  {
    slug: "orthodontie-enfant",
    name: "Orthodontie de l’enfant",
    short: "Accompagner la croissance pour corriger tôt et simplifier la suite.",
    lead: "Chez l’enfant, l’orthodontie accompagne la croissance des mâchoires pour corriger tôt ce qui serait plus complexe plus tard.",
    image: stock.child,
    secondary: photos.team,
    intro: [
      "Une première consultation est recommandée vers l’âge de 7 ans. À cet âge, il est possible de repérer un décalage des mâchoires, un manque de place ou une habitude qui perturbe la croissance.",
      "Lorsqu’il est utile, un traitement précoce oriente la croissance et prépare l’arrivée des dents définitives. Parfois, une simple surveillance suffit : nous vous le disons en toute transparence.",
    ],
    forWhom: [
      "Enfants à partir de 6 ou 7 ans",
      "Mâchoire trop étroite ou décalée",
      "Succion du pouce, respiration buccale, déglutition atypique",
      "Dents qui manquent de place pour sortir",
    ],
    steps: [
      { title: "Première consultation", text: "Un examen tout en douceur pour évaluer la croissance et la position des dents." },
      { title: "Surveillance ou traitement", text: "Nous proposons un suivi simple ou un traitement interceptif selon les besoins." },
      { title: "Appareillage adapté", text: "Appareil amovible ou fixe, choisi pour être bien toléré par l’enfant." },
      { title: "Suivi de croissance", text: "Des contrôles réguliers jusqu’à la mise en place des dents définitives." },
    ],
    benefits: [
      { title: "Agir au bon moment", text: "Profiter de la croissance pour obtenir des corrections plus simples." },
      { title: "Traitements plus courts", text: "Une intervention précoce peut alléger le traitement à l’adolescence." },
      { title: "Un climat rassurant", text: "Une équipe habituée à accompagner les plus jeunes." },
    ],
    life: [
      "Encouragez le port de l’appareil exactement comme il a été prescrit.",
      "Accompagnez le brossage du soir tant que l’enfant n’est pas autonome.",
      "Signalez-nous toute gêne ou tout appareil abîmé sans attendre le prochain contrôle.",
    ],
    faq: [
      {
        q: "Pourquoi consulter si jeune ?",
        a: "Certains problèmes de croissance se corrigent plus facilement tant que les os sont en développement. Consulter tôt ne veut pas dire traiter tôt : souvent, une surveillance suffit.",
      },
      {
        q: "Mon enfant devra-t-il porter un appareil longtemps ?",
        a: "Cela dépend de chaque situation. La durée estimée vous est expliquée lors du bilan, avant toute décision.",
      },
    ],
    seo: {
      title: "Orthodontiste pour enfant à Nabeul",
      description:
        "Consultation orthodontique dès 7 ans et traitements interceptifs à Nabeul. Le Dr. Amel Ben Brahim accompagne la croissance de votre enfant.",
    },
  },
  {
    slug: "orthodontie-adulte",
    name: "Orthodontie de l’adulte",
    short: "Il n’y a pas d’âge pour un sourire aligné, avec des solutions discrètes.",
    lead: "Il n’est jamais trop tard pour aligner ses dents. Les techniques discrètes rendent le traitement compatible avec votre vie professionnelle.",
    image: stock.adult,
    secondary: photos.doctorSmile,
    intro: [
      "De plus en plus d’adultes choisissent de corriger leur sourire. Au-delà de l’esthétique, des dents bien alignées facilitent le brossage, protègent les gencives et améliorent la mastication.",
      "Chez l’adulte, le traitement est souvent coordonné avec votre dentiste, par exemple avant la pose d’un implant ou d’une prothèse.",
    ],
    forWhom: [
      "Adultes de tout âge avec des gencives en bonne santé",
      "Dents qui se sont déplacées avec le temps",
      "Préparation à des soins prothétiques ou implantaires",
      "Patients à la recherche d’une solution invisible",
    ],
    steps: [
      { title: "Bilan global", text: "Examen des dents, des gencives et de l’articulation, avec vos attentes au centre." },
      { title: "Choix de la technique", text: "Aligneurs, lingual ou céramique, selon votre cas et votre quotidien." },
      { title: "Traitement", text: "Un suivi rigoureux, coordonné si besoin avec votre dentiste." },
      { title: "Stabilisation", text: "Une contention adaptée pour préserver durablement le résultat." },
    ],
    benefits: [
      { title: "Discrétion", text: "Des options invisibles pour traiter sans vous exposer." },
      { title: "Santé bucco-dentaire", text: "Des dents alignées se nettoient mieux et s’usent moins." },
      { title: "Confiance", text: "Un sourire que l’on a envie de montrer." },
    ],
    life: [
      "Choisissez avec nous la technique la plus compatible avec votre vie professionnelle.",
      "Renforcez l’hygiène : des gencives saines sont la condition d’un traitement réussi.",
      "Poursuivez vos contrôles habituels chez votre dentiste pendant le traitement.",
    ],
    faq: [
      {
        q: "Suis-je trop âgé pour un traitement orthodontique ?",
        a: "Non. Tant que les dents et les gencives sont en bonne santé, un traitement est possible à tout âge.",
      },
      {
        q: "Le traitement est-il visible au travail ?",
        a: "Avec les aligneurs ou l’orthodontie linguale, le traitement passe inaperçu dans la grande majorité des situations.",
      },
    ],
    seo: {
      title: "Orthodontie adulte à Nabeul",
      description:
        "Traitement orthodontique discret pour adultes à Nabeul : aligneurs invisibles, lingual ou céramique. Cabinet du Dr. Amel Ben Brahim.",
    },
  },
  {
    slug: "contention",
    name: "Contention",
    short: "Stabiliser le résultat pour que votre sourire reste aligné dans le temps.",
    lead: "La dernière étape, et l’une des plus importantes : maintenir les dents dans leur nouvelle position.",
    image: stock.retainer,
    secondary: photos.armchairs,
    intro: [
      "Après un traitement, les dents ont naturellement tendance à revenir vers leur position d’origine. La contention les maintient le temps que les tissus se stabilisent.",
      "Elle peut être fixe, avec un fil très fin collé derrière les dents, ou amovible, sous forme de gouttière portée principalement la nuit.",
    ],
    forWhom: [
      "Tous les patients en fin de traitement orthodontique",
      "Patients ayant constaté une récidive après un ancien traitement",
    ],
    steps: [
      { title: "Mise en place", text: "Pose du fil de contention ou remise de la gouttière le jour de la dépose." },
      { title: "Conseils de port", text: "Un protocole clair pour savoir quand et comment porter votre contention." },
      { title: "Contrôles", text: "Des visites de suivi pour vérifier la stabilité et l’état de la contention." },
    ],
    benefits: [
      { title: "Résultat durable", text: "La meilleure garantie de garder un sourire aligné." },
      { title: "Discrète", text: "Invisible de face, qu’elle soit fixe ou amovible." },
      { title: "Suivi inclus", text: "Nous restons à vos côtés après la fin du traitement actif." },
    ],
    life: [
      "Respectez le protocole de port : souvent chaque nuit pour une contention amovible.",
      "Nettoyez votre gouttière chaque matin et rangez-la dans son étui.",
      "Si un fil de contention se décolle, appelez le cabinet rapidement.",
    ],
    faq: [
      {
        q: "Combien de temps faut-il porter la contention ?",
        a: "La contention se porte sur le long terme. Le protocole précis dépend de votre traitement et vous est expliqué en fin de traitement.",
      },
      {
        q: "Que faire si mon fil de contention se décolle ?",
        a: "Contactez le cabinet rapidement pour un rendez-vous : un fil décollé ne maintient plus correctement les dents.",
      },
    ],
    seo: {
      title: "Contention orthodontique à Nabeul",
      description:
        "Contention fixe ou amovible après traitement orthodontique à Nabeul. Suivi et stabilisation du résultat par le Dr. Amel Ben Brahim.",
    },
  },
];

export function getTreatment(slug: string) {
  return treatments.find((t) => t.slug === slug);
}
