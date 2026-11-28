import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getGallery } from '@/lib/storage/store';
import { withCmsKeywords } from '@/lib/seo/keywords';
import { siteUrl } from '@/lib/seo/siteUrl';
import { stripRichText } from '@/lib/richText';

const baseMetadata: Metadata = {
  title: 'Photo Gallery from Rishikesh',
  description:
    'Photos from Beyond the Mind: retreat sessions, meditation, participants, the Himalayas and the sacred Ganga in Rishikesh.',
};

export async function generateMetadata(): Promise<Metadata> {
  return withCmsKeywords(baseMetadata, 'gallery', '/gallery');
}

export const revalidate = 300;

export default async function GalleryPage() {
  const gallery = await getGallery();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    '@id': `${siteUrl}/gallery#page`,
    url: `${siteUrl}/gallery`,
    name: 'Beyond the Mind Gallery',
    about: { '@id': `${siteUrl}/#retreat2027` },
    isPartOf: { '@id': `${siteUrl}/#website` },
    image: gallery
      .filter((g) => g.media_type !== 'video')
      .slice(0, 30)
      .map((g) => ({
        '@type': 'ImageObject',
        contentUrl: g.image_url.startsWith('http') ? g.image_url : `${siteUrl}${g.image_url}`,
        name: g.title,
        ...(g.caption ? { caption: stripRichText(g.caption) } : {}),
      })),
  };

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-24 sm:pt-28">
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Moments from the Journey
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">Gallery</h1>
            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Glimpses of the Divine Retreat: sacred sessions, silent meditation, the seekers who walk this path, and
              the Himalayan stillness of Rishikesh.
            </p>
          </div>
        </section>

        <section className="py-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {gallery.length > 0 ? (
            <GalleryGrid items={gallery} />
          ) : (
            <p className="text-center text-sm text-stone-subtle/70 py-16">New photos will be shared here soon.</p>
          )}

          <div className="text-center pt-4">
            <Link
              href="/register"
              prefetch={true}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
            >
              <span>Begin Your Own Journey in Rishikesh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
