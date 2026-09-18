"use client";

import { startTransition, useActionState, useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ImageSquare,
  LinkSimple,
  ListBullets,
  ListNumbers,
  Quotes,
  TextB,
  TextHTwo,
  TextHThree,
  TextItalic,
  UploadSimple,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { savePost, uploadImage, type SavePostState } from "@/app/dashboard/actions";
import { Markdown } from "@/components/news/Markdown";
import { postCategories, type MediaImage, type Post, type PostCategory } from "@/lib/data/types";
import { slugify, toTunisInput } from "@/lib/format";
import { site } from "@/lib/site";

const field =
  "w-full rounded-2xl bg-bg px-4 py-3 text-[15px] ring-1 ring-line-strong transition-shadow placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-gold";
const label = "text-[13px] text-ink-soft";
const panel = "rounded-[1.5rem] bg-elevated p-6 ring-1 ring-line";

function Counter({ value, max }: { value: number; max: number }) {
  return <span className={`text-[12px] ${value > max ? "text-danger" : "text-ink-muted"}`}>{value}/{max}</span>;
}

type Tool = { label: string; Icon: typeof TextB } & (
  | { kind: "wrap"; before: string; after: string; placeholder: string }
  | { kind: "prefix"; prefix: string; placeholder: string; numbered?: boolean }
  | { kind: "link" }
);

const TOOLS: Tool[] = [
  { label: "Gras", Icon: TextB, kind: "wrap", before: "**", after: "**", placeholder: "texte en gras" },
  { label: "Italique", Icon: TextItalic, kind: "wrap", before: "*", after: "*", placeholder: "texte en italique" },
  { label: "Titre de section", Icon: TextHTwo, kind: "prefix", prefix: "## ", placeholder: "Titre de section" },
  { label: "Sous-titre", Icon: TextHThree, kind: "prefix", prefix: "### ", placeholder: "Sous-titre" },
  { label: "Liste à puces", Icon: ListBullets, kind: "prefix", prefix: "- ", placeholder: "Élément" },
  { label: "Liste numérotée", Icon: ListNumbers, kind: "prefix", prefix: "", placeholder: "Élément", numbered: true },
  { label: "Citation", Icon: Quotes, kind: "prefix", prefix: "> ", placeholder: "Citation" },
  { label: "Lien", Icon: LinkSimple, kind: "link" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[13px] text-danger">{message}</p>;
}

export function PostEditor({ post, created }: { post: Post | null; created?: boolean }) {
  const [state, formAction, saving] = useActionState<SavePostState, FormData>(savePost, { status: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [category, setCategory] = useState<PostCategory>(post?.category ?? "cabinet");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [publishedAt, setPublishedAt] = useState(toTunisInput(post?.publishedAt ?? new Date().toISOString()));
  const [cover, setCover] = useState<MediaImage | null>(post?.cover ?? null);
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription ?? "");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [dirty, setDirty] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadingCover, startCoverUpload] = useTransition();
  const [uploadingInline, startInlineUpload] = useTransition();

  const isPublished = post?.status === "published";
  const effectiveSlug = slugTouched ? slug : slugify(title);
  const errors = state.errors ?? {};

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Cmd/Ctrl + S saves with the current status.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit(formRef.current.querySelector<HTMLButtonElement>("[data-primary]") ?? undefined);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const touch = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setDirty(true);
  };

  /* ---------------- Markdown toolbar ---------------- */

  function apply(transform: (selected: string) => { text: string; select?: [number, number] }) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end, value } = el;
    const { text, select } = transform(value.slice(start, end));
    const next = value.slice(0, start) + text + value.slice(end);
    setContent(next);
    setDirty(true);
    requestAnimationFrame(() => {
      el.focus();
      const [s, e] = select ?? [text.length, text.length];
      el.setSelectionRange(start + s, start + e);
    });
  }

  const wrap = (before: string, after: string, placeholder: string) =>
    apply((sel) => {
      const inner = sel || placeholder;
      return { text: `${before}${inner}${after}`, select: [before.length, before.length + inner.length] };
    });

  const prefixLines = (prefix: (i: number) => string, placeholder: string) =>
    apply((sel) => {
      const lines = (sel || placeholder).split("\n");
      const text = lines.map((l, i) => `${prefix(i)}${l}`).join("\n");
      return { text: `\n${text}\n`, select: [1, text.length + 1] };
    });

  function runTool(tool: Tool) {
    switch (tool.kind) {
      case "wrap":
        return wrap(tool.before, tool.after, tool.placeholder);
      case "prefix":
        return prefixLines(tool.numbered ? (i) => `${i + 1}. ` : () => tool.prefix, tool.placeholder);
      case "link":
        return apply((sel) => {
          const text = `[${sel || "texte du lien"}](https://)`;
          return { text, select: [text.length - 9, text.length - 1] };
        });
    }
  }

  /* ---------------- Uploads ---------------- */

  function upload(file: File, onDone: (image: MediaImage) => void, start: typeof startCoverUpload) {
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    start(async () => {
      const res = await uploadImage(fd);
      if (res.ok) onDone(res.image);
      else setUploadError(res.error);
    });
  }

  function onCoverFile(file?: File | null) {
    if (!file) return;
    upload(
      file,
      (image) => {
        setCover({ ...image, alt: cover?.alt || title });
        setDirty(true);
      },
      startCoverUpload,
    );
  }

  function onInlineFile(file?: File | null) {
    if (!file) return;
    upload(
      file,
      (image) => apply(() => ({ text: `\n![Description de l’image](${image.src})\n`, select: [3, 25] })),
      startInlineUpload,
    );
  }

  const googleTitle = seoTitle || title || "Titre de l’article";
  const googleDescription = seoDescription || excerpt || "Le résumé de l’article s’affichera ici.";

  return (
    <form
      ref={formRef}
      // Manual submit (instead of `action`) so React does not reset the controlled fields.
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
        setDirty(false);
        startTransition(() => formAction(fd));
      }}
      className="mx-auto max-w-7xl"
    >
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <input type="hidden" name="slug" value={effectiveSlug} />
      <input type="hidden" name="cover" value={JSON.stringify(cover)} />
      <input type="hidden" name="status" value={post?.status ?? "draft"} />

      {/* Action bar */}
      <div className="sticky top-[68px] z-10 -mx-4 mb-8 flex flex-wrap items-center gap-3 border-b border-line bg-sunken/90 px-4 py-3 backdrop-blur-xl md:-mx-10 md:px-10 lg:top-0">
        <Link href="/dashboard/articles" className="flex items-center gap-2 text-[14px] text-ink-soft hover:text-ink">
          <ArrowLeft size={16} weight="light" /> Articles
        </Link>
        <p role="status" className="ml-2 hidden text-[13px] text-ink-muted md:block">
          {saving
            ? "Enregistrement…"
            : state.status === "success"
              ? state.message
              : state.status === "error"
                ? ""
                : created
                  ? "Article créé."
                  : dirty
                    ? "Modifications non enregistrées"
                    : ""}
        </p>
        <div className="ml-auto flex items-center gap-2">
          {isPublished && (
            <a
              href={`/actualites/${state.slug ?? post?.slug}`}
              target="_blank"
              className="hidden items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] text-ink-soft ring-1 ring-line-strong hover:text-ink sm:flex"
            >
              Voir <ArrowUpRight size={14} weight="light" />
            </a>
          )}
          <button
            type="submit"
            name="intent"
            value="draft"
            disabled={saving}
            className="rounded-full px-4 py-2.5 text-[14px] ring-1 ring-line-strong transition-colors hover:bg-gold-soft hover:ring-gold disabled:opacity-50"
          >
            {isPublished ? "Dépublier" : "Enregistrer le brouillon"}
          </button>
          <button
            type="submit"
            name="intent"
            value="publish"
            data-primary
            disabled={saving}
            className="rounded-full bg-btn px-5 py-2.5 text-[14px] text-btn-ink transition-transform duration-500 ease-luxe active:scale-[0.98] disabled:opacity-50"
          >
            {isPublished ? "Mettre à jour" : "Publier"}
          </button>
        </div>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="mb-6 flex items-center gap-2 rounded-2xl bg-danger/10 px-5 py-3 text-[14px] text-danger">
          <WarningCircle size={18} weight="light" /> {state.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="min-w-0">
          <label htmlFor="title" className="sr-only">
            Titre
          </label>
          <textarea
            id="title"
            name="title"
            rows={1}
            value={title}
            onChange={(e) => touch(setTitle)(e.target.value.replace(/\n/g, " "))}
            placeholder="Titre de l’article"
            className="font-display w-full resize-none bg-transparent text-4xl leading-tight [field-sizing:content] placeholder:text-ink-muted/60 focus:outline-none md:text-5xl"
          />
          <FieldError message={errors.title} />

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
            <span>
              {site.url.replace(/^https?:\/\//, "")}/actualites/
            </span>
            <input
              aria-label="Adresse de l’article"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                touch(setSlug)(slugify(e.target.value) || e.target.value.toLowerCase());
              }}
              className="min-w-[12rem] flex-1 rounded-lg bg-transparent px-2 py-1 text-ink-soft ring-1 ring-line focus:outline-none focus:ring-gold"
            />
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <label htmlFor="excerpt" className={label}>
                Résumé (affiché dans les listes et sur Google)
              </label>
              <Counter value={excerpt.length} max={320} />
            </div>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={excerpt}
              onChange={(e) => touch(setExcerpt)(e.target.value)}
              className={`${field} mt-2 resize-y`}
              placeholder="Deux ou trois phrases qui donnent envie de lire l’article."
            />
            <FieldError message={errors.excerpt} />
          </div>

          <div className="mt-8 overflow-hidden rounded-[1.5rem] bg-elevated ring-1 ring-line">
            <div className="flex flex-wrap items-center gap-1 border-b border-line px-3 py-2">
              <div role="tablist" aria-label="Mode d’édition" className="mr-2 flex rounded-full bg-sunken p-1">
                {(["write", "preview"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] transition-colors ${tab === t ? "bg-elevated text-ink shadow-sm" : "text-ink-muted"}`}
                  >
                    {t === "write" ? "Écrire" : "Aperçu"}
                  </button>
                ))}
              </div>
              {tab === "write" &&
                TOOLS.map((tool) => (
                  <button
                    key={tool.label}
                    type="button"
                    onClick={() => runTool(tool)}
                    title={tool.label}
                    aria-label={tool.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft hover:bg-gold-soft hover:text-ink"
                  >
                    <tool.Icon size={18} weight="light" />
                  </button>
                ))}
              {tab === "write" && (
                <label
                  title="Insérer une image"
                  className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-[13px] text-ink-soft hover:bg-gold-soft hover:text-ink"
                >
                  <ImageSquare size={18} weight="light" />
                  <span className="hidden sm:inline">{uploadingInline ? "Envoi…" : "Image"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="sr-only"
                    onChange={(e) => {
                      onInlineFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>

            <label htmlFor="content" className="sr-only">
              Contenu
            </label>
            <textarea
              ref={textareaRef}
              id="content"
              name="content"
              value={content}
              onChange={(e) => touch(setContent)(e.target.value)}
              placeholder={"Rédigez votre article ici.\n\n## Un titre de section\n\nUn paragraphe, une **mise en valeur**, une liste :\n- premier point\n- second point"}
              className={`min-h-[520px] w-full resize-y bg-transparent p-6 font-mono text-[14.5px] leading-7 focus:outline-none ${tab === "write" ? "block" : "hidden"}`}
            />
            {tab === "preview" && (
              <div className="min-h-[520px] p-6 md:p-10">
                {content.trim() ? (
                  <Markdown>{content}</Markdown>
                ) : (
                  <p className="text-ink-muted">Rien à prévisualiser pour l’instant.</p>
                )}
              </div>
            )}
          </div>
          <FieldError message={errors.content} />
          <p className="mt-3 text-[13px] text-ink-muted">
            Astuce : utilisez les boutons de la barre d’outils ou la syntaxe Markdown. Cmd/Ctrl + S pour enregistrer.
          </p>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-5">
          <section className={panel} aria-labelledby="publication">
            <h2 id="publication" className="font-display text-xl">
              Publication
            </h2>
            <div className="mt-5 flex flex-col gap-5">
              <div>
                <label htmlFor="publishedAt" className={label}>
                  Date de publication
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="datetime-local"
                  value={publishedAt}
                  onChange={(e) => touch(setPublishedAt)(e.target.value)}
                  className={`${field} mt-2`}
                />
                <p className="mt-1.5 text-[12px] text-ink-muted">Une date future programme la publication.</p>
                <FieldError message={errors.publishedAt} />
              </div>
              <div>
                <label htmlFor="category" className={label}>
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => touch(setCategory)(e.target.value as PostCategory)}
                  className={`${field} mt-2`}
                >
                  {Object.entries(postCategories).map(([value, text]) => (
                    <option key={value} value={value}>
                      {text}
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-[14px]">À la une</span>
                  <span className="block text-[12px] text-ink-muted">Mis en avant sur la page d’accueil</span>
                </span>
                <input
                  type="checkbox"
                  name="featured"
                  checked={featured}
                  onChange={(e) => touch(setFeatured)(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="relative h-7 w-12 shrink-0 rounded-full bg-ink/15 transition-colors duration-300 after:absolute after:left-1 after:top-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:bg-gold peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-gold"
                />
              </label>
            </div>
          </section>

          <section className={panel} aria-labelledby="couverture">
            <h2 id="couverture" className="font-display text-xl">
              Image de couverture
            </h2>
            {cover ? (
              <div className="mt-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sunken">
                  <Image src={cover.src} alt={cover.alt} fill sizes="340px" className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setCover(null);
                      setDirty(true);
                    }}
                    aria-label="Retirer l’image"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75"
                  >
                    <X size={16} weight="light" />
                  </button>
                </div>
                <label htmlFor="coverAlt" className={`${label} mt-4 block`}>
                  Description de l’image (accessibilité et SEO)
                </label>
                <input
                  id="coverAlt"
                  value={cover.alt}
                  onChange={(e) => {
                    setCover({ ...cover, alt: e.target.value });
                    setDirty(true);
                  }}
                  className={`${field} mt-2`}
                  placeholder="Ex. Le Dr. Ben Brahim lors d’un congrès"
                />
              </div>
            ) : (
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  onCoverFile(e.dataTransfer.files?.[0]);
                }}
                className={`mt-5 flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center transition-colors ${
                  dragging ? "border-gold bg-gold-soft" : "border-line-strong hover:border-gold hover:bg-gold-soft"
                }`}
              >
                <UploadSimple size={28} weight="thin" className="text-gold-ink" />
                <span className="px-6 text-[14px] text-ink-soft">
                  {uploadingCover ? "Envoi en cours…" : "Glissez une photo ici ou cliquez pour choisir"}
                </span>
                <span className="text-[12px] text-ink-muted">JPG, PNG, WebP, 10 Mo max.</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(e) => {
                    onCoverFile(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
            {uploadError && <p className="mt-3 text-[13px] text-danger">{uploadError}</p>}
          </section>

          <section className={panel} aria-labelledby="seo">
            <h2 id="seo" className="font-display text-xl">
              Référencement
            </h2>
            <div className="mt-5 rounded-2xl bg-bg p-4 ring-1 ring-line" aria-label="Aperçu Google">
              <p className="truncate text-[12px] text-ink-muted">
                {site.url.replace(/^https?:\/\//, "")} › actualites › {effectiveSlug || "..."}
              </p>
              <p className="mt-1 line-clamp-2 text-[16px] leading-snug text-gold-ink">
                {googleTitle} | {site.name}
              </p>
              <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-ink-soft">{googleDescription}</p>
            </div>
            <div className="mt-5">
              <div className="flex items-baseline justify-between">
                <label htmlFor="seoTitle" className={label}>
                  Titre SEO (facultatif)
                </label>
                <Counter value={seoTitle.length} max={70} />
              </div>
              <input
                id="seoTitle"
                name="seoTitle"
                value={seoTitle}
                onChange={(e) => touch(setSeoTitle)(e.target.value)}
                placeholder={title || "Par défaut : le titre"}
                className={`${field} mt-2`}
              />
            </div>
            <div className="mt-4">
              <div className="flex items-baseline justify-between">
                <label htmlFor="seoDescription" className={label}>
                  Description SEO (facultatif)
                </label>
                <Counter value={seoDescription.length} max={170} />
              </div>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={3}
                value={seoDescription}
                onChange={(e) => touch(setSeoDescription)(e.target.value)}
                placeholder="Par défaut : le résumé"
                className={`${field} mt-2 resize-y`}
              />
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}
