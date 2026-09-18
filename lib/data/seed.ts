import type { Database, Post } from "@/lib/data/types";

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
  return { version: 1, posts: structuredClone(seedPosts), requests: [] };
}
