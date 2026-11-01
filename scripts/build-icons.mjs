/**
 * build-icons.mjs — Generates the raster icons from app/icon.svg (the source of truth):
 *   app/favicon.ico        16, 32 and 48 px PNGs in one .ico (browsers, Windows, crawlers)
 *   app/apple-icon.png     180 px, square corners — iOS rounds them itself
 *   public/icon-192.png    }
 *   public/icon-512.png    } home-screen icons for the web app manifest (app/manifest.ts)
 *
 *   node scripts/build-icons.mjs
 *
 * Rendering uses Next's own image renderer (next/og), so no extra dependency is needed.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ImageResponse } from 'next/og.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(`${root}app/icon.svg`, 'utf8');
// Full-bleed variant (no rounded corners) for platforms that apply their own mask.
const squareSvg = svg.replace(/(<rect[^>]*?)\srx="[^"]*"/, '$1');

async function renderPng(source, size) {
  const src = `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`;
  const response = new ImageResponse({ type: 'img', props: { src, width: size, height: size } }, { width: size, height: size });
  return Buffer.from(await response.arrayBuffer());
}

/** ICO container holding PNG images (supported by every current browser and Windows). */
function toIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, png }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += png.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.png)]);
}

const favicon = toIco(await Promise.all([16, 32, 48].map(async (size) => ({ size, png: await renderPng(svg, size) }))));
writeFileSync(`${root}app/favicon.ico`, favicon);
writeFileSync(`${root}app/apple-icon.png`, await renderPng(squareSvg, 180));
mkdirSync(`${root}public`, { recursive: true });
writeFileSync(`${root}public/icon-192.png`, await renderPng(svg, 192));
writeFileSync(`${root}public/icon-512.png`, await renderPng(svg, 512));

console.log(`wrote app/favicon.ico (${favicon.length} B), app/apple-icon.png, public/icon-192.png, public/icon-512.png`);
