import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    kicker: z.string(),
    summary: z.string(),
    year: z.number(),
    status: z.enum(['In production', 'Building', 'Shipped', 'Concept', 'Retired']),
    kind: z.enum(['case', 'clipping']),
    order: z.number(),
    stack: z.array(z.string()),
    links: z.array(z.object({ label: z.string(), href: z.string() })).optional(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: z.object({ title: z.string(), updated: z.string() }),
});

export const collections = { projects, pages };
