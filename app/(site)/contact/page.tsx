import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import Image from "next/image";
import { ArrowUpRightIcon, ClockIcon, EnvelopeSimpleIcon, MapPinIcon, PhoneIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { AppointmentForm } from "@/components/contact/AppointmentForm";
import { Reveal } from "@/components/motion/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHeader } from "@/components/site/PageHeader";
import { photos } from "@/lib/images";
import { breadcrumbs } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact et prise de rendez-vous",
  description:
    "Prenez rendez-vous au cabinet d’orthodontie du Dr. Amel Ben Brahim, Immeuble City Center, avenue Habib Bourguiba à Nabeul. Téléphone : 72 224 452.",
  path: "/contact",
});

const channels = [
  { label: "Téléphone du cabinet", value: site.phones.landline.display, href: site.phones.landline.href, Icon: PhoneIcon },
  { label: "Mobile", value: site.phones.mobile.display, href: site.phones.mobile.href, Icon: PhoneIcon },
  { label: "WhatsApp", value: "Écrire au cabinet", href: site.whatsapp, Icon: WhatsappLogoIcon, external: true },
  { label: "E-mail", value: site.email, href: `mailto:${site.email}`, Icon: EnvelopeSimpleIcon },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ name: "Contact", href: "/contact" }]}
        title={
          <>
            Prendre <em className="text-gold-ink">rendez-vous</em>
          </>
        }
        lead="Laissez-nous vos coordonnées : le secrétariat vous rappelle pour fixer votre bilan. Vous pouvez aussi nous joindre directement."
      />

      <section className="mx-auto max-w-350 px-4 pb-24 md:px-8 md:pb-32">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <Reveal blur={false} className="lg:col-span-8">
            <div id="rendez-vous" className="scroll-mt-28 rounded-[2.25rem] bg-ink/3 p-1.5 ring-1 ring-line">
              <div className="rounded-[1.875rem] bg-elevated p-7 md:p-12">
                <h2 className="font-display text-3xl leading-tight md:text-4xl">Demande de rendez-vous</h2>
                <p className="mt-3 text-ink-soft">Tous les champs sont facultatifs, sauf le nom, le téléphone et la personne concernée.</p>
                <div className="mt-10">
                  <AppointmentForm />
                </div>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-5 lg:col-span-4">
            <Reveal blur={false} delay={0.08}>
              <ul className="rounded-[2.25rem] bg-ink/3 p-1.5 ring-1 ring-line">
                <li className="rounded-[1.875rem] bg-noir p-7 text-noir-ink md:p-8">
                  <ul className="divide-y divide-white/10">
                    {channels.map(({ label, value, href, Icon, external }) => (
                      <li key={label}>
                        <a
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="group flex items-center gap-4 py-4 first:pt-0"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/6 text-[#e4c68a] ring-1 ring-white/10">
                            <Icon size={18} weight="light" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[12px] uppercase tracking-[0.18em] text-white/50">{label}</span>
                            <span className="block truncate">{value}</span>
                          </span>
                          <ArrowUpRightIcon size={16} weight="light" className="text-white/40 transition-transform duration-500 ease-luxe group-hover:-translate-y-px group-hover:translate-x-0.5 group-hover:text-[#e4c68a]" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </Reveal>

            <Reveal blur={false} delay={0.14}>
              <div className="rounded-[2.25rem] bg-ink/3 p-1.5 ring-1 ring-line">
                <div className="rounded-[1.875rem] bg-elevated p-7 md:p-8">
                  <div className="flex gap-4">
                    <MapPinIcon size={22} weight="light" className="mt-0.5 shrink-0 text-gold-ink" />
                    <address className="not-italic leading-relaxed">
                      {site.address.building}
                      <br />
                      {site.address.street} ({site.address.landmark})
                      <br />
                      {site.address.postalCode} {site.address.city}, {site.address.country}
                    </address>
                  </div>
                  <div className="mt-5 flex gap-4 text-ink-soft">
                    <ClockIcon size={22} weight="light" className="mt-0.5 shrink-0 text-gold-ink" />
                    <p>{site.hours}</p>
                  </div>
                  <a
                    href={site.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-gold-ink underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
                  >
                    Ouvrir dans Google Maps <ArrowUpRightIcon size={14} weight="light" />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal blur={false} delay={0.2} className="hidden lg:block">
              <div className="rounded-[2.25rem] bg-ink/3 p-1.5 ring-1 ring-line">
                <div className="relative aspect-4/3 overflow-hidden rounded-[1.875rem]">
                  <Image src={photos.reception.src} alt={photos.reception.alt} fill placeholder="blur" sizes="30vw" className="object-cover" />
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal blur={false} className="mt-5">
          <div className="rounded-[2.25rem] bg-ink/3 p-1.5 ring-1 ring-line">
            <div className="relative aspect-4/3 overflow-hidden rounded-[1.875rem] md:aspect-21/8">
              <iframe
                title="Plan d’accès au cabinet du Dr. Amel Ben Brahim à Nabeul"
                src={site.mapsEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[1.05]"
              />
            </div>
          </div>
        </Reveal>
      </section>
      <JsonLd data={breadcrumbs([{ name: "Contact", path: "/contact" }])} />
    </>
  );
}
