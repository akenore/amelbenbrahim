import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Editor } from "@tiptap/react";

/**
 * Marks the spot where an image is being uploaded. The mark is a decoration, not
 * part of the article, so it never reaches the saved text — and it follows the
 * text if the author keeps writing before that spot while the upload runs.
 */
const key = new PluginKey<DecorationSet>("uploadPlaceholder");

type Action = { add?: { id: string; pos: number } } | { remove: string };

export const UploadPlaceholder = Extension.create({
  name: "uploadPlaceholder",
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key,
        state: {
          init: () => DecorationSet.empty,
          apply(transaction, set) {
            let next = set.map(transaction.mapping, transaction.doc);
            const action = transaction.getMeta(key) as Action | undefined;
            if (action && "add" in action && action.add) {
              const element = document.createElement("span");
              element.className = "upload-placeholder";
              element.textContent = "Image en cours d’envoi…";
              // side: 1 keeps the mark after content inserted at the same spot,
              // so a batch of images stays in order.
              next = next.add(transaction.doc, [Decoration.widget(action.add.pos, element, { id: action.add.id, side: 1 })]);
            }
            if (action && "remove" in action) {
              next = next.remove(next.find(undefined, undefined, (spec) => spec.id === action.remove));
            }
            return next;
          },
        },
        props: { decorations: (state) => key.getState(state) },
      }),
    ];
  },
});

export function addUploadPlaceholder(editor: Editor, id: string, pos: number) {
  if (editor.isDestroyed) return;
  editor.view.dispatch(editor.state.tr.setMeta(key, { add: { id, pos } }));
}

/** Where the placeholder sits now, after any edits made during the upload. */
export function uploadPlaceholderPosition(editor: Editor, id: string) {
  if (editor.isDestroyed) return null;
  const [decoration] = key.getState(editor.state)?.find(undefined, undefined, (spec) => spec.id === id) ?? [];
  return decoration?.from ?? null;
}

export function removeUploadPlaceholder(editor: Editor, id: string) {
  if (editor.isDestroyed) return; // the author left the page while an upload ran
  editor.view.dispatch(editor.state.tr.setMeta(key, { remove: id }));
}
