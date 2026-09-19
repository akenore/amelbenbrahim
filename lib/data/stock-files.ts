// Local copies of the illustrative Unsplash photos (public/img/stock), with the
// Unsplash photo ID each was downloaded from. Used for article covers stored in
// the database and to migrate covers saved while they were still remote URLs.

export const stockFiles = {
  "adult-smile": { src: "/img/stock/adult-smile.jpg", width: 2000, height: 3000, unsplashId: "1567516364473-233c4b6fcfbe" },
  adult: { src: "/img/stock/adult.jpg", width: 2000, height: 1333, unsplashId: "1489278353717-f64c6ee8a4d2" },
  "aligner-fit": { src: "/img/stock/aligner-fit.jpg", width: 2000, height: 1500, unsplashId: "1777793636393-a0fec488f3fb" },
  apple: { src: "/img/stock/apple.jpg", width: 2000, height: 1333, unsplashId: "1552255349-450c59a5ec8e" },
  "braces-models": { src: "/img/stock/braces-models.jpg", width: 2000, height: 1500, unsplashId: "1720685193942-5a1c5ac7fd80" },
  "braces-smile": { src: "/img/stock/braces-smile.jpg", width: 2000, height: 1333, unsplashId: "1656514894252-fb336a3ad6a6" },
  child: { src: "/img/stock/child.jpg", width: 2000, height: 3001, unsplashId: "1593183230686-69876b0cb240" },
  retainer: { src: "/img/stock/retainer.jpg", width: 2000, height: 2000, unsplashId: "1695275857301-19e5a9995108" },
  "scan-3d": { src: "/img/stock/scan-3d.jpg", width: 2000, height: 1333, unsplashId: "1600170311833-c2cf5280ce49" },
  scanner: { src: "/img/stock/scanner.jpg", width: 2000, height: 3000, unsplashId: "1667133295315-820bb6481730" },
  teen: { src: "/img/stock/teen.jpg", width: 2000, height: 1333, unsplashId: "1603472559212-8820d4e0e041" },
} as const;

export type StockFile = keyof typeof stockFiles;

const byUnsplashId = new Map<string, (typeof stockFiles)[StockFile]>(
  Object.values(stockFiles).map((f) => [f.unsplashId, f]),
);

/** Local equivalent of a former images.unsplash.com URL, if we host that photo. */
export function localStockFor(src: string) {
  const id = /^https:\/\/images\.unsplash\.com\/photo-([\w-]+)/.exec(src)?.[1];
  return id ? byUnsplashId.get(id) : undefined;
}
