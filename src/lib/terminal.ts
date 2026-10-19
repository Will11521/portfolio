import { profile, monthLabel } from '../data/profile';
import { PROJECT_SLUGS } from '../data/project-slugs';
import { FACTS } from '../data/assistant';
import { answer } from './assistant';
import { ottawaClock } from './edition';
import { WALLPAPERS, type Wallpaper } from './wallpaper';

export interface Ctx { cwd: string }
export interface Result { out: string[]; open?: string; theme?: Wallpaper; cwd?: string; clear?: boolean; close?: boolean }

const APPS: Record<string, string> = {
  front: '/', home: '/', projects: '/projects', resume: '/resume', contact: '/contact', now: '/now',
  mikey: '/mikey', ask: '/ask', terminal: '/terminal', 'back-issues': '/back-issues', read: '/read',
};
const LS_HOME = 'projects/  resume  contact  now  mikey  back-issues';
const COMMANDS = ['ask', 'cat', 'cd', 'clear', 'contact', 'date', 'echo', 'exit', 'help', 'ls', 'mikey', 'open', 'sudo', 'theme', 'whoami'];

const HELP = [
  'help              this list',
  'whoami            who William is',
  'ls [projects]     what is here',
  'cd projects       go into the projects folder',
  'open <app|slug>   open a window: projects, resume, contact, now, mikey, back-issues, read',
  'cat resume        the résumé, in plain text',
  'ask <question>    ask Mikey anything about William',
  'theme <name>      wallpaper: sunset, paper or night',
  'contact           how to reach him',
  'date · mikey · clear · exit',
];

const OWL = ['   /\\_/\\', '  ( o o )   hoo.', '  (  ⬡  )', '   ^^ ^^'];

export function runCommand(input: string, ctx: Ctx): Result {
  const line = input.trim();
  if (!line) return { out: [] };
  const [cmd, ...args] = line.split(/\s+/);
  const arg = args.join(' ');
  const inProjects = ctx.cwd === '~/projects';
  switch (cmd.toLowerCase()) {
    case 'help':
      return { out: HELP };
    case 'whoami':
      return { out: [`williamjeet singh — business systems analyst @ the kara consultancy, ${profile.city.toLowerCase()}`, profile.tagline] };
    case 'ls':
      if (arg === 'projects' || (inProjects && !arg)) return { out: [PROJECT_SLUGS.join('  ')] };
      if (!arg || arg === '~') return { out: [LS_HOME] };
      return { out: [`ls: ${arg}: no such directory`] };
    case 'cd':
      if (!arg || arg === '~' || arg === '..' || arg === '/') return { out: [], cwd: '~' };
      if (arg === 'projects' || arg === 'projects/' || arg === '~/projects') return { out: [], cwd: '~/projects' };
      return { out: [`cd: no such directory: ${arg}`] };
    case 'open': {
      if (!arg) return { out: ['open what? try: open projects'] };
      const key = arg.toLowerCase().replace(/\/$/, '');
      if (inProjects && PROJECT_SLUGS.includes(key)) return { out: [`opening ${key}…`], open: `/projects/${key}` };
      if (APPS[key]) return { out: [`opening ${key}…`], open: APPS[key] };
      if (PROJECT_SLUGS.includes(key)) return { out: [`opening ${key}…`], open: `/projects/${key}` };
      return { out: [`open: nothing called ${arg} — try ls`] };
    }
    case 'cat':
      if (arg === 'resume' || arg === 'résumé') {
        return {
          out: [
            `${profile.name} · ${profile.city}, ${profile.region} · ${profile.email}`,
            ...profile.roles.map((r) => `${r.title} — ${r.org}${r.note ? ` (${r.note})` : ''} · ${monthLabel(r.start)}–${monthLabel(r.end)}`),
            ...profile.education.map((e) => `${e.program} — ${e.school} · ${e.year}`),
            'full résumé: open resume',
          ],
        };
      }
      return { out: [arg ? `cat: ${arg}: try open ${arg}` : 'cat what? try: cat resume'] };
    case 'contact':
      return { out: [`email   ${profile.email}`, `linkedin ${profile.links.linkedin}`, `github  ${profile.links.github}`], open: '/contact' };
    case 'ask': {
      if (!arg) return { out: ['ask what? e.g. ask what does he do now'] };
      const r = answer(arg);
      return { out: [`mikey: ${r.text}`], open: r.action?.href };
    }
    case 'theme':
      if ((WALLPAPERS as readonly string[]).includes(arg)) return { out: [`wallpaper: ${arg}`], theme: arg as Wallpaper };
      return { out: ['theme: choose sunset, paper or night'] };
    case 'mikey':
      return { out: [...OWL, FACTS[Math.floor(Math.random() * FACTS.length)]] };
    case 'date':
      return { out: [`${ottawaClock(new Date())} (Ottawa)`] };
    case 'echo':
      return { out: [arg] };
    case 'clear':
      return { out: [], clear: true };
    case 'exit':
      return { out: ['bye.'], close: true };
    case 'sudo':
      return { out: ['nice try. mikey is the only admin here.'] };
    default:
      return { out: [`command not found: ${cmd} — try help`] };
  }
}

const ARGS: Record<string, string[]> = {
  open: [...Object.keys(APPS).filter((k) => k !== 'home'), ...PROJECT_SLUGS],
  cd: ['projects'],
  ls: ['projects'],
  theme: [...WALLPAPERS],
  cat: ['resume'],
};

/** Tab completion: commands, or `cmd arg` pairs. */
export function complete(prefix: string): string[] {
  const m = prefix.match(/^(\S+)\s+(.*)$/);
  if (!m) return COMMANDS.filter((c) => c.startsWith(prefix.toLowerCase()));
  const [, cmd, part] = m;
  return [...new Set(ARGS[cmd] ?? [])].filter((a) => a.startsWith(part)).map((a) => `${cmd} ${a}`);
}
