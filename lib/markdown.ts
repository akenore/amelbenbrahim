import { marked } from "marked";
import TurndownService from "turndown";

// Articles are stored as Markdown (rendered by components/news/Markdown.tsx).
// The dashboard editor works on HTML, so it converts in both directions.

marked.use({ gfm: true, breaks: false });

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false });
}

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  emDelimiter: "*",
  codeBlockStyle: "fenced",
  hr: "---",
});

// Default rule indents list items by three spaces; keep the "- item" style of the existing articles.
turndown.addRule("listItem", {
  filter: "li",
  replacement: (content, node) => {
    const text = content.replace(/^\n+/, "").replace(/\n+$/, "\n").replace(/\n/gm, "\n  ");
    const parent = node.parentNode as HTMLElement | null;
    let prefix = "- ";
    if (parent?.nodeName === "OL") {
      const start = Number(parent.getAttribute("start") ?? 1);
      // The server-side DOM used by Turndown has a non-iterable HTMLCollection.
      prefix = `${start + Array.prototype.indexOf.call(parent.children, node)}. `;
    }
    return prefix + text + (node.nextSibling && !/\n$/.test(text) ? "\n" : "");
  },
});

export function htmlToMarkdown(html: string): string {
  return turndown.turndown(html).trim();
}
