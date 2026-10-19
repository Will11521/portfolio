// GitHub Pages: a page file `x.html` next to a folder `x/` makes `/x` redirect to `/x/` and 404.
// Requires a build in dist/ (CI builds before e2e; run `npm run build` locally first).
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const built = existsSync(join(dist, 'index.html'));

describe.skipIf(!built)('GitHub Pages layout', () => {
  const files = built ? walk(dist) : [];
  it('never has a page file beside a folder of the same name', () => {
    const clashes = files.filter((f) => f.endsWith('.html') && !f.endsWith('index.html') && !f.endsWith('404.html') && existsSync(f.replace(/\.html$/, '')));
    expect(clashes).toEqual([]);
  });
  it('links internal pages with a trailing slash', () => {
    const bad = new Set<string>();
    for (const f of files.filter((x) => x.endsWith('.html'))) {
      for (const [, href] of readFileSync(f, 'utf8').matchAll(/href="(\/[^"#?]*)"/g)) {
        if (href !== '/' && !href.endsWith('/') && !/\.[a-z0-9]+$/i.test(href)) bad.add(href);
      }
    }
    expect([...bad]).toEqual([]);
  });
});
