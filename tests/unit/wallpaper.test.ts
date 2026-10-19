import { describe, it, expect } from 'vitest';
import { resolveWallpaper, WALLPAPERS } from '../../src/lib/wallpaper';

describe('resolveWallpaper', () => {
  it('defaults to sunset', () => expect(resolveWallpaper(null)).toBe('sunset'));
  it('honours a stored choice', () => expect(resolveWallpaper('paper')).toBe('paper'));
  it('ignores junk in storage', () => expect(resolveWallpaper('bogus')).toBe('sunset'));
  it('lists the three wallpapers in switch order', () => expect(WALLPAPERS).toEqual(['sunset', 'paper', 'night']));
});
