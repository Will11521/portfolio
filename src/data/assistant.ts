import { profile } from './profile';

export interface Intent {
  id: string;
  patterns: RegExp[];
  answer: string;
  action?: { label: string; href: string };
}

export const CHIPS = ['What does he do now?', 'Show me his best project', 'What are you?', 'How do I contact him?'];

export const GREETING = "Hi, I'm Mikey. Ask me about William.";

export const FALLBACK: Intent = {
  id: 'fallback',
  patterns: [],
  answer: "Hoo — I don't know that one. I only know what's on this site: his work, his projects and how to reach him. For anything else, ask William himself.",
  action: { label: 'Contact William', href: '/contact' },
};

/** Ordered: on a tie, the earlier intent wins. Salary, address and immigration deliberately have no intent. */
export const INTENTS: Intent[] = [
  {
    id: 'best-project',
    patterns: [/\bbest project\b/, /\b(show|favou?rite|top|proudest|strongest)\b.*\b(project|work)\b/, /\bcase stud/],
    answer: 'Start with the POS ↔ ERP ↔ Marketplace integration: three systems that never talked, now wired together so nothing gets retyped by hand.',
    action: { label: 'Open the case study', href: '/projects/erp-integration' },
  },
  {
    id: 'now',
    patterns: [/\bwhat does (he|william) do\b/, /\b(current|currently|right now|these days)\b/, /\b(job|title|role|position|employer)\b/, /\bwho is (he|william)\b/, /\bworks? (at|for)\b/],
    answer: `He's a ${profile.title} at ${profile.employer} — ERPNext, a Walmart Marketplace storefront, and the integration that ties them to the point-of-sale. Part-time, he also leads a sales team at WirelessPlus.`,
    action: { label: 'See the résumé', href: '/resume' },
  },
  {
    id: 'availability',
    patterns: [/\bopen to\b/, /\bavailab/, /\bhiring\b/, /\bfreelance\b/, /\bcollaborat/],
    answer: `He's a ${profile.title} at ${profile.employer}, and open to freelance and collaborations.`,
    action: { label: 'Get in touch', href: '/contact' },
  },
  {
    id: 'what-are-you',
    patterns: [/\bwhat are you\b/, /\bwho are you\b/, /\bmikey\b/, /\bowl\b/, /\brobot\b/, /\bdesk pet\b/],
    answer: "I'm Mikey, a little owl. The real me is a desk robot William is building — an ESP32 with a round screen for a face, designed to run on Claude. This version of me lives on his website.",
    action: { label: 'Read how he is building me', href: '/projects/mikey' },
  },
  {
    id: 'contact',
    patterns: [/\bcontact\b/, /\be-?mail\b/, /\breach\b/, /\bhire\b/, /\bget in touch\b/, /\blinkedin\b/, /\bgithub\b/, /\btalk to\b/],
    answer: `Email ${profile.email} — that's the fastest way. He's also on LinkedIn and GitHub.`,
    action: { label: 'Open Contact', href: '/contact' },
  },
  {
    id: 'projects',
    patterns: [/\bprojects?\b/, /\bportfolio\b/, /\bbuilt\b/, /\bbuild\b/],
    answer: 'Three case studies — the POS ↔ ERP ↔ marketplace integration, me (Mikey), and a client website for an Ottawa bakery — plus a few clippings from the archive.',
    action: { label: 'Open Projects', href: '/projects' },
  },
  {
    id: 'resume',
    patterns: [/\br[ée]sum[ée]\b/, /\bcv\b/, /\bexperience\b/, /\bbackground\b/],
    answer: 'His résumé is one window away, and it prints cleanly to PDF.',
    action: { label: 'Open the résumé', href: '/resume' },
  },
  {
    id: 'skills',
    patterns: [/\bskills?\b/, /\bstack\b/, /\btech(nolog(y|ies))?\b/, /\bwhat can (he|william)\b/, /\blanguages?\b/, /\bpython\b/, /\berpnext\b/],
    answer: 'Systems: ERPNext (Frappe), the Walmart Marketplace API, REST integrations and Python automation. Web: TypeScript, Astro, Next.js and React. AI: LLM tooling, retrieval and agent workflows. Analytics: GA4, GTM and Looker Studio.',
    action: { label: 'See the résumé', href: '/resume' },
  },
  {
    id: 'education',
    patterns: [/\b(school|college|study|studied|education|degree|graduat\w*|algonquin)\b/],
    answer: 'He graduated in Interactive Media Design from Algonquin College in 2026.',
    action: { label: 'See the résumé', href: '/resume' },
  },
  {
    id: 'location',
    patterns: [/\bwhere\b.*\b(based|from)\b/, /\bottawa\b/, /\blocation\b/, /\btime ?zone\b/],
    answer: 'He works from Ottawa, Canada — Eastern Time.',
    action: { label: 'Open Contact', href: '/contact' },
  },
  {
    id: 'agents',
    patterns: [/\bagents?\b/, /\bagentauth\b/, /\bprompt\b/],
    answer: 'His take on AI agents: a prompt is a suggestion, not a constraint — spend limits and permissions belong in infrastructure, not in the prompt.',
    action: { label: 'Read the clipping', href: '/projects/agentauth' },
  },
  {
    id: 'site',
    patterns: [/\b(this|the) (site|website)\b/, /\bwilliamos\b/, /\bwallpaper\b/],
    answer: "This is WilliamOS. Every window is also a real page, so it works without JavaScript too. Try the wallpaper dots in the top-right corner, or open the Terminal and type help.",
    action: { label: 'Open the Terminal', href: '/terminal' },
  },
  {
    id: 'greeting',
    patterns: [/^(hi|hello|hey|yo|hiya)\b/],
    answer: 'Hoo! Ask me what William does, his best project, or how to reach him.',
  },
];

export const FACTS = [
  "I'm the small version. The real Mikey is a robot owl William is building, with a round screen for a face.",
  'My robot body was designed in Python and passes 75 automated checks.',
  'This whole site works without JavaScript. I just stop blinking.',
  'Try the Night wallpaper — top right. I glow copper in the dark.',
  "William's line is 'I build things that think.' I'm one of them.",
];
