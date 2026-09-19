import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { Cta } from "@/components/ui/Cta";
import { photos } from "@/lib/images";
import { credentials } from "@/lib/site";

export function DoctorFeature() {
  return (
    <section aria-labelledby="docteur-titre" className="bg-sunken">
      <div className="mx-auto grid max-w-350 grid-cols-1 gap-14 px-4 py-24 md:px-8 md:py-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <p className="inline-flex rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gold-ink ring-1 ring-gold/40">
                Votre orthodontiste
              </p>
              <h2 id="docteur-titre" className="font-display mt-7 text-4xl leading-[1.06] md:text-6xl">
                Dr. Amel
                <br />
                Ben Brahim
              </h2>
              <p className="mt-7 max-w-136 text-lg leading-relaxed text-ink-soft">
                Formée à Monastir puis attachée aux Hôpitaux de Paris, elle allie rigueur clinique, outils numériques et
                sens du détail esthétique. Chaque patient est suivi personnellement, du premier bilan à la contention.
              </p>
              <div aria-hidden className="mask-signature mt-8 h-12 w-48 bg-gold" />
              <div className="mt-10">
                <Cta href="/docteur" variant="ghost">
                  Découvrir son parcours
                </Cta>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Reveal blur={false}>
            <div className="rounded-[2.25rem] bg-ink/3 p-2 ring-1 ring-line">
              <div className="relative aspect-3/2 overflow-hidden rounded-[1.75rem]">
                <Parallax className="absolute inset-0" distance={50} zoom>
                  <Image
                    src={photos.team.src}
                    alt={photos.team.alt}
                    fill
                    placeholder="blur"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
            </div>
          </Reveal>

          <ol className="relative mt-16 space-y-12 border-l border-line-strong pl-8 md:ml-4 md:pl-12">
            {credentials.map((c, i) => (
              <li key={c.title} className="relative">
                <Reveal delay={i * 0.05}>
                  <span
                    aria-hidden
                    className="absolute -left-[calc(2rem+4.5px)] top-2.5 h-2 w-2 rotate-45 bg-gold md:-left-[calc(3rem+4.5px)]"
                  />
                  <h3 className="font-display text-2xl leading-tight md:text-[1.9rem]">{c.title}</h3>
                  <p className="mt-2 max-w-[52ch] leading-relaxed text-ink-soft">{c.detail}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
