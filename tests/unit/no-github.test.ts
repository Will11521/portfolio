// William asked for GitHub off the site (2026-10-19). Scans every built page and text file.
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const walk = (d: string): string[] => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const built = existsSync(join(dist, 'index.html'));

describe.skipIf(!built && !process.env.CI)('no GitHub on the site', () => {
  it('no built page or text file mentions GitHub', () => {
    const hits = walk(dist).filter((f) => /\.(html|txt|xml|js|json)$/.test(f) && /github/i.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
});
