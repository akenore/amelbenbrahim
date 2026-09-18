// Extracts brand marks from the supplied logo/signature into transparent,
// single-colour masks used by the site (tinted with CSS `mask-image`).
// Run: node scripts/build-brand-assets.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

await mkdir('public/brand', { recursive: true });

// Monogram: gold strokes on black -> white strokes on transparent.
const crop = { left: 132, top: 123, width: 248, height: 162 };
const { data, info } = await sharp('public/img/logo.png')
  .extract(crop)
  .resize({ width: crop.width * 4, kernel: 'lanczos3' })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < data.length; i += 4) {
  const r = data[i], b = data[i + 2];
  const gold = Math.max(0, Math.min(1, (r - b - 18) / 60));
  const bright = Math.max(0, Math.min(1, (r - 70) / 120));
  const a = Math.round(gold * bright * 255);
  out[i] = out[i + 1] = out[i + 2] = 255;
  out[i + 3] = a;
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile('public/brand/monogram.png');

// Signature: already white on transparent, trim the empty canvas.
await sharp('public/img/signature.png').trim().png({ compressionLevel: 9 }).toFile('public/brand/signature.png');

console.log('brand assets written to public/brand/');

// Default Open Graph image (1200x630): black and gold panel + portrait.
await mkdir('public/og', { recursive: true });
const W = 1200, H = 630, PHOTO_W = 500;
const mono = await sharp('public/brand/monogram.png').resize({ width: 190 }).png().toBuffer({ resolveWithObject: true });
const goldMono = await sharp(mono.data)
  .composite([{ input: { create: { width: mono.info.width, height: mono.info.height, channels: 4, background: '#e4c68a' } }, blend: 'in' }])
  .png()
  .toBuffer();
const photo = await sharp('public/img/Dr.Amel-2-scaled-1.jpg')
  .resize({ width: PHOTO_W, height: H, fit: 'cover', position: 'north' })
  .toBuffer();
const text = Buffer.from(`<svg width="${W - PHOTO_W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="345" font-family="Didot, 'Bodoni 72', serif" font-size="57" fill="#f3efe6">Dr. Amel Ben Brahim</text>
  <text x="74" y="398" font-family="Futura, 'Avenir Next', sans-serif" font-size="21" letter-spacing="5" fill="#e4c68a">ORTHODONTISTE À NABEUL</text>
  <rect x="74" y="440" width="56" height="1.5" fill="#e4c68a" opacity="0.7"/>
  <text x="74" y="490" font-family="Futura, 'Avenir Next', sans-serif" font-size="23" fill="#f3efe6" opacity="0.72">Aligneurs invisibles, orthodontie linguale,</text>
  <text x="74" y="524" font-family="Futura, 'Avenir Next', sans-serif" font-size="23" fill="#f3efe6" opacity="0.72">enfants et adultes.</text>
</svg>`);
await sharp({ create: { width: W, height: H, channels: 3, background: '#0d0d0e' } })
  .composite([
    { input: goldMono, left: 72, top: 150 },
    { input: text, left: 0, top: 0 },
    { input: photo, left: W - PHOTO_W, top: 0 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og/cover.jpg');
console.log('og image written to public/og/cover.jpg');
