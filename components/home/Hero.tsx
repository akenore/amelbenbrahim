import Image from "next/image";
import { Monogram } from "@/components/brand/Monogram";
import { Parallax } from "@/components/motion/Parallax";
import { Cta } from "@/components/ui/Cta";
import { photos } from "@/lib/images";

// Entry animations are pure CSS so they start at first paint, before hydration.
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Monogram
        animate
        strokeWidth={5}
        className="pointer-events-none absolute left-[-12%] top-[18%] -z-10 hidden w-[62%] text-gold opacity-15 lg:block"
      />

      <div className="mx-auto grid min-h-dvh max-w-350 grid-cols-1 items-center gap-12 px-4 pb-16 pt-28 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-12">
        <div className="lg:col-span-7 lg:pr-8">
          <h1>
            <span
              className="animate-rise inline-flex items-center rounded-full px-3.5 py-1.5 font-sans text-[11px] font-normal uppercase tracking-[0.22em] text-gold-ink ring-1 ring-gold/40"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="hidden sm:inline">Dr. Amel Ben Brahim ·&nbsp;</span>Orthodontiste à Nabeul
            </span>
            <span
              className="font-display animate-rise mt-7 block text-[3.1rem] leading-[1.04] sm:text-6xl md:text-7xl xl:text-[5.6rem]"
              style={{ animationDelay: "0.2s" }}
            >
              L’art d’aligner
              <br />
              votre <em className="pr-2 text-gold-ink">sourire.</em>
            </span>
          </h1>
          <p
            className="animate-rise mt-7 max-w-136 text-lg leading-relaxed text-ink-soft md:text-xl"
            style={{ animationDelay: "0.35s" }}
          >
            Aligneurs invisibles, orthodontie linguale et suivi sur mesure pour enfants et adultes, au cœur de Nabeul.
          </p>
          <div className="animate-rise mt-10 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.5s" }}>
            <Cta href="/contact#rendez-vous">Prendre rendez-vous</Cta>
            <Cta href="/traitements" variant="ghost">
              Nos traitements
            </Cta>
          </div>
        </div>

        <div className="animate-fade relative lg:col-span-5" style={{ animationDelay: "0.3s" }}>
          <div className="rounded-[2.5rem] bg-ink/3 p-2 ring-1 ring-line">
            <div className="relative aspect-4/5 overflow-hidden rounded-4xl lg:aspect-auto lg:h-[min(76dvh,720px)]">
              <Parallax className="absolute inset-0" distance={60} zoom>
                <Image
                  src={photos.doctorSmile.src}
                  alt={photos.doctorSmile.alt}
                  fill
                  preload
                  placeholder="blur"
                  quality={80}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-[50%_20%]"
                />
              </Parallax>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
