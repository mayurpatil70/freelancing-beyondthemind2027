import React from "react";
import type { Metadata } from "next";
import { withCmsKeywords } from '@/lib/seo/keywords';
import { absoluteUrl } from '@/lib/seo/siteUrl';
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getExperiences, getAttractions } from "@/lib/storage/store";
import {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Languages,
  Video,
  MapPin,
} from "lucide-react";
import { AttractionsGrid } from "@/components/rishikesh/AttractionsGrid";
import { ExperiencesDetailList } from "@/components/experiences/ExperiencesDetailList";

const baseMetadata: Metadata = {
  title: { absolute: '8 Retreat Sessions in Rishikesh | Beyond the Mind 2027' },
  description:
    'Explore the eight sessions of Beyond the Mind 2027, from Stress Buster and Soul Retrieval to Kundalini Awakening and Merkaba Activation, in Rishikesh.',
};

export function generateMetadata(): Promise<Metadata> {
  return withCmsKeywords(baseMetadata, 'sessions', '/experiences');
}

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
};

export const revalidate = 300;

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  const attractions = await getAttractions();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Beyond the Mind 2027 Sacred Retreat Sessions',
    description: 'Eight transformative sacred meditation & healing sessions in Rishikesh, India.',
    itemListElement: experiences.map((exp, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Course',
        name: exp.title,
        description: exp.short_desc || exp.full_desc,
        keywords: exp.keywords || undefined,
        url: absoluteUrl(`/experiences/${exp.slug}`),
        provider: { '@type': 'Organization', name: 'Beyond the Mind', url: absoluteUrl('/') },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Banner */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              The Sacred Retreat Sessions
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Eight Sacred Sessions
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              A comprehensive energetic progression designed to release stress, awaken dormant prana,
              restore wholeness, and merge with transcendental stillness beside holy Mother Ganga.
            </p>

            {/* Retreat Details Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gold-300 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Arrival: Oct 5 • Sessions: Oct 6–9, 2027</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Video className="w-3.5 h-3.5 text-gold-400" />
                <span>Modes: Offline (Rishikesh) & Online Live</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>English & Malayalam (Hindi translation upon request)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Responsible Stewardship Note */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-gold-500/25 flex items-start gap-3 text-xs text-stone-subtle/85 font-light leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-gold-300 font-medium">
                Sacred Ethics & Guidance:
              </strong>{" "}
              These sessions are offered as experiential contemplative and energetic practices for inner stillness, self-awareness, and spiritual growth. Guided under the reverence of Pradeep Muthukulam.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RETREAT SESSIONS CARDS (Screenshot 1 Order) */}
        {/* ========================================================================= */}
        <section className="py-6 pb-20 space-y-16">
          <ExperiencesDetailList initialExperiences={experiences} />
        </section>

        {/* ========================================================================= */}
        {/* RISHIKESH ATTRACTIONS & ADVENTURES (Added where session cards are) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#02100d] border-t border-gold-500/20 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AttractionsGrid
              attractions={attractions}
              title="Rishikesh Attractions & Things to Do"
              subtitle="Complement your retreat experience with Rishikesh's legendary activities — from India's highest bungee jumping and thrilling river rafting to sacred evening Ganga Aarti and silent meditation caves."
            />
          </div>
        </section>

        {/* Bottom Conversion Box */}
        <section className="py-20 bg-[#031713] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 space-y-6 shadow-2xl">
              <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
                Ready to Experience These Eight Dimensions?
              </h3>
              <p className="text-sm text-stone-subtle/85 font-light max-w-xl mx-auto leading-relaxed">
                Join our intimate gathering in Rishikesh. Arrival on October 5, 2027, with sessions running October 6–9, 2027. Available both in-person and online live stream.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/register"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
                >
                  <span>Reserve Your Sanctuary Place</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/daily-meditation"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-950 text-gold-300 border border-gold-500/30 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
                >
                  <span>Explore Daily Meditation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
