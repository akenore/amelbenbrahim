"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PostCard } from "@/components/news/PostCard";
import { postCategories, type Post, type PostCategory } from "@/lib/data/types";

type Filter = PostCategory | "all";

export function NewsGrid({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const present = Object.keys(postCategories).filter((c) => posts.some((p) => p.category === c)) as PostCategory[];
  const visible = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  if (posts.length === 0) {
    return (
      <div className="rounded-[2rem] bg-ink/[0.03] p-1.5 ring-1 ring-line">
        <div className="rounded-[calc(2rem-0.375rem)] bg-elevated px-8 py-20 text-center">
          <p className="font-display text-3xl">Aucune actualité pour le moment.</p>
          <p className="mx-auto mt-4 max-w-md text-ink-soft">Les prochains articles du cabinet apparaîtront ici.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {present.length > 1 && (
        <div role="group" aria-label="Filtrer par catégorie" className="mb-14 flex flex-wrap gap-2">
          {(["all", ...present] as Filter[]).map((key) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(key)}
                className={`relative rounded-full px-5 py-2.5 text-[14px] transition-colors duration-500 ease-luxe ${
                  active ? "text-btn-ink" : "text-ink-soft ring-1 ring-line-strong hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="news-filter"
                    className="absolute inset-0 rounded-full bg-btn"
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                  />
                )}
                <span className="relative">{key === "all" ? "Tout" : postCategories[key]}</span>
              </button>
            );
          })}
        </div>
      )}

      <motion.ul layout className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((post, i) => (
            <motion.li
              key={post.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className={i === 0 && filter === "all" ? "md:col-span-2 lg:col-span-2" : undefined}
            >
              <PostCard post={post} priority={i === 0 && filter === "all"} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
