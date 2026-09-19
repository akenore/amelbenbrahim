import { CrosshairIcon, CubeIcon, EyeIcon, ScanIcon } from "@phosphor-icons/react/dist/ssr";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { stock } from "@/lib/images";

// VERIFY with the practice: the optical impression claim assumes an intraoral scanner.
const features = [
  { title: "Empreinte optique", text: "Une caméra enregistre vos dents en 3D, le plus souvent sans pâte d’empreinte.", Icon: ScanIcon },
  { title: "Planification 3D", text: "Chaque déplacement est programmé et contrôlé avant le début du traitement.", Icon: CubeIcon },
  { title: "Résultat visualisé", text: "Vous découvrez l’objectif avant de vous engager, notamment pour les aligneurs.", Icon: EyeIcon },
  { title: "Suivi mesuré", text: "Photographies et contrôles réguliers pour vérifier chaque étape.", Icon: CrosshairIcon },
];

/**
 * Split layout: the scanner photo is a portrait, so it gets a portrait frame
 * (a wide panorama cropped away the screen and the patient's face).
 * Mobile order follows the DOM: heading, photo, features.
 */
export function DigitalSection() {
  return (
    <section aria-labelledby="numerique-titre" className="mx-auto max-w-350 px-4 py-16 md:px-8 md:py-24">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-x-16 lg:gap-y-14">
        <Reveal className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-end">
          <h2 id="numerique-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
            L’orthodontie à l’ère <em className="text-gold-ink">numérique</em>
          </h2>
          <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
            Conférencière en technologies numériques appliquées à la dentisterie, le Dr. Ben Brahim intègre les outils
            digitaux à chaque étape : plus de précision pour le plan, plus de clarté pour vous.
          </p>
        </Reveal>

        <Reveal blur={false} className="lg:col-span-5 lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div className="rounded-[2.25rem] bg-ink/3 p-2 ring-1 ring-line">
            <div className="relative aspect-4/5 overflow-hidden rounded-[1.75rem]">
              <Parallax className="absolute inset-0" distance={60} zoom>
                <Picture photo={stock.scanner} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </Parallax>
            </div>
          </div>
        </Reveal>

        <ul className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:self-start">
          {features.map(({ title, text, Icon }, i) => (
            <li key={title} className="border-t border-line-strong pt-7">
              <Reveal delay={i * 0.06} blur={false}>
                <Icon size={30} weight="thin" className="text-gold-ink" aria-hidden />
                <h3 className="font-display mt-6 text-2xl leading-tight">{title}</h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
