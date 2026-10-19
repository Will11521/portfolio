export type Wallpaper = 'sunset' | 'paper' | 'night';

export const WALLPAPERS: readonly Wallpaper[] = ['sunset', 'paper', 'night'];

export const WALLPAPER_KEY = 'wos-wallpaper';

/** The wallpaper to show: a stored choice wins, then the system theme, then Sunset. */
export function resolveWallpaper(stored: string | null, prefersDark: boolean): Wallpaper {
  if (stored && (WALLPAPERS as readonly string[]).includes(stored)) return stored as Wallpaper;
  return prefersDark ? 'night' : 'sunset';
}
