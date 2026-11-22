// Public base URL of the site, used for canonical links, sitemap entries and structured data.
export const siteUrl = (() => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('beyondthemindretreat.org')) {
    return envUrl.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://beyondthemind2027.vercel.app';
})();

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path === '/' ? '' : path}`;
}
