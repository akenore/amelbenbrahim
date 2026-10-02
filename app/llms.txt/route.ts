import { homeFaq } from "@/lib/faq";
import { getPublishedPosts } from "@/lib/posts";
import { absolute } from "@/lib/seo";
import { credentials, noIndex, site } from "@/lib/site";
import { treatments } from "@/lib/treatments";

/**
 * llms.txt: a short, factual map of the site for AI assistants (ChatGPT, Perplexity,
 * Claude, AI Overviews), so they describe the practice from the real pages instead of
 * guessing. Built from the same data as the site, articles included.
 * Standard: https://llmstxt.org
 */
export const dynamic = "force-dynamic";

const line = (title: string, path: string, description: string) => `- [${title}](${absolute(path)}): ${description}`;

export async function GET() {
  // A demo or staging copy has nothing to tell search engines or AI assistants.
  if (noIndex()) return new Response("Not found", { status: 404 });

  const posts = (await getPublishedPosts().catch(() => [])).slice(0, 6);
  const { landline, mobile } = site.phones;

  const content = `# ${site.name} — Orthodontiste à ${site.address.city}

> Cabinet d’orthodontie et d’orthopédie dento-faciale du ${site.name}, à ${site.address.city} (${site.address.country}) : aligneurs invisibles, orthodontie linguale, bagues céramique et métal, enfants, adolescents et adultes.

## Pages principales

${line("Accueil", "/", "Présentation du cabinet, des traitements proposés et du parcours de soin, de la première consultation à la contention.")}
${line("Le docteur", "/docteur", `Parcours du ${site.name} : diplômes, spécialisation en orthopédie dento-faciale, enseignement et congrès.`)}
${line("Traitements", "/traitements", "Les six traitements proposés au cabinet, avec leurs indications et leur déroulé.")}
${line("Infos patients", "/infos-patients", "Déroulé d’un traitement, conseils d’hygiène, alimentation, urgences orthodontiques et questions fréquentes.")}
${line("Actualités", "/actualites", "Articles du cabinet : conseils d’orthodontie, vie du cabinet, congrès et formation.")}
${line("Contact et rendez-vous", "/contact", `Adresse à ${site.address.city}, téléphone, plan d’accès et formulaire de demande de rendez-vous.`)}

## Traitements

${treatments.map((t) => line(t.name, `/traitements/${t.slug}`, t.short)).join("\n")}

${
  posts.length
    ? `## Actualités récentes

${posts.map((p) => line(p.title, `/actualites/${p.slug}`, p.excerpt)).join("\n")}

`
    : ""
}## Questions fréquentes des patients

${homeFaq.map((item) => `- ${item.q} → ${item.a}`).join("\n")}

## Informations clés

- Praticienne : ${site.name}, ${site.title.toLowerCase()} (orthopédie dento-faciale)
- Formation : ${credentials.map((c) => c.title).join(" ; ")}
- Adresse : ${site.address.building}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}, ${site.address.country}
- Téléphone : +216 ${landline.display} (cabinet) et +216 ${mobile.display}
- Rendez-vous : ${site.hours.toLowerCase()}
- Patients : enfants, adolescents et adultes
- Zone desservie : ${site.address.city} et le Cap Bon (Hammamet, Dar Chaâbane, Béni Khiar, Korba, Grombalia, Menzel Temime, Kélibia)
- Langue du site : français

## Contact

- Site : ${site.url}
- E-mail : ${site.email}
- Téléphone : +216 ${landline.display}
- WhatsApp : ${site.whatsapp}
- Instagram : ${site.social.instagram}
- Facebook : ${site.social.facebook}
- Plan d’accès : ${site.mapsUrl}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
