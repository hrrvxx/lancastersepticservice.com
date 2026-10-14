// Converts generated source images (.assets/raw/*.png) into web-ready JPG + WebP in public/images.
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';

const RAW = '.assets/raw';
await mkdir('public/images/gallery', { recursive: true });

// Hero: 1920 wide plus responsive widths.
const hero = sharp(`${RAW}/hero.png`).resize(1920, 1080, { fit: 'cover' });
await hero.clone().jpeg({ quality: 78, mozjpeg: true }).toFile('public/images/hero.jpg');
await hero.clone().webp({ quality: 74 }).toFile('public/images/hero.webp');
for (const w of [800, 480]) {
  await sharp(`${RAW}/hero.png`).resize(w, Math.round((w * 9) / 16), { fit: 'cover' }).webp({ quality: 72 }).toFile(`public/images/hero-${w}w.webp`);
}
await sharp(`${RAW}/hero.png`).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile('public/images/og.jpg');

// Everything else: 4:3 at 800x600.
for (const f of (await readdir(RAW)).filter(f => f.endsWith('.png') && f !== 'hero.png' && !f.startsWith('logo'))) {
  const name = f.replace('.png', '');
  const img = sharp(`${RAW}/${f}`).resize(800, 600, { fit: 'cover' });
  await img.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(`public/images/gallery/${name}.jpg`);
  await img.clone().webp({ quality: 74 }).toFile(`public/images/gallery/${name}.webp`);
}
console.log('images done');
