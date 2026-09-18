import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr. Amel Ben Brahim, orthodontiste à Nabeul",
    short_name: "Dr. Ben Brahim",
    description: "Cabinet d’orthodontie à Nabeul : aligneurs invisibles, orthodontie linguale, enfants et adultes.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0c",
    theme_color: "#0b0b0c",
    lang: "fr",
    icons: [
      { src: "/img/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/img/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
