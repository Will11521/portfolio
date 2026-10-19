import { describe, it, expect } from 'vitest';
import { resolveWallpaper, WALLPAPERS } from '../../src/lib/wallpaper';

describe('resolveWallpaper', () => {
  it('defaults to sunset', () => expect(resolveWallpaper(null, false)).toBe('sunset'));
  it('uses night for a dark-mode visitor with no choice yet', () => expect(resolveWallpaper(null, true)).toBe('night'));
  it('honours a stored choice over the system theme', () => expect(resolveWallpaper('paper', true)).toBe('paper'));
  it('ignores junk in storage', () => expect(resolveWallpaper('bogus', false)).toBe('sunset'));
  it('lists the three wallpapers in switch order', () => expect(WALLPAPERS).toEqual(['sunset', 'paper', 'night']));
});
