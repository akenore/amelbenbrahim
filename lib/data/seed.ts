import { stockFiles, type StockFile } from "@/lib/data/stock-files";
import type { Database, MediaImage, Post } from "@/lib/data/types";

// Stored as stable public paths (not build-hashed URLs) so saved posts never break.
const cover = (file: StockFile, alt: string): MediaImage => ({ ...stockFiles[file], alt });

// Starter content so the news section is never empty on a fresh install.
// Everything here can be edited or deleted from the dashboard.

const seedPosts: Post[] = [
  {
    id: "seed-aligneurs",
    slug: "aligneurs-invisibles-sont-ils-faits-pour-vous",
    title: "Aligneurs invisibles : sont-ils faits pour vous ?",
    excerpt:
      "Discrets, amovibles et planifiés numériquement, les aligneurs séduisent de plus en plus. Voici comment savoir s’ils correspondent à votre situation.",
    content: `Les aligneurs transparents ont profondément changé l’orthodontie de l’adulte et de l’adolescent. Mais sont-ils adaptés à tous les cas ? Voici les repères que nous partageons avec nos patients lors de la première consultation.

## Comment fonctionnent les aligneurs ?

Il s’agit d’une série de gouttières fines et transparentes, fabriquées sur mesure. Chacune déplace légèrement les dents selon un plan établi à l’avance grâce à une **planification numérique**.

## Les situations qui s’y prêtent bien

- Les encombrements légers à modérés
- Les espaces entre les dents
- Certaines récidives après un ancien traitement
- De nombreux décalages entre les arcades, selon le bilan

## Ce qui fait la réussite du traitement

Le point clé, c’est le **port régulier** : environ 22 heures par jour. Les gouttières se retirent pour manger et se brosser les dents, puis se remettent aussitôt.

> Le choix de la technique se fait toujours après un bilan complet. L’objectif n’est pas d’imposer un appareil, mais de trouver celui qui vous convient.

Vous vous posez la question pour vous ou votre adolescent ? Prenez rendez-vous pour un bilan au cabinet.`,
    category: "conseils",
    cover: { src: "/img/Dr.Amel-9-1.jpg", alt: "Analyse d’une empreinte numérique à l’écran", width: 2413, height: 1692 },
    status: "published",
    featured: true,
    publishedAt: "2026-09-10T09:00:00.000Z",
    createdAt: "2026-09-10T09:00:00.000Z",
    updatedAt: "2026-09-10T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: "seed-premiere-consultation",
    slug: "premiere-consultation-orthodontie-a-quel-age",
    title: "Première consultation d’orthodontie : à quel âge ?",
    excerpt:
      "Faut-il attendre que toutes les dents définitives soient sorties ? Non : un premier bilan vers 7 ans permet souvent d’agir au bon moment.",
    content: `C’est une question que les parents nous posent souvent. La recommandation est simple : **un premier bilan orthodontique vers l’âge de 7 ans**.

## Pourquoi si tôt ?

À cet âge, les mâchoires sont encore en pleine croissance. Il est possible de repérer :

- un manque de place pour les futures dents définitives ;
- un décalage entre la mâchoire du haut et celle du bas ;
- une habitude qui perturbe la croissance (succion du pouce, respiration par la bouche).

## Consulter tôt ne veut pas dire traiter tôt

Dans la plupart des cas, une simple **surveillance** suffit. Lorsque c’est utile, un traitement court permet d’orienter la croissance et de simplifier, voire d’éviter, un traitement plus lourd à l’adolescence.

## Comment se passe ce premier rendez-vous ?

Un examen tout en douceur, des explications claires pour les parents et, si nécessaire, des examens complémentaires. Aucun traitement n’est engagé sans que vous ayez toutes les informations.`,
    category: "conseils",
    cover: { src: "/img/l_equipe-2-1.jpg", alt: "L’équipe du cabinet réunie autour du Dr. Amel Ben Brahim", width: 2146, height: 1422 },
    status: "published",
    featured: false,
    publishedAt: "2026-08-27T09:00:00.000Z",
    createdAt: "2026-08-27T09:00:00.000Z",
    updatedAt: "2026-08-27T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: "seed-contention",
    slug: "bien-entretenir-sa-contention",
    title: "Bien entretenir sa contention après le traitement",
    excerpt:
      "La contention protège le résultat de votre traitement. Quelques gestes simples suffisent à la garder efficace et propre.",
    content: `La fin du traitement actif n’est pas la fin de l’histoire. Pour que votre sourire reste aligné, la **contention** joue un rôle essentiel.

## Contention fixe

Un fil très fin est collé derrière les dents de devant. Il est invisible et travaille en permanence.

- Brossez soigneusement la zone du fil matin et soir.
- Utilisez les accessoires recommandés au cabinet pour passer entre les dents.
- Si le fil se décolle, contactez-nous rapidement.

## Contention amovible

Une gouttière transparente, portée le plus souvent la nuit.

- Rincez-la et brossez-la délicatement chaque matin.
- Rangez-la toujours dans son étui.
- Évitez l’eau chaude, qui peut la déformer.

## Les visites de contrôle

Les rendez-vous de suivi permettent de vérifier la stabilité du résultat et l’état de votre contention. Ils font partie intégrante du traitement.`,
    category: "conseils",
    cover: { src: "/img/Sale-d_attente-4-1-2048x1789.jpg", alt: "Salle d’attente du cabinet", width: 2048, height: 1789 },
    status: "published",
    featured: false,
    publishedAt: "2026-08-05T09:00:00.000Z",
    createdAt: "2026-08-05T09:00:00.000Z",
    updatedAt: "2026-08-05T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: "seed-aligneurs-ou-bagues",
    slug: "aligneurs-ou-bagues-comment-choisir",
    title: "Aligneurs ou bagues : comment choisir ?",
    excerpt:
      "Gouttières transparentes, attaches céramique, métal ou linguales : chaque technique a ses atouts. Voici les critères qui guident le choix, cas par cas.",
    content: `C’est souvent la première question des patients : « Est-ce que je peux avoir des aligneurs ? » La réponse dépend de votre situation clinique, mais aussi de votre quotidien. Voici les repères que nous utilisons ensemble lors du bilan.

## Ce que le diagnostic décide

Certains déplacements dentaires se réalisent très bien avec des gouttières. D’autres, plus complexes, sont mieux maîtrisés avec un appareil fixe. **Le bilan orthodontique**, avec examen clinique, photographies et radiographies, permet de savoir quelles techniques sont réellement adaptées à votre cas.

## Ce que votre quotidien décide

- **Les aligneurs** sont amovibles et presque invisibles. Ils demandent de la rigueur : environ 22 heures de port par jour.
- **Les attaches céramique** sont discrètes, de la couleur des dents, et travaillent en continu sans effort de votre part.
- **Les attaches métalliques** sont compactes et très robustes, idéales pour les sportifs ou les plus jeunes.
- **L’orthodontie linguale** place l’appareil derrière les dents : totalement invisible de face.

## Une décision prise ensemble

> Il n’existe pas de « meilleure » technique dans l’absolu, seulement la plus juste pour vous.

Lors de la consultation, nous présentons les options possibles pour votre cas, avec leurs avantages, leurs contraintes et un devis détaillé. Vous choisissez en toute connaissance de cause.`,
    category: "conseils",
    cover: cover("braces-models", "Modèles dentaires avec attaches céramique et attaches métalliques"),
    status: "published",
    featured: false,
    publishedAt: "2026-09-16T09:00:00.000Z",
    createdAt: "2026-09-16T09:00:00.000Z",
    updatedAt: "2026-09-16T09:00:00.000Z",
    seoTitle: "Aligneurs ou bagues : comment choisir son appareil ?",
    seoDescription:
      "Aligneurs transparents, bagues céramique, métal ou linguales : les critères pour choisir la technique orthodontique adaptée, expliqués par votre orthodontiste à Nabeul.",
  },
  {
    id: "seed-urgences",
    slug: "urgences-orthodontiques-les-bons-reflexes",
    title: "Urgences orthodontiques : les bons réflexes",
    excerpt:
      "Une attache décollée, un fil qui pique, une gouttière perdue : la plupart des petits incidents se gèrent simplement en attendant le rendez-vous.",
    content: `Un appareil orthodontique est solide, mais de petits incidents peuvent arriver. Rassurez-vous : **la plupart ne sont pas de vraies urgences**. Voici comment réagir.

## Une attache s’est décollée

Si elle reste accrochée au fil, laissez-la en place. Couvrez-la d’un peu de cire orthodontique si elle frotte, puis appelez le cabinet pour programmer un recollage.

## Un fil pique la joue

Posez une petite boule de cire sur l’extrémité du fil. Si la gêne persiste, un rendez-vous court permet en général de régler le problème.

## Une gouttière est perdue ou cassée

Remettez la gouttière précédente, ou la suivante si le changement était proche, et contactez le cabinet pour savoir comment poursuivre.

## Le fil de contention s’est décollé

Appelez rapidement : sans contention, les dents peuvent se déplacer en quelques jours.

## Quand faut-il consulter sans attendre ?

- en cas de douleur forte ou persistante ;
- après un choc sur les dents, même si l’appareil semble intact ;
- si une partie de l’appareil a été avalée ou blesse la bouche.

Gardez toujours un peu de cire orthodontique sur vous : c’est le meilleur allié des premiers jours.`,
    category: "conseils",
    cover: cover("braces-smile", "Sourire avec un appareil orthodontique fixe"),
    status: "published",
    featured: false,
    publishedAt: "2026-07-22T09:00:00.000Z",
    createdAt: "2026-07-22T09:00:00.000Z",
    updatedAt: "2026-07-22T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: "seed-alimentation",
    slug: "que-manger-avec-un-appareil-dentaire",
    title: "Que manger avec un appareil dentaire ?",
    excerpt:
      "Pas besoin de renoncer au plaisir de manger : quelques ajustements suffisent pour protéger votre appareil et vos dents pendant le traitement.",
    content: `Porter un appareil ne signifie pas manger triste. Il s’agit surtout d’adapter **la façon** de manger certains aliments.

## Les aliments à couper

Pommes, carottes crues, pain croustillant : inutile de les supprimer. **Coupez-les en petits morceaux** et mâchez avec les dents du fond plutôt que de croquer avec celles de devant.

## Les aliments à éviter

- les bonbons durs et les caramels ;
- les chewing-gums ;
- les noix, amandes et fruits secs entiers ;
- les os et noyaux à ronger.

Ils peuvent décoller une attache ou déformer un fil.

## Les boissons

Limitez les boissons sucrées ou acides entre les repas : sous un appareil, le sucre s’accumule plus facilement. L’eau reste la meilleure boisson, surtout avec des aligneurs en place.

## Après le repas

Un brossage minutieux, avec une brossette autour des attaches, évite les taches et les caries. Un petit kit de brossage dans le sac facilite les choses au travail ou à l’école.`,
    category: "conseils",
    cover: cover("apple", "Pomme coupée en fines tranches"),
    status: "published",
    featured: false,
    publishedAt: "2026-07-08T09:00:00.000Z",
    createdAt: "2026-07-08T09:00:00.000Z",
    updatedAt: "2026-07-08T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: "seed-adulte",
    slug: "orthodontie-adulte-jamais-trop-tard",
    title: "Orthodontie de l’adulte : il n’est jamais trop tard",
    excerpt:
      "Dents qui se sont déplacées, ancien traitement qui a récidivé, projet d’implant : de plus en plus d’adultes franchissent le pas, souvent avec des solutions invisibles.",
    content: `On associe souvent l’orthodontie à l’adolescence. Pourtant, **les dents peuvent être déplacées à tout âge**, dès lors que les gencives et l’os qui les soutiennent sont en bonne santé.

## Pourquoi consulter à l’âge adulte ?

- des dents qui se sont décalées avec le temps ;
- une récidive après un traitement dans l’enfance ;
- la préparation d’un implant ou d’une prothèse ;
- l’envie, tout simplement, d’un sourire qui vous ressemble.

## Des solutions discrètes

Les **aligneurs transparents** et l’**orthodontie linguale** permettent de traiter sans que cela se voie au quotidien. Les attaches en céramique restent une option discrète et efficace.

## Un traitement coordonné

Chez l’adulte, l’orthodontie s’inscrit souvent dans un projet plus global. Nous travaillons en lien avec votre dentiste pour que chaque étape arrive au bon moment.

## Et après ?

Comme à tout âge, une **contention** permet de conserver le résultat dans la durée. Elle est discrète et fait partie intégrante du traitement.`,
    category: "conseils",
    cover: cover("adult-smile", "Gros plan sur un sourire aligné"),
    status: "published",
    featured: false,
    publishedAt: "2026-06-24T09:00:00.000Z",
    createdAt: "2026-06-24T09:00:00.000Z",
    updatedAt: "2026-06-24T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
  {
    id: "seed-congres-rio",
    slug: "congres-international-orthodontie-rio-2025",
    title: "Retour sur le Congrès international d’orthodontie de Rio",
    excerpt:
      "En octobre 2025, le Dr. Amel Ben Brahim présentait des travaux scientifiques au 10e Congrès international d’orthodontie à Rio de Janeiro.",
    content: `En octobre 2025, le Dr. Amel Ben Brahim faisait partie des orthodontistes tunisiennes qui ont présenté des travaux scientifiques au **10e Congrès international d’orthodontie**, à Rio de Janeiro.

Ce rendez-vous mondial réunit tous les cinq ans les orthodontistes du monde entier autour des dernières avancées de la spécialité.

*Article à compléter par le cabinet avant publication.*`,
    category: "congres",
    cover: { src: "/img/Dr.Amel-2-scaled-1.jpg", alt: "Le Dr. Amel Ben Brahim au cabinet", width: 1707, height: 2560 },
    status: "draft",
    featured: false,
    publishedAt: "2025-10-20T09:00:00.000Z",
    createdAt: "2026-09-18T09:00:00.000Z",
    updatedAt: "2026-09-18T09:00:00.000Z",
    seoTitle: "",
    seoDescription: "",
  },
];

export function seedDatabase(): Database {
  return { version: 1, posts: structuredClone(seedPosts), requests: [], users: [] };
}
