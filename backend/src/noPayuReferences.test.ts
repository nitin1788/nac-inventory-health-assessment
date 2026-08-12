import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

/**
 * Regression test for the clean PayU removal: no PayU hostname or the
 * literal string "payu" should appear anywhere in this backend's runtime
 * TypeScript source (test files and this file itself excluded — this
 * file's own text necessarily contains the word). A future gateway
 * integration is expected to reintroduce provider-specific references;
 * this test exists to catch any leftover PayU reference surviving from
 * the removal, not to permanently forbid the string.
 */
function collectTsFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectTsFiles(full, out);
    } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
      out.push(full);
    }
  }
  return out;
}

test('no "payu" substring (case-insensitive) or PayU hostname appears in any non-test backend source file', () => {
  const srcDir = join(__dirname);
  const files = collectTsFiles(srcDir).filter(
    (f) =>
      !f.endsWith(join('src', 'noPayuReferences.test.ts')) &&
      // Base64-encoded PNG asset — "payu" appears here purely by chance
      // inside the encoded image bytes, not as an actual PayU reference.
      !f.endsWith(join('assets', 'nacLogo.ts'))
  );

  const offenders: { file: string; line: number; text: string }[] = [];
  for (const file of files) {
    const lines = readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (/payu/i.test(line)) {
        offenders.push({ file, line: i + 1, text: line.trim() });
      }
    });
  }

  assert.deepEqual(
    offenders,
    [],
    `Found leftover PayU reference(s):\n${offenders.map((o) => `  ${o.file}:${o.line}: ${o.text}`).join('\n')}`
  );
});
