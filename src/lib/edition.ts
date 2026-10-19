const TZ = 'America/Toronto';

function parts(d: Date, opts: Intl.DateTimeFormatOptions): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat('en-CA', { timeZone: TZ, ...opts }).formatToParts(d)) out[p.type] = p.value;
  return out;
}

/** Volume number of the paper: years since 2000, in Ottawa. */
export function volumeFor(d: Date): number {
  return Number(parts(d, { year: 'numeric' }).year) - 2000;
}

/** "Monday, October 19, 2026 · Ottawa Edition · Vol. 26" */
export function formatEdition(d: Date): string {
  const p = parts(d, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  return `${p.weekday}, ${p.month} ${p.day}, ${p.year} · Ottawa Edition · Vol. ${volumeFor(d)}`;
}

/** "Mon 19 Oct 12:41" in Ottawa, 24-hour. */
export function ottawaClock(d: Date): string {
  const p = parts(d, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  return `${p.weekday.replace('.', '')} ${p.day} ${p.month.replace('.', '')} ${p.hour}:${p.minute}`;
}
