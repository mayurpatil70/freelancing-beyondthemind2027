import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/storage/store';

export type KeywordSection = 'home' | 'daily' | 'register' | 'sessions' | 'rishikesh';

// Adds the admin "Section-Specific Target Meta Keywords" to a page's metadata.
export async function withCmsKeywords(base: Metadata, section: KeywordSection): Promise<Metadata> {
  const settings = await getSiteSettings();
  const keywords = (settings.meta_keywords?.[section] || '')
    .split(',')
    .map((k) => k.trim())
    .filter(Boolean);
  return keywords.length ? { ...base, keywords } : base;
}
