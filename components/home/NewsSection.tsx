import Link from "next/link";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/Reveal";
import { PostCover, PostMeta } from "@/components/news/PostCard";
import { Cta } from "@/components/ui/Cta";
import type { Post } from "@/lib/data/types";
import { getHomeNews, hasPublishedPosts } from "@/lib/posts";
import { site } from "@/lib/site";

/**
 * Shows the articles put « à la une » from the dashboard (three at most, newest first).
 * Nothing chosen and articles published: the section is left out of the home page.
 */
export async function NewsSection() {
  const posts = await getHomeNews(3);
  if (posts.length === 0 && (await hasPublishedPosts())) return null;

  const [lead, ...rest] = posts;
  const alone = Boolean(lead) && rest.length === 0;

  return (
    <section aria-labelledby="actualites-titre" className="bg-sunken">
      <div className="mx-auto max-w-350 px-4 py-16 md:px-8 md:py-24">
        <Reveal className="max-w-3xl">
          <p className="inline-flex rounded-full px-3.5 py-1.5 text-xs uppercase tracking-[0.22em] text-gold-ink ring-1 ring-gold/40">
            Actualités
          </p>
          <h2 id="actualites-titre" className="font-display mt-7 text-4xl leading-[1.08] md:text-6xl">
            Les nouvelles du cabinet
          </h2>
        </Reveal>

        {!lead ? (
          <Reveal className="mt-14 rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line">
            <div className="rounded-[1.625rem] bg-elevated px-8 py-16 text-center md:py-20">
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
            <Reveal className={alone ? "lg:col-span-8 lg:col-start-3" : "lg:col-span-7"} blur={false}>
              <Lead post={lead} alone={alone} />
            </Reveal>

            {alone ? (
              <div className="flex justify-center lg:col-span-8 lg:col-start-3">
                <AllNewsLink />
              </div>
            ) : (
              <div className="flex flex-col gap-10 lg:col-span-5">
                {rest.map((post, i) => (
                  <Reveal key={post.id} delay={0.1 + i * 0.08} blur={false}>
                    <Secondary post={post} />
                  </Reveal>
                ))}
                <div className="mt-auto">
                  <AllNewsLink />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Lead({ post, alone }: { post: Post; alone: boolean }) {
  return (
    <article className="group relative">
      <div className="rounded-4xl bg-ink/3 p-1.5 ring-1 ring-line">
        <PostCover post={post} sizes={alone ? "(min-width: 1536px) 940px, (min-width: 1024px) 66vw, 92vw" : "(min-width: 1536px) 780px, (min-width: 1024px) 55vw, 92vw"} className="aspect-16/11" />
      </div>
      <div className="px-2 pt-7">
        <PostMeta post={post} />
        <h3 className="font-display mt-4 text-3xl leading-[1.12] md:text-[2.6rem]">
          <Link href={`/actualites/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
        <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-ink-soft">{post.excerpt}</p>
      </div>
    </article>
  );
}

function Secondary({ post }: { post: Post }) {
  return (
    <article className="group relative grid grid-cols-[120px_1fr] gap-5 sm:grid-cols-[180px_1fr]">
      <div className="rounded-[1.4rem] bg-ink/3 p-1 ring-1 ring-line">
        <PostCover post={post} sizes="180px" className="aspect-square rounded-[1.15rem]!" />
      </div>
      <div className="self-center">
        <PostMeta post={post} compact />
        <h3 className="font-display mt-2 text-xl leading-snug md:text-2xl">
          <Link href={`/actualites/${post.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

function AllNewsLink() {
  return (
    <Link
      href="/actualites"
      className="group inline-flex items-center gap-3 self-start border-b border-line-strong pb-1 text-ink transition-colors duration-500 hover:border-gold"
    >
      Toutes les actualités
      <ArrowRightIcon size={16} weight="light" className="transition-transform duration-500 ease-luxe group-hover:translate-x-1" />
    </Link>
  );
}
