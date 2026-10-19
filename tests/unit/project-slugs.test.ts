import { describe, it, expect } from 'vitest';
import { readdirSync } from 'node:fs';
import { PROJECT_SLUGS } from '../../src/data/project-slugs';

describe('PROJECT_SLUGS', () => {
  it('matches the project files', () => {
    const files = readdirSync('src/content/projects').filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''));
    expect([...PROJECT_SLUGS].sort()).toEqual(files.sort());
  });
});
