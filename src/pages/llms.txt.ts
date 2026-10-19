import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { profile } from '../data/profile';

export const GET: APIRoute = async ({ site }) => {
  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  const url = (p: string) => new URL(p, site).href;
  const body = [
    `# ${profile.name}`,
    '',
    `> ${profile.title} at ${profile.employer}, ${profile.city}, Canada. ${profile.tagline}`,
    '',
    profile.summary,
    '',
    '## Start here',
    `- [Read the paper](${url('/read')}): everything on one page`,
    `- [Résumé](${url('/resume')})`,
    `- [Contact](${url('/contact')}): ${profile.email}`,
    '',
    '## Projects',
    ...projects.map((p) => `- [${p.data.title}](${url(`/projects/${p.id}`)}): ${p.data.summary}`),
    '',
  ].join('\n');
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } });
};
