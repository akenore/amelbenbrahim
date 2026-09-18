import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";
import { PostCover, PostMeta } from "@/components/news/PostCard";
import { Cta } from "@/components/ui/Cta";
import { getHomeNews } from "@/lib/posts";
import { site } from "@/lib/site";

export async function NewsSection() {
  const posts = await getHomeNews(3);
  const [lead, ...rest] = posts;

  return (
    <section aria-labelledby="actualites-titre" className="bg-sunken">
      <div className="mx-auto max-w-[1400px] px-4 py-24 md:px-8 md:py-36">
        <Reveal className="max-w-3xl">
          <p className="inline-flex rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] text-gold-ink ring-1 ring-gold/40">
            Actualités
          </p>
          <h2 id="actualites-titre" className="font-display mt-7 text-4xl leading-[1.08] md:text-6xl">
            Les nouvelles du cabinet
          </h2>
        </Reveal>

        {!lead ? (
          <Reveal className="mt-14 rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
            <div className="rounded-[calc(2rem-0.375rem)] bg-elevated px-8 py-16 text-center md:py-20">
              <p className="font-display text-3xl">Les premières actualités arrivent bientôt.</p>
              <p className="mx-auto mt-4 max-w-md text-ink-soft">
                En attendant, suivez la vie du cabinet sur Instagram.
              </p>
              <div className="mt-8 flex justify-center">
                <Cta href={site.social.instagram} variant="ghost" external>
                  Voir Instagram
                </Cta>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
            <Reveal className="lg:col-span-7" blur={false}>
              <article className="group">
                <Link href={`/actualites/${lead.slug}`} className="block">
                  <div className="rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
                    <PostCover post={lead} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[16/11]" />
                  </div>
                  <div className="px-2 pt-7">
                    <PostMeta post={lead} />
                    <h3 className="font-display mt-4 text-3xl leading-[1.12] md:text-[2.6rem]">{lead.title}</h3>
                    <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-soft">{lead.excerpt}</p>
                  </div>
                </Link>
              </article>
            </Reveal>

            <div className="flex flex-col gap-10 lg:col-span-5">
              {rest.map((post, i) => (
                <Reveal key={post.id} delay={0.1 + i * 0.08} blur={false}>
                  <article className="group">
                    <Link href={`/actualites/${post.slug}`} className="grid grid-cols-[120px_1fr] gap-5 sm:grid-cols-[180px_1fr]">
                      <div className="rounded-[1.4rem] bg-ink/[0.03] p-1 ring-1 ring-line">
                        <PostCover post={post} sizes="180px" className="aspect-square !rounded-[calc(1.4rem-0.25rem)]" />
                      </div>
                      <div className="self-center">
                        <PostMeta post={post} compact />
                        <h3 className="font-display mt-2 text-xl leading-snug md:text-2xl">{post.title}</h3>
                      </div>
                    </Link>
                  </article>
                </Reveal>
              ))}
              <Link
                href="/actualites"
                className="group mt-auto inline-flex items-center gap-3 self-start border-b border-line-strong pb-1 text-ink transition-colors duration-500 hover:border-gold"
              >
                Toutes les actualités
                <ArrowRight size={16} weight="light" className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
