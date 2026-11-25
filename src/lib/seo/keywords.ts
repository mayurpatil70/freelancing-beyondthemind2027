import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/storage/store';

export type KeywordSection =
  | 'home'
  | 'daily'
  | 'register'
  | 'sessions'
  | 'healing'
  | 'blog'
  | 'rishikesh'
  | 'participation'
  | 'testimonials'
  | 'faq';

export function parseKeywords(raw: string | undefined | null): string[] {
  return (raw || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}

// Joins several comma-separated keyword strings into one de-duplicated list (case-insensitive).
export function mergeKeywords(...sources: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of sources.flatMap(parseKeywords)) {
    const key = k.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(k);
  }
  return out;
}

// Adds the admin "Section-Specific Target Meta Keywords" to a page's metadata, and points the
// canonical URL at the page itself (so Google indexes each page instead of folding it into home).
// `extra` holds per-item keywords (e.g. each FAQ's keywords); they are only ever used in meta tags.
export async function withCmsKeywords(
  base: Metadata,
  section: KeywordSection,
  path?: string,
  extra: Array<string | undefined | null> = []
): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = mergeKeywords(settings.meta_keywords?.[section], ...extra);
  const withCanonical: Metadata = path
    ? { ...base, alternates: { ...base.alternates, canonical: path } }
    : base;
  return keywords.length ? { ...withCanonical, keywords } : withCanonical;
}
