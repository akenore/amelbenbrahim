import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { photos, type Photo } from "@/lib/images";

function Frame({ photo, aspect, sizes }: { photo: Photo; aspect: string; sizes: string }) {
  return (
    <figure className="rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line">
      <div className={`relative overflow-hidden rounded-[1.625rem] ${aspect}`}>
        <Picture photo={photo} fill sizes={sizes} className="object-cover" />
      </div>
    </figure>
  );
}

/** Three columns drifting at different speeds: depth without moving the layout. */
export function ClinicMosaic() {
  return (
    <section aria-labelledby="cabinet-titre" className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto max-w-350 px-4 md:px-8">
        <Reveal className="max-w-3xl">
          <h2 id="cabinet-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
            Un cabinet pensé pour votre confort
          </h2>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
            Au cœur de Nabeul, un espace lumineux et apaisant, où chaque détail a été choisi pour que vous vous sentiez
            attendu.
          </p>
        </Reveal>

        {/* Desktop: parallax mosaic */}
        <div className="mt-20 hidden grid-cols-12 gap-5 md:grid">
          <Parallax className="col-span-4" distance={40}>
            <Frame photo={photos.reception} aspect="aspect-4/5" sizes="33vw" />
          </Parallax>
          <Parallax className="col-span-5 mt-16 space-y-5" distance={-60}>
            <Frame photo={photos.lounge} aspect="aspect-3/2" sizes="42vw" />
            <Frame photo={photos.desk} aspect="aspect-3/2" sizes="42vw" />
          </Parallax>
          <Parallax className="col-span-3 mt-10" distance={90}>
            <Frame photo={photos.armchairs} aspect="aspect-4/5" sizes="25vw" />
          </Parallax>
        </div>

        {/* Mobile: swipeable row */}
        <ul className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 md:hidden scrollbar-none">
          {[photos.reception, photos.lounge, photos.desk, photos.armchairs].map((p) => (
            <li key={p.alt} className="w-[78vw] shrink-0 snap-start">
              <Frame photo={p} aspect="aspect-4/5" sizes="80vw" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
