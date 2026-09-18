import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import { PageHeader } from "@/components/site/PageHeader";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Mentions légales et confidentialité",
  description: "Mentions légales, protection des données personnelles et informations sur le site du Dr. Amel Ben Brahim.",
  path: "/mentions-legales",
});

export default function LegalPage() {
  return (
    <>
      <PageHeader crumbs={[{ name: "Mentions légales", href: "/mentions-legales" }]} title="Mentions légales" />
      <section className="mx-auto max-w-[1400px] px-4 pb-32 md:px-8">
        <div className="prose-article max-w-[68ch]">
          <h2>Éditeur du site</h2>
          <p>
            {site.name}, spécialiste en orthopédie dento-faciale.
            <br />
            {site.address.building}, {site.address.street}, {site.address.postalCode} {site.address.city},{" "}
            {site.address.country}.
            <br />
            Téléphone : {site.phones.landline.display}. E-mail : <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>

          <h2>Hébergement</h2>
          <p>Les informations relatives à l’hébergeur du site sont disponibles sur simple demande auprès du cabinet.</p>

          <h2>Informations médicales</h2>
          <p>
            Les contenus de ce site sont fournis à titre d’information générale. Ils ne remplacent en aucun cas une
            consultation, un examen clinique ou un avis médical personnalisé.
          </p>

          <h2>Données personnelles</h2>
          <p>
            Les informations transmises via le formulaire de rendez-vous (nom, téléphone, e-mail, message) sont utilisées
            uniquement par le cabinet pour vous recontacter au sujet de votre demande. Elles ne sont ni cédées ni vendues
            à des tiers et sont conservées pendant la durée nécessaire au traitement de la demande.
          </p>
          <p>
            Conformément à la loi organique n° 2004-63 du 27 juillet 2004 portant sur la protection des données à
            caractère personnel, vous disposez d’un droit d’accès, de rectification et d’opposition. Pour l’exercer,
            écrivez à <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>

          <h2>Cookies et stockage local</h2>
          <p>
            Ce site n’utilise aucun cookie publicitaire ni outil de suivi. Seule votre préférence d’affichage (thème clair
            ou sombre) est enregistrée dans votre navigateur. L’espace d’administration du cabinet utilise un cookie de
            session strictement nécessaire.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            Le logo, les photographies et les textes de ce site sont la propriété du cabinet. Toute reproduction sans
            autorisation préalable est interdite.
          </p>
        </div>
      </section>
    </>
  );
}
