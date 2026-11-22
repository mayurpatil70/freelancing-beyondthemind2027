import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ExperiencesDetailList } from '@/components/experiences/ExperiencesDetailList';
import { getExperiences } from '@/lib/storage/store';
import { parseKeywords } from '@/lib/seo/keywords';
import { absoluteUrl } from '@/lib/seo/siteUrl';

// Each of the 7 retreat sessions gets its own indexable URL. The session's admin keywords are used
// only in <meta name="keywords"> and JSON-LD here; they are never rendered on the visible card.

export const revalidate = 300;

type Params = { params: { slug: string } };

async function findSession(slug: string) {
  const experiences = await getExperiences();
  const sorted = [...experiences].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((exp) => exp.slug === slug);
  return { sorted, index, session: index >= 0 ? sorted[index] : undefined };
}

export async function generateStaticParams() {
  const experiences = await getExperiences();
  return experiences.map((exp) => ({ slug: exp.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { session } = await findSession(params.slug);
  if (!session) return { title: 'Retreat Session Not Found' };

  const path = `/experiences/${session.slug}`;
  const description = (session.short_desc || session.full_desc || '').slice(0, 300);
  const title = `${session.title} | Beyond the Mind 2027 Retreat, Rishikesh`;
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
      siteName: 'Beyond the Mind 2027',
      type: 'article',
      images: session.image ? [{ url: session.image, alt: session.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: session.image ? [session.image] : undefined,
    },
  };
}

export default async function RetreatSessionPage({ params }: Params) {
  const { sorted, index, session } = await findSession(params.slug);
  if (!session) notFound();

  const prev = index > 0 ? sorted[index - 1] : undefined;
  const next = index < sorted.length - 1 ? sorted[index + 1] : undefined;
  const url = absoluteUrl(`/experiences/${session.slug}`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: session.title,
      alternateName: session.subtitle,
      description: session.full_desc || session.short_desc,
      keywords: session.keywords || undefined,
      url,
      image: !session.image ? undefined : /^https?:\/\//.test(session.image) ? session.image : absoluteUrl(session.image.startsWith('/') ? session.image : `/${session.image}`),
      inLanguage: ['en', 'ml'],
      provider: { '@type': 'Organization', name: 'Beyond the Mind', url: absoluteUrl('/') },
      hasCourseInstance: {
        '@type': 'CourseInstance',
        courseMode: ['Onsite', 'Online'],
        startDate: '2027-10-06',
        endDate: '2027-10-09',
        location: {
          '@type': 'Place',
          name: 'Rishikesh',
          address: { '@type': 'PostalAddress', addressLocality: 'Rishikesh', addressRegion: 'Uttarakhand', addressCountry: 'IN' },
        },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: 'Retreat Sessions', item: absoluteUrl('/experiences') },
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
            href="/experiences"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Seven Sacred Sessions</span>
          </Link>
        </div>

        <ExperiencesDetailList initialExperiences={[session]} onlySlug={session.slug} />

        <nav
          aria-label="Other retreat sessions"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col sm:flex-row gap-4 sm:justify-between"
        >
          {prev ? (
            <Link
              href={`/experiences/${prev.slug}`}
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
              href={`/experiences/${next.slug}`}
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
