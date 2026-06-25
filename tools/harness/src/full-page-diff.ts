/**
 * Full-page visual diff: reference URL vs rebuilt URL.
 * Takes full-page screenshots of both at a given viewport width,
 * trims to the shorter height, diffs with pixelmatch, and writes
 * three PNGs: reference, rendered, diff.
 *
 * Usage:
 *   npx tsx src/full-page-diff.ts [viewport_width] [reference_url]
 *   npx tsx src/full-page-diff.ts 1280
 *   npx tsx src/full-page-diff.ts 1280 https://uni.themerex.net
 */
import { chromium } from 'playwright';
import pixelmatch from 'pixelmatch';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

const DEFAULT_LIVE_URL = 'https://ranch-trade-51285426.figma.site';
const REBUILT_URL = 'http://localhost:5175/';
const VIEWPORT_WIDTH = parseInt(process.argv[2] ?? '1280', 10);
const LIVE_URL = process.argv[3] ?? DEFAULT_LIVE_URL;

// derive a short label from the reference hostname for output filenames
const refLabel = new URL(LIVE_URL).hostname.split('.')[0];
const OUT_DIR = path.join(process.cwd(), 'validation/full-page');

fs.mkdirSync(OUT_DIR, { recursive: true });

async function fullPageShot(url: string, label: string): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: VIEWPORT_WIDTH, height: 900 });
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  // Give animations / lazy images a moment to settle
  await page.waitForTimeout(3000);
  const buf = await page.screenshot({ fullPage: true });
  await browser.close();
  const outPath = path.join(OUT_DIR, `${label}-${refLabel}-${VIEWPORT_WIDTH}.png`);
  fs.writeFileSync(outPath, buf);
  console.log(`  saved ${outPath}`);
  return buf;
}

async function main() {
  console.log(`\nFull-page diff @ ${VIEWPORT_WIDTH}px`);
  console.log(`  reference: ${LIVE_URL}`);
  console.log(`  rebuilt:   ${REBUILT_URL}\n`);

  console.log('Capturing reference (live)…');
  const refBuf = await fullPageShot(LIVE_URL, 'reference');

  console.log('Capturing rendered (rebuilt)…');
  const renBuf = await fullPageShot(REBUILT_URL, 'rendered');

  // Normalise both to the same dimensions (trim to shorter)
  const refMeta = await sharp(refBuf).metadata();
  const renMeta = await sharp(renBuf).metadata();

  const w = Math.min(refMeta.width!, renMeta.width!);
  const h = Math.min(refMeta.height!, renMeta.height!);

  console.log(`\nRef size:  ${refMeta.width}×${refMeta.height}`);
  console.log(`Ren size:  ${renMeta.width}×${renMeta.height}`);
  console.log(`Diff area: ${w}×${h}\n`);

  const [refRaw, renRaw] = await Promise.all([
    sharp(refBuf).resize(w, h, { fit: 'cover', position: 'top' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
    sharp(renBuf).resize(w, h, { fit: 'cover', position: 'top' }).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  ]);

  const diffData = Buffer.alloc(w * h * 4);
  const mismatch = pixelmatch(refRaw.data, renRaw.data, diffData, w, h, {
    threshold: 0.1,
    includeAA: false,
  });

  const totalPixels = w * h;
  const matchPct = (((totalPixels - mismatch) / totalPixels) * 100).toFixed(2);
  const mismatchPct = ((mismatch / totalPixels) * 100).toFixed(2);

  const diffPath = path.join(OUT_DIR, `diff-${refLabel}-${VIEWPORT_WIDTH}.png`);
  await sharp(diffData, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(diffPath);

  console.log(`Results:`);
  console.log(`  match:    ${matchPct}%`);
  console.log(`  mismatch: ${mismatchPct}% (${mismatch.toLocaleString()} / ${totalPixels.toLocaleString()} px)`);
  console.log(`  diff PNG: ${diffPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
