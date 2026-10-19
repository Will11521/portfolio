export interface Role {
  title: string;
  org: string;
  start: string; // YYYY-MM
  end: string | 'present';
  note?: string;
  bullets: string[];
}

export interface Edu { program: string; school: string; year: number; note?: string }

export const profile = {
  name: 'Williamjeet Singh',
  shortName: 'William',
  tagline: 'I build things that think.',
  title: 'Business Systems Analyst',
  employer: 'The Kara Consultancy',
  since: '2026-09',
  city: 'Ottawa',
  region: 'ON',
  email: 'williamjeetsingh2004@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/williamjeetsingh2004/',
    site: 'https://williamdev.is-a.dev',
  },
  availability: 'Open to freelance and collaborations.',
  summary:
    'Business Systems Analyst in Ottawa. I run ERPNext and a Walmart Marketplace storefront for a North American tire distributor, and wire the point-of-sale, the ERP and the marketplace together so nothing gets retyped by hand. After hours I build things that think — right now Mikey, a desk-pet owl robot I am building around Claude.',
  roles: [
    {
      title: 'Business Systems Analyst',
      org: 'The Kara Consultancy',
      start: '2026-09',
      end: 'present',
      bullets: [
        'ERPNext administration and Walmart Marketplace operations for a North American tire distributor, plus the integration between them and the point-of-sale.',
        'Administer ERPNext (Frappe): item master, purchasing, sales orders, stock.',
        'Run the Walmart Marketplace catalogue: listing quality, GTIN/UPC accuracy, repricing floors, inventory feeds, order and return exceptions.',
        "Build and maintain the POS ↔ ERP ↔ marketplace integration so orders, inventory and tracking aren't retyped by hand.",
        'Work against the Walmart Marketplace API and automate reconciliation that used to be manual.',
        'Produce the margin, freight and fee analysis behind pricing decisions.',
      ],
    },
    {
      title: 'Manager of Sales',
      org: 'WirelessPlus',
      start: '2025-09',
      end: 'present',
      note: 'part-time',
      bullets: [
        'Lead a team of wireless sales associates in a high-volume retail store.',
        'Diagnose and repair smartphones: screens, batteries, charging ports and other hardware.',
        'Configure devices, transfer data, and troubleshoot software and connectivity problems.',
        'Manage transactions, inventory and customer service in a fast-paced environment.',
      ],
    },
    {
      title: 'Artificial Intelligence Intern',
      org: 'Square Root Technologies Inc.',
      start: '2025-03',
      end: '2025-05',
      bullets: [
        'Helped build an AI-driven business-intelligence tool for small merchants.',
        'Created front-end UI prototypes and interactive dashboards for internal analytics.',
        'Assisted with insight automation, sales-pattern recognition and emotion analysis using Python, Flask and TextBlob.',
      ],
    },
    {
      title: 'Shift Lead',
      org: 'Booster Juice',
      start: '2024-03',
      end: '2025-12',
      bullets: ['Led a team of up to 6 staff during peak operations.', 'Kept communication clear and resolved issues quickly to keep service moving.'],
    },
    {
      title: 'Social Media Manager',
      org: 'Brazily Fitness Inc.',
      start: '2024-03',
      end: '2024-06',
      note: 'internship',
      bullets: ['Planned and scheduled Instagram and Facebook content in Canva.', 'Themed campaigns lifted engagement by 30%.'],
    },
  ] satisfies Role[],
  education: [{ program: 'Interactive Media Design', school: 'Algonquin College', year: 2026, note: 'Graduated' }] satisfies Edu[],
  skills: {
    Systems: ['ERPNext (Frappe)', 'Walmart Marketplace API', 'REST integrations', 'Python automation', 'SQL', 'GTIN/UPC data quality'],
    Web: ['TypeScript', 'Astro', 'Next.js', 'React', 'HTML & CSS', 'Accessibility'],
    AI: ['LLM tooling', 'Retrieval (RAG)', 'Claude API', 'Agent workflows'],
    Analytics: ['GA4', 'Google Tag Manager', 'Looker Studio'],
    Design: ['UX research', 'Figma', 'Visual identity'],
    Hardware: ['ESP32-S3', 'Code-based CAD (Python)', '3D printing'],
  },
  letters: [
    { quote: 'Working with William was smooth from start to finish. Clear communication and a design that nailed exactly what I envisioned.', source: 'Client, portfolio website' },
    { quote: 'He interpreted my designs perfectly for a professional set of webpages. Truly great work and a pleasure to work with.', source: 'Client, web project' },
    { quote: 'William delivered a simple, clean design that completely met my requirements. The final version was exactly what I expected.', source: 'Client, personal website' },
  ],
};

export type Profile = typeof profile;

/** "2026-09" → "Sep 2026"; "present" → "Present". */
export function monthLabel(ym: string): string {
  if (ym === 'present') return 'Present';
  const [y, m] = ym.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleString('en-CA', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}
