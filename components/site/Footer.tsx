import Link from "next/link";
import { FacebookLogoIcon, InstagramLogoIcon, WhatsappLogoIcon } from "@phosphor-icons/react/dist/ssr";
import { Monogram } from "@/components/brand/Monogram";
import { treatments } from "@/lib/treatments";
import { nav, site } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-sunken">
      <div className="mx-auto max-w-350 px-4 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Monogram className="h-12 w-auto text-gold" strokeWidth={30} />
            <p className="font-display mt-8 max-w-sm text-3xl leading-[1.15] md:text-4xl">
              Un sourire aligné, <em className="text-gold-ink">pensé pour vous.</em>
            </p>
            <div
              aria-hidden
              className="mask-signature mt-8 h-12 w-56 bg-gold opacity-80"
            />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:col-span-7 md:grid-cols-3">
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-ink-muted">Cabinet</h2>
              <address className="mt-5 not-italic leading-relaxed text-ink-soft">
                {site.address.building}
                <br />
                {site.address.street}
                <br />
                {site.address.postalCode} {site.address.city}, {site.address.country}
              </address>
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm text-gold-ink underline decoration-gold/40 underline-offset-4 hover:decoration-gold"
              >
                Itinéraire
              </a>
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-[0.22em] text-ink-muted">Contact</h2>
              <ul className="mt-5 space-y-2 text-ink-soft">
                <li>
                  <a href={site.phones.landline.href} className="hover:text-ink">
                    Tél. {site.phones.landline.display}
                  </a>
                </li>
                <li>
                  <a href={site.phones.mobile.href} className="hover:text-ink">
                    Mob. {site.phones.mobile.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="hover:text-ink">
                    {site.email}
                  </a>
                </li>
                <li className="pt-1 text-ink-muted">{site.hours}</li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-10 sm:col-span-2 md:col-span-1 md:grid-cols-1">
              <div>
                <h2 className="text-xs uppercase tracking-[0.22em] text-ink-muted">Navigation</h2>
                <ul className="mt-5 space-y-2 text-ink-soft">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-ink">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-[0.22em] text-ink-muted">Suivre le cabinet</h2>
                <div className="mt-5 flex gap-3">
                  {[
                    { href: site.social.instagram, label: "Instagram", Icon: InstagramLogoIcon },
                    { href: site.social.facebook, label: "Facebook", Icon: FacebookLogoIcon },
                    { href: site.whatsapp, label: "WhatsApp", Icon: WhatsappLogoIcon },
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line-strong transition-colors duration-500 ease-luxe hover:bg-gold-soft hover:text-gold-ink hover:ring-gold"
                    >
                      <Icon size={20} weight="light" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-ink-muted">
          <span className="sr-only">Traitements :</span>
          {treatments.map((t) => (
            <Link key={t.slug} href={`/traitements/${t.slug}`} className="hover:text-ink">
              {t.name}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 text-xs text-ink-muted md:flex-row">
          <p>
            © {year} {site.name}. Spécialiste en orthopédie dento-faciale à Nabeul.
          </p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:text-ink">
              Mentions légales
            </Link>
            <Link href="/dashboard" className="hover:text-ink" prefetch={false}>
              Espace cabinet
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
