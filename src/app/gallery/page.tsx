import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { getGallery } from '@/lib/storage/store';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Visual Sanctuary Gallery | Beyond the Mind 2027',
  description:
    'Immerse in the visual moments, official posters, Himalayan landscapes, and community gatherings of Beyond the Mind.',
};

export default async function GalleryPage() {
  const galleryItems = await getGallery();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Sanctuary Visuals
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Visual Sanctuary Gallery
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Moments of prayer, silent reflection, mountain serenity, and the official archival posters of Beyond the Mind.
            </p>
          </div>
        </section>

        {/* Gallery Grid with Category Filter & Lightbox */}
        <section className="py-12 pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <GalleryGrid items={galleryItems} />

          {/* Bottom CTA */}
          <div className="text-center pt-8 border-t border-gold-500/20">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
            >
              <span>Join Us at Beyond the Mind 2027</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

