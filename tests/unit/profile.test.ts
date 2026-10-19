import { describe, it, expect } from 'vitest';
import { profile } from '../../src/data/profile';

describe('profile', () => {
  it('leads with the current role, exactly as on the contract', () => {
    expect(profile.roles[0]).toMatchObject({ title: 'Business Systems Analyst', org: 'The Kara Consultancy', start: '2026-09', end: 'present' });
  });
  it('shows WirelessPlus as current and part-time', () => {
    const wp = profile.roles.find((r) => r.org === 'WirelessPlus');
    expect(wp).toMatchObject({ note: 'part-time', end: 'present' });
  });
  it('carries no phone number, client or vendor name, and no job-seeking claim', () => {
    expect(JSON.stringify(profile)).not.toMatch(/\+1|\(437\)|872|TireGuru|305 ?Tires|open to (new )?(roles|work)/i);
  });
  it('says only freelance and collaborations about availability', () => {
    expect(profile.availability).toBe('Open to freelance and collaborations.');
  });
});
