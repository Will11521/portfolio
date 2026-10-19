import { describe, it, expect } from 'vitest';
import { formatEdition, ottawaClock, volumeFor } from '../../src/lib/edition';

describe('edition', () => {
  it('numbers the volume by year', () => expect(volumeFor(new Date('2026-10-19T16:41:00Z'))).toBe(26));
  it('prints the dateline in Ottawa time', () =>
    expect(formatEdition(new Date('2026-10-19T16:41:00Z'))).toBe('Monday, October 19, 2026 · Ottawa Edition · Vol. 26'));
  it('rolls the date back across midnight UTC', () =>
    expect(formatEdition(new Date('2027-01-01T03:00:00Z'))).toBe('Thursday, December 31, 2026 · Ottawa Edition · Vol. 26'));
});

describe('ottawaClock', () => {
  it('shows a short day, date and 24-hour time', () => expect(ottawaClock(new Date('2026-10-19T16:41:00Z'))).toBe('Mon 19 Oct 12:41'));
  it('uses standard time in winter', () => expect(ottawaClock(new Date('2026-01-05T03:00:00Z'))).toBe('Sun 4 Jan 22:00'));
});
