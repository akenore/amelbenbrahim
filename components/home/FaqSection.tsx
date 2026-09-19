import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { FaqList } from "@/components/ui/FaqList";
import { homeFaq } from "@/lib/faq";
import { photos } from "@/lib/images";

export function FaqSection() {
  return (
    <section aria-labelledby="faq-titre" className="mx-auto max-w-350 px-4 py-24 md:px-8 md:py-36">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <h2 id="faq-titre" className="font-display text-4xl leading-[1.08] md:text-6xl">
                Vos questions, nos réponses
              </h2>
              <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-ink-soft">
                Les questions que l’on nous pose le plus souvent avant de commencer un traitement.
              </p>
            </Reveal>
            <Reveal blur={false} className="mt-10 hidden lg:block">
              <div className="rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line">
                <div className="relative aspect-3/2 overflow-hidden rounded-[1.625rem]">
                  <Image src={photos.faq.src} alt={photos.faq.alt} fill placeholder="blur" sizes="40vw" className="object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        <Reveal className="lg:col-span-7" blur={false}>
          <FaqList items={homeFaq} />
        </Reveal>
      </div>
    </section>
  );
}
