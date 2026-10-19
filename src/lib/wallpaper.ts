export type Wallpaper = 'sunset' | 'paper' | 'night';

export const WALLPAPERS: readonly Wallpaper[] = ['sunset', 'paper', 'night'];

export const WALLPAPER_KEY = 'wos-wallpaper';

/** The wallpaper to show: a stored choice wins, otherwise Sunset — for every visitor, whatever their system theme. */
export function resolveWallpaper(stored: string | null): Wallpaper {
  if (stored && (WALLPAPERS as readonly string[]).includes(stored)) return stored as Wallpaper;
  return 'sunset';
}
