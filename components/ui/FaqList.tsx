import { Plus } from "@phosphor-icons/react/dist/ssr";

/** Native <details> so answers stay in the HTML for search engines and work without JS. */
export function FaqList({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="border-t border-line-strong">
      {items.map((item, i) => (
        <details key={item.q} className="faq-item group border-b border-line-strong" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-7 text-left">
            <h3 className="font-display text-xl leading-snug md:text-2xl">{item.q}</h3>
            <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-line-strong transition-[transform,background-color] duration-500 ease-luxe group-open:rotate-45 group-open:bg-gold-soft group-open:ring-gold">
              <Plus size={16} weight="light" />
            </span>
          </summary>
          <p className="max-w-[62ch] pb-8 pr-12 leading-relaxed text-ink-soft">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
