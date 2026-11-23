import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CategoryIcon, ExploreLinks, PostCard } from '@/components/blog/BlogParts';
import { BLOG_NAME, loadBlog } from '@/lib/blog';
import { parseKeywords } from '@/lib/seo/keywords';
import { absoluteUrl } from '@/lib/seo/siteUrl';
import { composeDescription, fitTitle, sentences } from '@/lib/seo/meta';

export const revalidate = 300;

type Params = { params: { slug: string } };

async function findCategory(slug: string) {
  const { posts, categories } = await loadBlog();
  const category = categories.find((c) => c.slug === slug);
  return { categories, category, posts: posts.filter((p) => p.category === slug) };
}

export async function generateStaticParams() {
  const { categories } = await loadBlog();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await findCategory(params.slug);
  if (!category) return { title: 'Category Not Found' };
  const path = `/blog/category/${category.slug}`;
  const title = fitTitle(`${category.name} Articles`, [` | ${BLOG_NAME}`, ' | The Divine Retreat']);
  const description = composeDescription([
    ...sentences(category.description),
    [`Articles from ${BLOG_NAME}, the blog of The Divine Retreat.`, `Articles from ${BLOG_NAME}.`, 'From the blog of The Divine Retreat.'],
  ]);
  const keywords = parseKeywords(category.keywords);
  return {
    title: { absolute: title },
    description,
    ...(keywords.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: { title, description, url: absoluteUrl(path), siteName: 'Beyond the Mind', type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function BlogCategoryPage({ params }: Params) {
  const { categories, category, posts } = await findCategory(params.slug);
  if (!category) notFound();
  const url = absoluteUrl(`/blog/category/${category.slug}`);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} | ${BLOG_NAME}`,
      description: category.description,
      url,
      isPartOf: { '@type': 'Blog', name: BLOG_NAME, url: absoluteUrl('/blog') },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: posts.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: absoluteUrl(`/blog/${p.slug}`),
          name: p.title,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: BLOG_NAME, item: absoluteUrl('/blog') },
        { '@type': 'ListItem', position: 3, name: category.name, item: url },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-24">
        <section className="page-header relative py-16 sm:py-24 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest text-stone-subtle/70">
              <Link href="/blog" className="hover:text-gold-300 transition-colors">
                {BLOG_NAME}
              </Link>
              <ChevronRight className="w-3 h-3 opacity-60" />
              <span className="text-gold-300">{category.name}</span>
            </nav>
            <span className="mx-auto w-14 h-14 rounded-full bg-[#031713] border border-gold-500/50 flex items-center justify-center">
              <CategoryIcon name={category.icon_name} className="w-6 h-6 text-gold-300" />
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl text-ivory-50 font-light leading-tight">{category.name}</h1>
            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed">{category.description}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} category={category} headingLevel="h2" />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-stone-subtle/80 py-10">
              Articles in this category are on their way. Explore the{' '}
              <Link href="/blog" className="text-gold-300 underline underline-offset-4">
                latest articles
              </Link>{' '}
              in the meantime.
            </p>
          )}
        </section>

        <nav aria-label="Other categories" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <ul className="flex flex-wrap justify-center gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/blog/category/${c.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/30 text-gold-300 text-[11px] uppercase tracking-widest hover:bg-emerald-900 transition-colors"
                  >
                    <CategoryIcon name={c.icon_name} className="w-3.5 h-3.5" />
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        <div className="mt-24">
          <ExploreLinks />
        </div>
      </main>

      <Footer />
    </div>
  );
}
