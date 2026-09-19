import { Crosshair, Cube, Eye, Scan } from "@phosphor-icons/react/dist/ssr";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal } from "@/components/motion/Reveal";
import { Picture } from "@/components/ui/Picture";
import { stock } from "@/lib/images";

// VERIFY with the practice: the optical impression claim assumes an intraoral scanner.
const features = [
  { title: "Empreinte optique", text: "Une caméra enregistre vos dents en 3D, le plus souvent sans pâte d’empreinte.", Icon: Scan },
  { title: "Planification 3D", text: "Chaque déplacement est programmé et contrôlé avant le début du traitement.", Icon: Cube },
  { title: "Résultat visualisé", text: "Vous découvrez l’objectif avant de vous engager, notamment pour les aligneurs.", Icon: Eye },
  { title: "Suivi mesuré", text: "Photographies et contrôles réguliers pour vérifier chaque étape.", Icon: Crosshair },
];

export function DigitalSection() {
  return (
    <section aria-labelledby="numerique-titre" className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-36">
      <Reveal className="max-w-3xl">
        <h2 id="numerique-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
          L’orthodontie à l’ère <em className="text-gold-ink">numérique</em>
        </h2>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-ink-soft">
          Conférencière en technologies numériques appliquées à la dentisterie, le Dr. Ben Brahim intègre les outils
          digitaux à chaque étape : plus de précision pour le plan, plus de clarté pour vous.
        </p>
      </Reveal>

      <Reveal blur={false} className="mt-14 md:mt-20">
        <div className="rounded-[2.5rem] bg-ink/[0.03] p-2 ring-1 ring-line">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(2.5rem-0.5rem)] md:aspect-[21/9]">
            <Parallax className="absolute inset-0" distance={90} zoom>
              <Picture photo={stock.scanner} fill sizes="100vw" className="object-cover" />
            </Parallax>
          </div>
        </div>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
    </section>
  );
}
