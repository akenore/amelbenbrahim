import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { headers } from "next/headers";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { noIndex, site } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const description =
  "Cabinet d’orthodontie du Dr. Amel Ben Brahim à Nabeul : aligneurs invisibles, orthodontie linguale, bagues céramique, traitements pour enfants et adultes.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Dr. Amel Ben Brahim | Orthodontiste à Nabeul",
    template: "%s | Dr. Amel Ben Brahim",
  },
  description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    "orthodontiste Nabeul",
    "orthodontie Nabeul",
    "aligneurs invisibles Nabeul",
    "orthodontie linguale Tunisie",
    "appareil dentaire Nabeul",
    "orthodontiste enfant Nabeul",
    "Dr Amel Ben Brahim",
  ],
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    locale: "fr_TN",
    siteName: site.name,
    title: "Dr. Amel Ben Brahim | Orthodontiste à Nabeul",
    description,
    images: [{ url: "/og/cover.jpg", width: 1200, height: 630, alt: "Dr. Amel Ben Brahim, orthodontiste à Nabeul" }],
  },
  twitter: { card: "summary_large_image", images: ["/og/cover.jpg"] },
  robots: noIndex() ? { index: false, follow: false } : { index: true, follow: true, "max-image-preview": "large" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

// Every page renders per request: the Content Security Policy nonce (proxy.ts) changes each
// time, and articles are read from the database, which is not reachable during `next build`.
export const dynamic = "force-dynamic";

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="fr" className={`${bodoni.variable} ${jost.variable}`} suppressHydrationWarning>
      <head>
        <script nonce={nonce} dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-dvh bg-bg text-ink">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
