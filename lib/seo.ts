import type { Post } from "@/lib/data/types";
import { photoUrl } from "@/lib/images";
import { credentials, site } from "@/lib/site";
import type { Treatment } from "@/lib/treatments";

export const ids = {
  practice: `${site.url}/#cabinet`,
  doctor: `${site.url}/#docteur`,
  website: `${site.url}/#site`,
};

export const absolute = (path: string) => (path.startsWith("http") ? path : `${site.url}${path}`);

const address = {
  "@type": "PostalAddress",
  streetAddress: `${site.address.building}, ${site.address.street}`,
  addressLocality: site.address.city,
  postalCode: site.address.postalCode,
  addressRegion: "Gouvernorat de Nabeul",
  addressCountry: site.address.countryCode,
};

/** Site-wide graph: the practice (Dentist), the doctor (Person) and the website. */
export function organizationGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Dentist", "MedicalClinic"],
        "@id": ids.practice,
        name: `Cabinet d’orthodontie ${site.name}`,
        description:
          "Cabinet spécialisé en orthodontie et orthopédie dento-faciale à Nabeul : aligneurs invisibles, orthodontie linguale, appareils céramique et métal, traitements pour enfants et adultes.",
        url: site.url,
        logo: absolute("/img/android-chrome-512x512.png"),
        image: [absolute("/img/Reception-scaled-1.jpg"), absolute("/img/l_equipe-2-1.jpg")],
        telephone: "+216 72 224 452",
        email: site.email,
        address,
        areaServed: ["Nabeul", "Hammamet", "Dar Chaâbane El Fehri", "Béni Khiar", "Korba", "Grombalia", "Menzel Temime", "Kélibia"].map((name) => ({
          "@type": "City",
          name,
        })),
        medicalSpecialty: "Dentistry",
        availableService: [
          "Aligneurs invisibles",
          "Orthodontie linguale",
          "Appareil orthodontique céramique et métal",
          "Orthodontie de l’enfant",
          "Orthodontie de l’adulte",
          "Contention orthodontique",
        ].map((name) => ({ "@type": "MedicalProcedure", name })),
        knowsLanguage: ["fr", "ar"],
        sameAs: [site.social.instagram, site.social.facebook],
        founder: { "@id": ids.doctor },
        employee: { "@id": ids.doctor },
      },
      {
        "@type": "Person",
        "@id": ids.doctor,
        name: site.name,
        givenName: "Amel",
        familyName: "Ben Brahim",
        honorificPrefix: "Dr.",
        jobTitle: "Orthodontiste, spécialiste en orthopédie dento-faciale",
        image: absolute("/img/Dr.Amel-2-scaled-1.jpg"),
        url: `${site.url}/docteur`,
        worksFor: { "@id": ids.practice },
        alumniOf: [
          { "@type": "CollegeOrUniversity", name: "Faculté de Médecine Dentaire de Monastir" },
          { "@type": "CollegeOrUniversity", name: "Faculté de Chirurgie Dentaire Paris V René Descartes" },
        ],
        memberOf: {
          "@type": "Organization",
          name: "Association Tunisienne d’Études et de Recherches en Orthodontie (ATREO)",
        },
        knowsAbout: ["Orthodontie", "Aligneurs invisibles", "Orthodontie linguale", "Orthopédie dento-faciale"],
        description: credentials.map((c) => c.title).join(". "),
        sameAs: [site.social.instagram, site.social.facebook],
      },
      {
        "@type": "WebSite",
        "@id": ids.website,
        url: site.url,
        name: site.name,
        inLanguage: "fr-TN",
        publisher: { "@id": ids.practice },
      },
    ],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function faqSchema(faq: readonly { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function treatmentSchema(t: Treatment) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url: absolute(`/traitements/${t.slug}`),
    name: t.seo.title,
    description: t.seo.description,
    inLanguage: "fr-TN",
    lastReviewed: "2026-09-18",
    reviewedBy: { "@id": ids.doctor },
    image: absolute(photoUrl(t.image)),
    about: {
      "@type": "MedicalProcedure",
      name: t.name,
      description: t.short,
      procedureType: "https://schema.org/NoninvasiveProcedure",
    },
    publisher: { "@id": ids.practice },
  };
}

export function articleSchema(post: Post) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.cover ? [absolute(post.cover.src)] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: "fr-TN",
    mainEntityOfPage: absolute(`/actualites/${post.slug}`),
    author: { "@id": ids.doctor, "@type": "Person", name: site.name, url: `${site.url}/docteur` },
    publisher: { "@id": ids.practice },
  };
}
