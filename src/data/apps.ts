import type { IconName } from '../components/icons';

export interface App { id: string; label: string; href: string; icon: IconName; }

export const APPS: App[] = [
  { id: 'front', label: 'Front Page', href: '/', icon: 'paper' },
  { id: 'projects', label: 'Projects', href: '/projects', icon: 'folder' },
  { id: 'mikey', label: 'Mikey', href: '/mikey', icon: 'owl' },
  { id: 'resume', label: 'Résumé', href: '/resume', icon: 'resume' },
  { id: 'terminal', label: 'Terminal', href: '/terminal', icon: 'terminal' },
  { id: 'contact', label: 'Contact', href: '/contact', icon: 'mail' },
];

export const FRONT_TITLE = 'Williamjeet Singh — Business Systems Analyst, Ottawa';
export const FRONT_DESCRIPTION =
  'Williamjeet Singh is a Business Systems Analyst in Ottawa who wires ERPNext, Walmart Marketplace and point-of-sale systems together — and builds things that think.';
