#!/usr/bin/env node
/**
 * Build-time image optimization.
 *
 * Walks public/ for raster sources (.jpg/.jpeg/.png), emits a .webp next to
 * each one, and skips work that has already been done by hashing source
 * contents into tools/scripts/.image-cache.json (gitignored).
 *
 * Wired as `prebuild` so `npm run build` always runs this first. The script
 * is a no-op when no .jpg/.jpeg/.png files are found, which is the steady
 * state once originals have been removed in favor of committed .webp.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, parse, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const PUBLIC_DIR = join(ROOT, 'public');
const CACHE_FILE = join(ROOT, 'tools/scripts/.image-cache.json');
const QUALITY = 82;
const SRC_EXTS = new Set(['.jpg', '.jpeg', '.png']);

function findImages(dir) {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findImages(path));
    else if (entry.isFile() && SRC_EXTS.has(parse(entry.name).ext.toLowerCase())) out.push(path);
  }
  return out;
}

function loadCache() {
  if (!existsSync(CACHE_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  mkdirSync(dirname(CACHE_FILE), { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n');
}

function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function rel(p) {
  return relative(ROOT, p);
}

async function main() {
  const cache = loadCache();
  const images = findImages(PUBLIC_DIR);
  let processed = 0;
  let skipped = 0;
  let bytesIn = 0;
  let bytesOut = 0;

  for (const src of images) {
    const hash = hashFile(src);
    const { dir, name } = parse(src);
    const dest = join(dir, `${name}.webp`);
    const key = rel(src);

    if (cache[key] === hash && existsSync(dest)) {
      skipped++;
      continue;
    }

    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    cache[key] = hash;
    processed++;
    const inSize = statSync(src).size;
    const outSize = statSync(dest).size;
    bytesIn += inSize;
    bytesOut += outSize;
    const pct = ((1 - outSize / inSize) * 100).toFixed(0);
    console.log(`  ${rel(src)} → ${rel(dest)}  (${(inSize / 1024).toFixed(0)}K → ${(outSize / 1024).toFixed(0)}K, -${pct}%)`);
  }

  saveCache(cache);

  if (processed === 0 && skipped === 0) {
    console.log('optimize-images: no source images found.');
  } else if (processed === 0) {
    console.log(`optimize-images: ${skipped} cached, nothing to do.`);
  } else {
    const totalPct = ((1 - bytesOut / bytesIn) * 100).toFixed(0);
    console.log(`optimize-images: ${processed} processed, ${skipped} cached. ${(bytesIn / 1024).toFixed(0)}K → ${(bytesOut / 1024).toFixed(0)}K (-${totalPct}%)`);
  }
}

main().catch((err) => {
  console.error('optimize-images failed:', err);
  process.exit(1);
});
