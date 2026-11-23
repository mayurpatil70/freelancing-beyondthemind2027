import type { BlogPost } from '@/types';
import { getBlogPosts } from '@/lib/storage/store';
import { absoluteUrl } from '@/lib/seo/siteUrl';

export const BLOG_NAME = 'Wisdom Beyond the Mind';
export const BLOG_TAGLINE = 'Explore the Journey Within.';
export const BLOG_DESCRIPTION =
  'Insights on meditation, spirituality, consciousness, healing and inner transformation from Beyond the Mind, The Divine Retreat in Rishikesh.';

const dateValue = (p: BlogPost) => Date.parse(p.published_at || '') || 0;

/** Published articles, newest first. Drafts are never shown on the site. */
export function publishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p.published && p.slug)
    .sort((a, b) => dateValue(b.p) - dateValue(a.p) || a.i - b.i)
    .map(({ p }) => p);
}

export async function loadBlog() {
  const posts = await getBlogPosts();
  return { posts: publishedPosts(posts || []) };
}

export function readingMinutes(content: string): number {
  const words = (content || '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatBlogDate(date: string | undefined): string {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function imageUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  return absoluteUrl(src.startsWith('/') ? src : `/${src}`);
}

/** Plain text of the article body, without the formatting marks. */
export function plainText(content: string): string {
  return (content || '')
    .replace(/^#{2,3}\s+/gm, '')
    .replace(/^[->]\s+/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}
