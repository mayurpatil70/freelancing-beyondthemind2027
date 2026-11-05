import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://beyondthemindretreat.org';

  const routes = [
    '',
    '/about',
    '/experiences',
    '/daily-meditation',
    '/programme',
    '/rishikesh',
    '/reach',
    '/participation',
    '/testimonials',
    '/gallery',
    '/faq',
    '/register',
    '/contact',
    '/privacy-policy',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route === '/register' ? 0.9 : 0.8,
  }));
}

