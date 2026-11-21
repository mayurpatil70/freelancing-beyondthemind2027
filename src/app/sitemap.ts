import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const baseUrl =
    envUrl && !envUrl.includes('localhost') && !envUrl.includes('beyondthemindretreat.org')
      ? envUrl.replace(/\/$/, '')
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://beyondthemind2027.vercel.app';

  const routeConfig: Array<{ path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/register', priority: 0.95, changeFrequency: 'daily' },
    { path: '/daily-meditation', priority: 0.95, changeFrequency: 'daily' },
    { path: '/programme', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/experiences', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/rishikesh', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/participation', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/testimonials', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/faq', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/reach', priority: 0.75, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'monthly' },
  ];

  return routeConfig.map((item) => ({
    url: `${baseUrl}${item.path}`,
    lastModified: new Date(),
    changeFrequency: item.changeFrequency,
    priority: item.priority,
  }));
}
