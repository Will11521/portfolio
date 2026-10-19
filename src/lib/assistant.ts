import { INTENTS, FALLBACK, type Intent } from '../data/assistant';

export interface Reply { id: string; text: string; action?: { label: string; href: string } }

const normalise = (q: string) => q.toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

/** Scripted answer: the intent with the most pattern hits wins; ties go to the earlier intent; no hit → fallback. */
export function answer(q: string, intents: Intent[] = INTENTS): Reply {
  const text = normalise(q);
  let best: Intent | null = null;
  let bestScore = 0;
  for (const intent of intents) {
    const score = intent.patterns.reduce((n, p) => n + (p.test(text) ? 1 : 0), 0);
    if (score > bestScore) { best = intent; bestScore = score; }
  }
  const hit = best ?? FALLBACK;
  return { id: hit.id, text: hit.answer, action: hit.action };
}
