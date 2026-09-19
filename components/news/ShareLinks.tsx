"use client";

import { useState } from "react";
import { CheckIcon, FacebookLogoIcon, LinkSimpleIcon, WhatsappLogoIcon } from "@phosphor-icons/react";

export function ShareLinks({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(url);
  const item =
    "flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-line-strong text-ink-soft transition-colors duration-500 ease-luxe hover:bg-gold-soft hover:text-gold-ink hover:ring-gold";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="flex gap-2 lg:flex-col" aria-label="Partager l’article">
      <a className={item} href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur Facebook">
        <FacebookLogoIcon size={18} weight="light" />
      </a>
      <a className={item} href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" aria-label="Partager sur WhatsApp">
        <WhatsappLogoIcon size={18} weight="light" />
      </a>
      <button type="button" onClick={copy} className={item} aria-label={copied ? "Lien copié" : "Copier le lien"}>
        {copied ? <CheckIcon size={18} weight="light" /> : <LinkSimpleIcon size={18} weight="light" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Lien copié" : ""}
      </span>
    </div>
  );
}
