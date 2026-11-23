import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HealingSessionsList } from '@/components/healing/HealingSessionsList';
import { getHealingSessions, getSiteSettings } from '@/lib/storage/store';
import { parseKeywords } from '@/lib/seo/keywords';
import { composeDescription, fitTitle, sentences, titleCase } from '@/lib/seo/meta';
import { absoluteUrl } from '@/lib/seo/siteUrl';

// Each healing session gets its own indexable URL. Its admin keywords are used only in
// <meta name="keywords"> and JSON-LD here; they are never shown on the page.

export const revalidate = 300;

type Params = { params: { slug: string } };

async function findSession(slug: string) {
  const sessions = await getHealingSessions();
  const sorted = [...sessions].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((s) => s.slug === slug);
  return { sorted, index, session: index >= 0 ? sorted[index] : undefined };
}

export async function generateStaticParams() {
  const sessions = await getHealingSessions();
  return sessions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { session } = await findSession(params.slug);
  if (!session) return { title: 'Healing Session Not Found' };

  const path = `/healing-sessions/${session.slug}`;
  const name = titleCase(session.title);
  const description = composeDescription([
    session.short_desc || session.subtitle,
    [
      'A one-to-one healing session by prior appointment with The Divine Retreat.',
      'A one-to-one healing session, by prior appointment.',
      'One-to-one, by appointment.',
    ],
    ...sentences(session.full_desc),
  ]);
  const title = fitTitle(name, [' | Healing Session · The Divine Retreat', ' | One-to-One Healing Session', ' | Healing Session']);
  const keywords = parseKeywords(session.keywords);

  return {
    title: { absolute: title },
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: 'Beyond the Mind',
      type: 'article',
      images: session.image ? [{ url: session.image, alt: name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: session.image ? [session.image] : undefined,
    },
  };
}

export default async function HealingSessionPage({ params }: Params) {
  const { sorted, index, session } = await findSession(params.slug);
  if (!session) notFound();
  const settings = await getSiteSettings();

  const prev = index > 0 ? sorted[index - 1] : undefined;
  const next = index < sorted.length - 1 ? sorted[index + 1] : undefined;
  const url = absoluteUrl(`/healing-sessions/${session.slug}`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: session.title,
      alternateName: session.spiritual_dimension || undefined,
      description: session.full_desc || session.short_desc,
      keywords: session.keywords || undefined,
      url,
      image: !session.image
        ? undefined
        : /^https?:\/\//.test(session.image)
          ? session.image
          : absoluteUrl(session.image.startsWith('/') ? session.image : `/${session.image}`),
      serviceType: 'Healing session',
      provider: { '@type': 'Organization', name: 'Beyond the Mind', url: absoluteUrl('/') },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Transformative Healing Sessions', item: absoluteUrl('/healing-sessions') },
        { '@type': 'ListItem', position: 3, name: session.title, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <Link
            href="/healing-sessions"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Transformative Healing Sessions</span>
          </Link>
        </div>

        <HealingSessionsList sessions={[session]} whatsappNumber={settings.whatsapp_number} single />

        <nav
          aria-label="Other healing sessions"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col sm:flex-row gap-4 sm:justify-between"
        >
          {prev ? (
            <Link
              href={`/healing-sessions/${prev.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-950 text-gold-300 border border-gold-500/30 text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all min-w-0"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/healing-sessions/${next.slug}`}
              className="inline-flex items-center justify-end gap-2 px-6 py-3 rounded-full bg-emerald-950 text-gold-300 border border-gold-500/30 text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all min-w-0"
            >
              <span className="truncate">{next.title}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          )}
        </nav>
      </main>

      <Footer />
    </div>
  );
}
