import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArticleBody } from '@/components/blog/ArticleBody';
import { CategoryPill, ExploreLinks, PostCard, PostMeta } from '@/components/blog/BlogParts';
import { BLOG_NAME, formatBlogDate, imageUrl, loadBlog, plainText, readingMinutes } from '@/lib/blog';
import { parseKeywords } from '@/lib/seo/keywords';
import { absoluteUrl } from '@/lib/seo/siteUrl';

// One indexable page per article. The article's admin keywords are used only in meta tags and JSON-LD.

export const revalidate = 300;

type Params = { params: { slug: string } };

async function findPost(slug: string) {
  const { posts, categories } = await loadBlog();
  const post = posts.find((p) => p.slug === slug);
  return { posts, categories, post, category: categories.find((c) => c.slug === post?.category) };
}

export async function generateStaticParams() {
  const { posts } = await loadBlog();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { post, category } = await findPost(params.slug);
  if (!post) return { title: 'Article Not Found' };

  const path = `/blog/${post.slug}`;
  const title = `${post.title} | ${BLOG_NAME}`;
  const description = (post.excerpt || plainText(post.content)).slice(0, 300);
  const keywords = parseKeywords(post.keywords);
  const image = imageUrl(post.image);

  return {
    title: { absolute: title },
    description,
    ...(keywords.length ? { keywords } : {}),
    authors: [{ name: post.author || 'Beyond the Mind' }],
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: 'Beyond the Mind',
      type: 'article',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      section: category?.name,
      tags: keywords.length ? keywords : undefined,
      images: image ? [{ url: image, alt: post.image_alt || post.title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

export default async function BlogArticlePage({ params }: Params) {
  const { posts, categories, post, category } = await findPost(params.slug);
  if (!post) notFound();

  const url = absoluteUrl(`/blog/${post.slug}`);
  const faqs = (post.faqs || []).filter((f) => f.question?.trim() && f.answer?.trim());
  const sameCategory = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const others = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  const related = [...sameCategory, ...others].slice(0, 3);
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
  const body = plainText(post.content);

  const jsonLd: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: imageUrl(post.image),
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      author: { '@type': 'Organization', name: post.author || 'Beyond the Mind', url: absoluteUrl('/about') },
      publisher: {
        '@type': 'Organization',
        name: 'Beyond the Mind',
        url: absoluteUrl('/'),
        logo: { '@type': 'ImageObject', url: absoluteUrl('/images/brand/logo-gold.jpg') },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      url,
      articleSection: category?.name,
      keywords: post.keywords || undefined,
      wordCount: body.split(' ').filter(Boolean).length,
      timeRequired: `PT${readingMinutes(post.content)}M`,
      inLanguage: 'en',
      isPartOf: { '@type': 'Blog', name: BLOG_NAME, url: absoluteUrl('/blog') },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: BLOG_NAME, item: absoluteUrl('/blog') },
        ...(category
          ? [{ '@type': 'ListItem', position: 3, name: category.name, item: absoluteUrl(`/blog/category/${category.slug}`) }]
          : []),
        { '@type': 'ListItem', position: category ? 4 : 3, name: post.title, item: url },
      ],
    },
  ];
  if (faqs.length) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    });
  }

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />

      <main className="pt-28 sm:pt-32 pb-24">
        <article>
          <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] uppercase tracking-widest text-stone-subtle/70">
              <Link href="/blog" className="hover:text-gold-300 transition-colors">
                {BLOG_NAME}
              </Link>
              {category && (
                <>
                  <ChevronRight className="w-3 h-3 opacity-60" />
                  <Link href={`/blog/category/${category.slug}`} className="hover:text-gold-300 transition-colors">
                    {category.name}
                  </Link>
                </>
              )}
            </nav>
            <CategoryPill category={category} />
            <h1 className="font-serif text-4xl sm:text-5xl text-ivory-50 font-light leading-tight">{post.title}</h1>
            <p className="text-base sm:text-lg text-stone-subtle/90 font-light leading-relaxed">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-gold-300">
              <span>By {post.author || 'Beyond the Mind'}</span>
            </div>
            <PostMeta post={post} />
            {post.updated_at && post.updated_at !== post.published_at && (
              <p className="text-[11px] uppercase tracking-widest text-stone-subtle/60">
                Updated <time dateTime={post.updated_at}>{formatBlogDate(post.updated_at)}</time>
              </p>
            )}
          </header>

          {post.image && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-gold-500/30 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.image_alt || post.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: post.image_position || 'center' }}
                />
              </div>
            </div>
          )}

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <ArticleBody content={post.content} />

            {faqs.length > 0 && (
              <section aria-labelledby="faq-heading" className="mt-14 p-6 sm:p-8 rounded-3xl bg-emerald-950/60 border border-gold-500/25">
                <h2 id="faq-heading" className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light mb-6">
                  Frequently Asked Questions
                </h2>
                <dl className="space-y-5">
                  {faqs.map((f, i) => (
                    <div key={i} className="space-y-1.5">
                      <dt className="font-serif text-lg sm:text-xl text-gold-200">{f.question}</dt>
                      <dd className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">{f.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <div className="mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>All articles in {BLOG_NAME}</span>
              </Link>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
            <h2 id="related-heading" className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light text-center mb-10">
              Continue Reading
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <PostCard key={p.id} post={p} category={categoryBySlug.get(p.category)} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-24">
          <ExploreLinks title="Experience It for Yourself" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
