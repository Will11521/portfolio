import { profile } from '../data/profile';

const SITE = profile.links.site;

export function personJsonLd(p = profile): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    alternateName: p.shortName,
    jobTitle: p.title,
    worksFor: { '@type': 'Organization', name: p.employer },
    address: { '@type': 'PostalAddress', addressLocality: p.city, addressRegion: p.region, addressCountry: 'CA' },
    url: SITE,
    email: `mailto:${p.email}`,
    sameAs: [p.links.linkedin, p.links.github],
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Algonquin College' },
    knowsAbout: ['ERPNext', 'Systems integration', 'Walmart Marketplace', 'Python', 'AI agents', 'Web development'],
  };
}

export function profilePageJsonLd(path: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: SITE + (path === '/' ? '' : path),
    mainEntity: personJsonLd(),
  };
}

/** Where a page's Open Graph image lives: `/` → /og/index.png, `/projects/mikey/` → /og/projects-mikey.png. */
export function ogPath(path: string): string {
  const slug = path.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') || 'index';
  return `/og/${slug}.png`;
}
