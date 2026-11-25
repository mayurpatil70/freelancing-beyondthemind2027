import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Video,
  Languages,
} from 'lucide-react';
import { LanguageNote } from '@/components/retreat/LanguageNote';
import { getParticipation, getSiteSettings } from '@/lib/storage/store';
import { mergeKeywords, withCmsKeywords } from '@/lib/seo/keywords';
import { formatInr, parsePrice } from '@/lib/seo/eventSchema';
import { siteUrl } from '@/lib/seo/siteUrl';

const baseMetadata: Metadata = {
  title: 'Participation & Accommodation Options',
  description:
    'Participation options for Beyond the Mind 2027 in Rishikesh, including private and twin-sharing rooms, sattvic vegetarian meals and retreat materials.',
};

// Section keywords (admin Participation tab) plus each option's keywords: meta tags and JSON-LD only.
export async function generateMetadata(): Promise<Metadata> {
  const tiers = await getParticipation();
  return withCmsKeywords(baseMetadata, 'participation', '/participation', tiers.map((t) => t.keywords));
}

export const revalidate = 300;

export default async function ParticipationPage() {
  const [participationTiers, settings] = await Promise.all([getParticipation(), getSiteSettings()]);
  const keywords = mergeKeywords(settings.meta_keywords?.participation, ...participationTiers.map((t) => t.keywords));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/participation#page`,
    url: `${siteUrl}/participation`,
    name: 'Participation & Accommodations',
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
    about: { '@id': `${siteUrl}/#retreat2027` },
    isPartOf: { '@id': `${siteUrl}/#website` },
  };

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Retreat Inclusions & Participation Modes
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Participation & Accommodations
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Thoughtfully curated participation options to support peaceful contemplation, sacred rest, and
              wholesome nourishment. Available both offline in Rishikesh (Arrival Oct 5) and online via live stream.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gold-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Arrival: Oct 5 • Sessions: Oct 6–9</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Video className="w-3.5 h-3.5 text-gold-400" />
                <span>Offline (Rishikesh) & Online Stream</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>English & Malayalam (Hindi translation upon request)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Advisory / Inclusions Integrity Note */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-gold-500/25 flex items-start gap-3 text-xs text-stone-subtle/85 font-light leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-gold-300 font-medium">Transparent Booking Guidance:</strong> Exact fees,
              room categories, and tier availability are confirmed directly through our retreat concierge upon
              reviewing your enquiry form. We intentionally do not advertise speculative luxury ratings; our priority
              is authentic spiritual guidance, cleanliness, serenity, and wholesome sattvic nourishment.
            </p>
          </div>
        </div>

        {/* Accommodation & Attendance Tiers */}
        <div className="pb-10">
          <LanguageNote />
        </div>

        <section className="py-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {participationTiers.map((tier, idx) => {
              const price = parsePrice(tier.price);
              return (
              <div
                key={tier.id || idx}
                className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 flex flex-col justify-between shadow-xl space-y-6 hover:border-gold-400/50 transition-colors"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                    {tier.subtitle}
                  </span>
                  <h2 className="font-serif text-2xl text-ivory-50 font-medium">{tier.title}</h2>
                  {price !== undefined && (
                    <p className="font-serif text-xl text-gold-300">{formatInr(price)}</p>
                  )}
                  <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-emerald-800/50">
                    <span className="text-xs uppercase tracking-wider text-gold-300 font-semibold block">
                      Included In Sanctuary:
                    </span>
                    {(tier.inclusions || []).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-ivory-100 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-500/15 space-y-3">
                  <span className="text-[11px] text-gold-300/80 block font-medium">
                    {tier.status_note}
                  </span>
                  <Link
                    href={`/register?programme=${encodeURIComponent(tier.title)}`}
                    prefetch={true}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-wider uppercase text-center block hover:scale-102 transition-all shadow-sm"
                  >
                    Enquire
                  </Link>
                </div>
              </div>
              );
            })}
          </div>


        </section>
      </main>

      <Footer />
    </div>
  );
}

