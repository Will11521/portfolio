export type IconName = 'paper' | 'folder' | 'owl' | 'resume' | 'terminal' | 'mail' | 'now' | 'archive' | 'ask';

/** Line-drawn ink icons, 24×24, stroked with currentColor. */
export const ICONS: Record<IconName, string> = {
  paper: '<rect x="3.5" y="4.5" width="17" height="15" rx="1"/><path d="M6.5 8h11M6.5 11h5M6.5 14h5M6.5 17h11"/><rect x="13" y="10.5" width="4.5" height="4" />',
  folder: '<path d="M3.5 7.5v11h17v-9h-9l-2-2.5h-6z"/><path d="M3.5 10h17"/>',
  owl: '<path d="M6 7l2 2M18 7l-2 2"/><path d="M5.5 9.5c0-2 2.9-3.5 6.5-3.5s6.5 1.5 6.5 3.5v6.5c0 2.5-2.9 4.5-6.5 4.5s-6.5-2-6.5-4.5z"/><circle cx="9.3" cy="12" r="1.8"/><circle cx="14.7" cy="12" r="1.8"/>',
  resume: '<path d="M6.5 3.5h8l3.5 3.5v13.5h-11.5z"/><path d="M14.5 3.5V7H18"/><path d="M9 11h6M9 14h6M9 17h4"/>',
  terminal: '<rect x="3.5" y="5" width="17" height="14" rx="1"/><path d="M7 10l2.5 2L7 14M11.5 15h5"/>',
  mail: '<rect x="3.5" y="6" width="17" height="12" rx="1"/><path d="M4 7l8 6 8-6"/>',
  now: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  archive: '<rect x="3.5" y="5" width="17" height="4" rx="0.5"/><path d="M5 9v10h14V9M10 12.5h4"/>',
  ask: '<path d="M4.5 5.5h15v10h-8l-4 3.5v-3.5h-3z"/><path d="M10 9.2c.2-1 1-1.6 2-1.6 1.2 0 2 .7 2 1.6 0 1.2-1.9 1.3-1.9 2.6M12.1 13.4v.1"/>',
};
