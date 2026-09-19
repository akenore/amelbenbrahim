import type { Metadata } from "next";
import { Monogram } from "@/components/brand/Monogram";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Cta } from "@/components/ui/Cta";

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } };

// Root boundary: handles unknown URLs and notFound() calls from every page.
export default function NotFound() {
  return (
    <>
      <Header />
      <main id="contenu">
        <section className="relative isolate mx-auto flex min-h-dvh max-w-350 flex-col justify-center overflow-hidden px-4 py-32 md:px-8">
          <Monogram
            animate
            strokeWidth={5}
            className="absolute right-[-10%] top-1/2 -z-10 w-[70%] -translate-y-1/2 text-gold opacity-30"
          />
          <p className="text-xs uppercase tracking-[0.22em] text-gold-ink">Erreur 404</p>
          <h1 className="font-display mt-6 max-w-3xl text-5xl leading-[1.05] md:text-7xl">
            Cette page n’est pas <em className="text-gold-ink">alignée.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Le lien que vous avez suivi n’existe plus ou a été déplacé.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Cta href="/">Retour à l’accueil</Cta>
            <Cta href="/traitements" variant="ghost">
              Nos traitements
            </Cta>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
