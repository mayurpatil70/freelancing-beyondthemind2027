import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/storage/store';

export type KeywordSection = 'home' | 'daily' | 'register' | 'sessions' | 'healing' | 'rishikesh';

export function parseKeywords(raw: string | undefined | null): string[] {
  return (raw || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
}

// Adds the admin "Section-Specific Target Meta Keywords" to a page's metadata, and points the
// canonical URL at the page itself (so Google indexes each page instead of folding it into home).
export async function withCmsKeywords(
  base: Metadata,
  section: KeywordSection,
  path?: string
): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = parseKeywords(settings.meta_keywords?.[section]);
  const withCanonical: Metadata = path
    ? { ...base, alternates: { ...base.alternates, canonical: path } }
    : base;
  return keywords.length ? { ...withCanonical, keywords } : withCanonical;
}
