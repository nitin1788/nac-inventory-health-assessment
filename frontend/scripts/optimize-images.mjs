// One-off image-optimization pass (2026-08-21 SEO fixes). Not part of the
// build — `sharp` is intentionally NOT a project dependency (avoids adding
// an unnecessary package per project convention; see
// NAC_PHASE_1_IMPLEMENTATION_PLAN.md §7/§12.6 on deferring automated
// image tooling). To re-run: `npm install --no-save sharp` in `frontend/`
// first, then `node scripts/optimize-images.mjs`.
import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesRoot = join(__dirname, '..', 'public', 'images');

const MAX_WIDTH = 1600;
const MOBILE_WIDTH = 800;
const WEBP_QUALITY = 78;

async function findWebpPngFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await findWebpPngFiles(full)));
    } else if (entry.name.endsWith('.webp.png')) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  const files = await findWebpPngFiles(imagesRoot);
  console.log(`Found ${files.length} mislabeled files.\n`);

  const report = [];

  for (const file of files) {
    const before = await stat(file);
    const meta = await sharp(file).metadata();

    const dir = dirname(file);
    const nameNoExt = basename(file, '.webp.png');
    const fullOut = join(dir, `${nameNoExt}.webp`);
    const mobileOut = join(dir, `${nameNoExt}-800w.webp`);

    // Full-size (capped at MAX_WIDTH), correctly encoded WebP.
    const fullPipeline = sharp(file).rotate();
    if (meta.width && meta.width > MAX_WIDTH) {
      fullPipeline.resize({ width: MAX_WIDTH });
    }
    const fullInfo = await fullPipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(fullOut);

    // Mobile variant for responsive srcSet.
    const mobilePipeline = sharp(file).rotate().resize({ width: MOBILE_WIDTH });
    const mobileInfo = await mobilePipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toFile(mobileOut);

    await unlink(file);

    report.push({
      original: file.replace(imagesRoot, ''),
      originalSize: before.size,
      originalDims: `${meta.width}x${meta.height}`,
      fullOut: fullOut.replace(imagesRoot, ''),
      fullSize: fullInfo.size,
      fullDims: `${fullInfo.width}x${fullInfo.height}`,
      mobileOut: mobileOut.replace(imagesRoot, ''),
      mobileSize: mobileInfo.size,
      mobileDims: `${mobileInfo.width}x${mobileInfo.height}`,
    });
  }

  console.log('| Original | Before | Full WebP | After | Dims | Mobile WebP | Mobile size |');
  console.log('|---|---|---|---|---|---|---|');
  for (const r of report) {
    console.log(
      `| ${r.original} | ${(r.originalSize / 1024 / 1024).toFixed(2)}MB | ${r.fullOut} | ${(r.fullSize / 1024).toFixed(0)}KB | ${r.fullDims} | ${r.mobileOut} | ${(r.mobileSize / 1024).toFixed(0)}KB |`
    );
  }

  const totalBefore = report.reduce((s, r) => s + r.originalSize, 0);
  const totalAfter = report.reduce((s, r) => s + r.fullSize + r.mobileSize, 0);
  console.log(`\nTotal before: ${(totalBefore / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total after (full+mobile variants): ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
