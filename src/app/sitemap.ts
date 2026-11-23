import { MetadataRoute } from 'next';
import { siteUrl as baseUrl } from '@/lib/seo/siteUrl';
import { getExperiences, getHealingSessions } from '@/lib/storage/store';
import { loadBlog } from '@/lib/blog';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routeConfig: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/register', priority: 0.95, changeFrequency: 'daily' },
    { path: '/daily-meditation', priority: 0.95, changeFrequency: 'daily' },
    { path: '/programme', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/experiences', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/healing-sessions', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.9, changeFrequency: 'daily' },
    { path: '/rishikesh', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/participation', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/testimonials', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/faq', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/reach', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'monthly' },
  ];

  // One URL per retreat session, so a search for that session's keywords lands on its own card.
  let sessionRoutes: typeof routeConfig = [];
  try {
    const experiences = await getExperiences();
    sessionRoutes = experiences.map((exp) => ({
      path: `/experiences/${exp.slug}`,
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    }));
  } catch (err) {
    console.warn('Sitemap: could not load retreat sessions', err);
  }

  let healingRoutes: typeof routeConfig = [];
  try {
    const healingSessions = await getHealingSessions();
    healingRoutes = healingSessions.map((s) => ({
      path: `/healing-sessions/${s.slug}`,
      priority: 0.85,
      changeFrequency: 'weekly' as const,
    }));
  } catch (err) {
    console.warn('Sitemap: could not load healing sessions', err);
  }

  let blogRoutes: Array<(typeof routeConfig)[number] & { lastModified?: string }> = [];
  try {
    const { posts, categories } = await loadBlog();
    blogRoutes = [
      ...categories.map((c) => ({ path: `/blog/category/${c.slug}`, priority: 0.7, changeFrequency: 'weekly' as const })),
      ...posts.map((p) => ({
        path: `/blog/${p.slug}`,
        priority: 0.8,
        changeFrequency: 'monthly' as const,
        lastModified: p.updated_at || p.published_at,
      })),
    ];
  } catch (err) {
    console.warn('Sitemap: could not load blog', err);
  }

  const routes: Array<(typeof blogRoutes)[number]> = [...routeConfig, ...sessionRoutes, ...healingRoutes, ...blogRoutes];
  return routes.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: (item.lastModified && !Number.isNaN(Date.parse(item.lastModified)) ? new Date(item.lastModified) : new Date()),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
