import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, User, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HealingSessionsList } from '@/components/healing/HealingSessionsList';
import { getHealingSessions, getSiteSettings } from '@/lib/storage/store';
import { withCmsKeywords } from '@/lib/seo/keywords';
import { absoluteUrl } from '@/lib/seo/siteUrl';
import { formatWhatsAppUrl } from '@/lib/utils';

const baseMetadata: Metadata = {
  title: 'Personalised Healing Sessions',
  description:
    'Explore one-to-one healing sessions for emotional release, relationships, abundance, conscious business and personal transformation, by appointment.',
};

export function generateMetadata(): Promise<Metadata> {
  return withCmsKeywords(baseMetadata, 'healing', '/healing-sessions');
}

export const revalidate = 300;

export default async function HealingSessionsPage() {
  const [sessions, settings] = await Promise.all([getHealingSessions(), getSiteSettings()]);
  const sorted = [...sessions].sort((a, b) => a.order - b.order);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Transformative Healing Sessions',
    description:
      'A collection of specialised healing sessions designed to support inner balance, emotional release and profound personal transformation.',
    itemListElement: sorted.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Service',
        name: s.title,
        description: s.short_desc || s.subtitle,
        keywords: s.keywords || undefined,
        url: absoluteUrl(`/healing-sessions/${s.slug}`),
      },
    })),
  };

  const generalEnquiry = formatWhatsAppUrl(
    settings.whatsapp_number || '+91 8075572018',
    'Namaste, I would like to know more about the Transformative Healing Sessions and book an appointment.'
  );

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header banner */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Specialised Healing
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Transformative Healing Sessions
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              A collection of specialised healing sessions designed to support inner balance, emotional release and
              profound personal transformation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gold-300 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>Individually conducted</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>Paid sessions</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>By prior appointment only</span>
              </span>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="p-6 sm:p-10 rounded-3xl bg-emerald-950/60 border border-gold-500/25 space-y-4 text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
            <p>
              Every aspect of life carries its own experiences, patterns and possibilities for transformation. Our
              specialised healing sessions offer a deeper journey into these dimensions, helping you explore limiting
              beliefs, release emotional burdens and rediscover a greater sense of inner harmony.
            </p>
            <p>
              From Money &amp; Abundance Healing, opening new perspectives around prosperity and receiving, and
              Relationship Healing, exploring emotional patterns and nurturing deeper connections, to Emotional Detox,
              releasing accumulated emotional weight, and transformative Body Processes, reconnecting with the
              body&apos;s natural intelligence — each experience offers a unique opportunity for inner exploration and
              transformation.
            </p>
            <p className="text-gold-300 font-normal">
              All sessions are individually conducted, available on a paid basis and exclusively by prior appointment.
            </p>
          </div>
        </section>

        {/* Session index */}
        {sorted.length > 0 && (
          <nav aria-label="Healing sessions" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sorted.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.slug}`}
                    className="flex items-center gap-3 h-full px-4 py-3 rounded-2xl bg-[#07261F]/70 border border-gold-500/25 hover:border-gold-400/60 transition-colors"
                  >
                    <span className="w-9 h-9 shrink-0 rounded-full bg-[#031713] border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold">
                      {String(s.order).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] uppercase tracking-widest text-gold-400">
                        Session {s.order}
                      </span>
                      <span className="block font-serif text-lg text-ivory-50 leading-tight">{s.title}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Session cards */}
        <section className="py-6 pb-20">
          <HealingSessionsList sessions={sorted} whatsappNumber={settings.whatsapp_number} />
        </section>

        {/* Bottom call to action */}
        <section className="py-20 bg-[#031713] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 space-y-6 shadow-2xl">
              <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
                Begin Your Healing Journey
              </h3>
              <p className="text-sm sm:text-base text-stone-subtle/85 font-light max-w-xl mx-auto leading-relaxed">
                All sessions are individually conducted, available on a paid basis and exclusively by prior
                appointment. Reach out to choose a session and a time that suits you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a
                  href={generalEnquiry}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
                >
                  <span>Book an Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  href="/experiences"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-950 text-gold-300 border border-gold-500/30 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
                >
                  <span>Eight Retreat Sessions</span>
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
