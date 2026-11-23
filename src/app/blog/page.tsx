import React from 'react';
import type { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  ExploreLinks,
  FeaturedPostCard,
  PopularPostRow,
  PostCard,
} from '@/components/blog/BlogParts';
import { BLOG_DESCRIPTION, BLOG_NAME, BLOG_TAGLINE, imageUrl, loadBlog } from '@/lib/blog';
import { withCmsKeywords } from '@/lib/seo/keywords';
import { absoluteUrl } from '@/lib/seo/siteUrl';

const title = `${BLOG_NAME} | Meditation & Healing Blog`;

const baseMetadata: Metadata = {
  title: { absolute: title },
  description: BLOG_DESCRIPTION,
  openGraph: {
    title,
    description: BLOG_DESCRIPTION,
    url: absoluteUrl('/blog'),
    siteName: 'Beyond the Mind',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title, description: BLOG_DESCRIPTION },
};

export function generateMetadata(): Promise<Metadata> {
  return withCmsKeywords(baseMetadata, 'blog', '/blog');
}

export const revalidate = 300;

export default async function BlogHomePage() {
  const { posts } = await loadBlog();

  const featured = posts.find((p) => p.featured) || posts[0];
  const latest = posts.filter((p) => p !== featured).slice(0, 6);
  const popular = posts.filter((p) => p.popular).slice(0, 6);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: BLOG_NAME,
      alternateName: BLOG_TAGLINE,
      description: BLOG_DESCRIPTION,
      url: absoluteUrl('/blog'),
      inLanguage: 'en',
      publisher: {
        '@type': 'Organization',
        name: 'Beyond the Mind',
        url: absoluteUrl('/'),
        logo: { '@type': 'ImageObject', url: absoluteUrl('/images/brand/logo-gold.jpg') },
      },
      blogPost: posts.slice(0, 20).map((p) => ({
        '@type': 'BlogPosting',
        headline: p.title,
        description: p.excerpt,
        url: absoluteUrl(`/blog/${p.slug}`),
        datePublished: p.published_at,
        dateModified: p.updated_at || p.published_at,
        image: imageUrl(p.image),
        author: { '@type': 'Organization', name: p.author || 'Beyond the Mind' },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: BLOG_NAME, item: absoluteUrl('/blog') },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              Blog &amp; Journal
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">{BLOG_NAME}</h1>
            <p className="font-serif text-2xl sm:text-3xl text-gold-300 font-light italic">{BLOG_TAGLINE}</p>
            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Insights on meditation, spirituality, consciousness, healing and inner transformation, to support you
              wherever you are on the path.
            </p>
          </div>
        </section>

        {posts.length === 0 && (
          <p className="text-center text-sm text-stone-subtle/80 py-16 px-4">New articles are on their way. Please check back soon.</p>
        )}

        {/* Featured */}
        {featured && (
          <section aria-label="Featured article" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
            <FeaturedPostCard post={featured} />
          </section>
        )}

        {/* Latest */}
        {latest.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
            <SectionHeading eyebrow="Fresh Insights" title="Latest Articles" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}

        {/* Popular */}
        {popular.length > 0 && (
          <section className="py-24 bg-[#02100d] border-y border-gold-500/20 mb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading eyebrow="Most Read" title="Popular Articles" />
              <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popular.map((p, i) => (
                  <li key={p.id}>
                    <PopularPostRow post={p} rank={i + 1} />
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        <div className="pb-24">
          <ExploreLinks />
        </div>
      </main>

      <Footer />
    </div>
  );
}
