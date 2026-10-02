"use client";

import { useState } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Placeholder } from "@tiptap/extensions";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import {
  ArrowClockwiseIcon,
  ArrowCounterClockwiseIcon,
  CheckIcon,
  ImageSquareIcon,
  LinkBreakIcon,
  LinkSimpleIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  MinusIcon,
  QuotesIcon,
  TextBIcon,
  TextHThreeIcon,
  TextHTwoIcon,
  TextItalicIcon,
  XIcon,
} from "@phosphor-icons/react";
import {
  UploadPlaceholder,
  addUploadPlaceholder,
  removeUploadPlaceholder,
  uploadPlaceholderPosition,
} from "@/components/dashboard/upload-placeholder";
import type { MediaImage } from "@/lib/data/types";
import { htmlToMarkdown, markdownToHtml } from "@/lib/markdown";

/**
 * Visual editor (Tiptap). What you see is what the article looks like; the text
 * is still saved as Markdown, so older articles keep working.
 */
export function RichTextEditor({
  value,
  onChange,
  onUpload,
  uploading,
}: {
  /** Markdown, read once when the editor is created. */
  value: string;
  onChange: (markdown: string) => void;
  onUpload: (file: File) => Promise<MediaImage | null>;
  uploading: boolean;
}) {
  const [linkBar, setLinkBar] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false, // the dashboard is rendered on the server first
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // No Markdown equivalent, and the article style has no place for them.
        underline: false,
        strike: false,
        code: false,
        codeBlock: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Image.configure({ HTMLAttributes: { loading: "lazy", decoding: "async" } }),
      UploadPlaceholder,
      Placeholder.configure({
        placeholder: "Rédigez votre article ici. Utilisez la barre d’outils pour les titres, les listes et les images.",
      }),
    ],
    content: markdownToHtml(value),
    editorProps: {
      attributes: {
        class: "prose-article min-h-130 px-6 py-6 focus:outline-none md:px-10",
        "aria-label": "Contenu de l’article",
        role: "textbox",
        "aria-multiline": "true",
      },
      handlePaste: (_view, event) => uploadImages(event.clipboardData?.files),
      handleDrop: (view, event) =>
        // Dropped images land where they were dropped, not where the cursor was.
        uploadImages(event.dataTransfer?.files, view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos),
    },
    onUpdate: ({ editor }) => onChange(htmlToMarkdown(editor.getHTML())),
  });

  function uploadImages(files: FileList | undefined, at?: number) {
    const images = [...(files ?? [])].filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return false;
    void insertImages(images, at);
    return true; // handled: the browser must not insert the files itself
  }

  /**
   * The spot is marked for the whole batch: writing elsewhere while the upload runs
   * moves the mark with the text, so the images still land where they were asked for,
   * in order, and the author keeps their cursor.
   */
  async function insertImages(files: File[], at?: number) {
    if (!editor) return;
    const mark = crypto.randomUUID();
    // After the selection, so an upload never replaces what the author had selected.
    addUploadPlaceholder(editor, mark, at ?? editor.state.selection.to);
    try {
      for (const file of files) {
        let image: MediaImage | null = null;
        try {
          image = await onUpload(file);
        } catch (error) {
          console.error("[image]", error);
        }
        const position = uploadPlaceholderPosition(editor, mark);
        // One image failing must not stop the others.
        if (!image || position === null || editor.isDestroyed) continue;
        editor
          .chain()
          .insertContentAt(position, { type: "image", attrs: { src: image.src, alt: "" } }, { updateSelection: false })
          .run();
      }
    } finally {
      removeUploadPlaceholder(editor, mark);
    }
  }

  async function insertImage(file: File) {
    await insertImages([file]);
  }

  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      h2: editor?.isActive("heading", { level: 2 }) ?? false,
      h3: editor?.isActive("heading", { level: 3 }) ?? false,
      bullet: editor?.isActive("bulletList") ?? false,
      ordered: editor?.isActive("orderedList") ?? false,
      quote: editor?.isActive("blockquote") ?? false,
      link: editor?.isActive("link") ?? false,
      image: editor?.isActive("image") ?? false,
      imageAlt: (editor?.getAttributes("image").alt as string) ?? "",
      href: (editor?.getAttributes("link").href as string) ?? "",
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  });

  if (!editor || !state) {
    return <div className="min-h-130 rounded-3xl bg-elevated ring-1 ring-line" aria-busy="true" />;
  }

  function applyLink(url: string) {
    const href = url.trim();
    if (!href || !editor) return;
    const full = /^(https?:|mailto:|tel:|\/|#)/.test(href) ? href : `https://${href}`;
    const chain = editor.chain().focus().extendMarkRange("link");
    if (editor.state.selection.empty && !editor.isActive("link")) chain.insertContent(full).run();
    else chain.setLink({ href: full }).run();
    setLinkBar(null);
  }

  return (
    <div className="rounded-3xl bg-elevated ring-1 ring-line focus-within:ring-gold-ink">
      <div className="flex flex-wrap items-center gap-1 border-b border-line px-3 py-2">
        <Tool label="Gras" Icon={TextBIcon} active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
        <Tool label="Italique" Icon={TextItalicIcon} active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <Separator />
        <Tool
          label="Titre de section"
          Icon={TextHTwoIcon}
          active={state.h2}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <Tool
          label="Sous-titre"
          Icon={TextHThreeIcon}
          active={state.h3}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
        <Separator />
        <Tool label="Liste à puces" Icon={ListBulletsIcon} active={state.bullet} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Tool label="Liste numérotée" Icon={ListNumbersIcon} active={state.ordered} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <Tool label="Citation" Icon={QuotesIcon} active={state.quote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <Tool label="Séparateur" Icon={MinusIcon} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <Separator />
        <Tool label="Lien" Icon={LinkSimpleIcon} active={state.link} onClick={() => setLinkBar(state.href)} />
        {state.link && (
          <Tool label="Retirer le lien" Icon={LinkBreakIcon} onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()} />
        )}
        <label
          title="Insérer une image"
          className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2 text-[13px] text-ink-soft transition-colors hover:bg-gold-soft hover:text-ink"
        >
          <ImageSquareIcon size={18} weight="light" />
          <span className="hidden sm:inline">{uploading ? "Envoi…" : "Image"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (file) void insertImage(file);
            }}
          />
        </label>
        <div className="ml-auto flex items-center gap-1">
          <Tool label="Annuler" Icon={ArrowCounterClockwiseIcon} disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()} />
          <Tool label="Rétablir" Icon={ArrowClockwiseIcon} disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()} />
        </div>
      </div>

      {linkBar !== null && <LinkBar initial={linkBar} onApply={applyLink} onCancel={() => setLinkBar(null)} />}

      {state.image && (
        <div className="flex flex-wrap items-center gap-3 border-b border-line bg-sunken px-3 py-2">
          <label htmlFor="image-alt" className="text-[13px] text-ink-soft">
            Description de l’image
          </label>
          <input
            id="image-alt"
            value={state.imageAlt}
            onChange={(e) => editor.chain().updateAttributes("image", { alt: e.target.value }).run()}
            placeholder="Ce que montre la photo (lu par les malvoyants et par Google)"
            className="min-w-0 flex-1 rounded-xl bg-bg px-3 py-2 text-[14px] ring-1 ring-line-strong focus:outline-none focus:ring-2 focus:ring-gold-ink"
          />
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

function Separator() {
  return <span aria-hidden className="mx-1 h-6 w-px bg-line" />;
}

function Tool({
  label,
  Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  Icon: typeof TextBIcon;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:opacity-40 ${
        active ? "bg-gold-soft text-gold-ink" : "text-ink-soft hover:bg-gold-soft hover:text-ink"
      }`}
    >
      <Icon size={18} weight={active ? "bold" : "light"} />
    </button>
  );
}

function LinkBar({ initial, onApply, onCancel }: { initial: string; onApply: (url: string) => void; onCancel: () => void }) {
  const [url, setUrl] = useState(initial);
  return (
    <div className="flex items-center gap-2 border-b border-line bg-sunken px-3 py-2">
      <label htmlFor="link-url" className="sr-only">
        Adresse du lien
      </label>
      <input
        id="link-url"
        autoFocus
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onApply(url);
          }
          if (e.key === "Escape") onCancel();
        }}
        placeholder="https://exemple.com ou /traitements"
        className="min-w-0 flex-1 rounded-xl bg-bg px-3 py-2 text-[14px] ring-1 ring-line-strong focus:outline-none focus:ring-2 focus:ring-gold-ink"
      />
      <button
        type="button"
        onClick={() => onApply(url)}
        aria-label="Appliquer le lien"
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-btn text-btn-ink"
      >
        <CheckIcon size={16} weight="light" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        aria-label="Annuler"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft ring-1 ring-line-strong hover:text-ink"
      >
        <XIcon size={16} weight="light" />
      </button>
    </div>
  );
}
