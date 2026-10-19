import { describe, it, expect } from 'vitest';
import { personJsonLd, profilePageJsonLd, ogPath } from '../../src/lib/seo';

describe('structured data', () => {
  it('describes him with his current title and employer', () => {
    const p = personJsonLd() as any;
    expect(p['@type']).toBe('Person');
    expect(p.jobTitle).toBe('Business Systems Analyst');
    expect(p.worksFor).toEqual({ '@type': 'Organization', name: 'The Kara Consultancy' });
    expect(p.address).toEqual({ '@type': 'PostalAddress', addressLocality: 'Ottawa', addressRegion: 'ON', addressCountry: 'CA' });
    expect(p.sameAs).toEqual(['https://www.linkedin.com/in/williamjeetsingh2004/', 'https://github.com/Will11521']);
  });
  it('never publishes a phone number or street address', () => {
    const s = JSON.stringify(personJsonLd());
    expect(s).not.toMatch(/telephone|streetAddress|postalCode/);
  });
  it('wraps the person in a ProfilePage for a given URL', () => {
    const pp = profilePageJsonLd('/resume/') as any;
    expect(pp['@type']).toBe('ProfilePage');
    expect(pp.url).toBe('https://williamdev.is-a.dev/resume/');
    expect(pp.mainEntity.name).toBe('Williamjeet Singh');
  });
});

describe('ogPath', () => {
  it('maps the root', () => expect(ogPath('/')).toBe('/og/index.png'));
  it('flattens nested paths', () => expect(ogPath('/projects/mikey/')).toBe('/og/projects-mikey.png'));
});
