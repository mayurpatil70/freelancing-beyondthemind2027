import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Flower2, Heart, Mountain } from 'lucide-react';
import type { BlogPost } from '@/types';
import { formatBlogDate, readingMinutes } from '@/lib/blog';

function Cover({
  post,
  className,
  sizes = 'small',
}: {
  post: BlogPost;
  className?: string;
  sizes?: 'small' | 'large';
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#0B3A2E] via-[#07261F] to-[#031713] ${className || ''}`}>
      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.image}
          alt={post.image_alt || post.title}
          loading={sizes === 'large' ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ objectPosition: post.image_position || 'center' }}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen aria-hidden="true" className={sizes === 'large' ? 'w-16 h-16 text-gold-400/70' : 'w-10 h-10 text-gold-400/70'} />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#031713]/70 via-transparent to-transparent" />
    </div>
  );
}

export function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-stone-subtle/70 ${className || ''}`}>
      <time dateTime={post.published_at}>{formatBlogDate(post.published_at)}</time>
      <span className="opacity-40">•</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3 h-3" />
        {readingMinutes(post.content)} min read
      </span>
    </div>
  );
}

export function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden bg-[#07261F]/70 border border-gold-500/30 hover:border-gold-400/60 transition-colors shadow-2xl"
    >
      <Cover post={post} sizes="large" className="aspect-[16/10] lg:aspect-auto lg:min-h-[360px]" />
      <div className="p-6 sm:p-10 flex flex-col justify-center space-y-4">
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold">Featured Article</span>
        <h2 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light leading-tight group-hover:text-gold-200 transition-colors">
          {post.title}
        </h2>
        <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed">{post.excerpt}</p>
        <PostMeta post={post} />
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gold-300 pt-2">
          Read the article
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

// headingLevel: 'h2' where the cards sit straight under the page H1, else 'h3'.
export function PostCard({
  post,
  headingLevel: Heading = 'h3',
}: {
  post: BlogPost;
  headingLevel?: 'h2' | 'h3';
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group flex flex-col h-full rounded-2xl overflow-hidden bg-[#07261F]/70 border border-gold-500/25 hover:border-gold-400/60 transition-colors"
    >
      <Cover post={post} className="aspect-[16/10]" />
      <div className="flex flex-col flex-1 p-5 sm:p-6 space-y-3">
        <Heading className="font-serif text-xl sm:text-2xl text-ivory-50 font-light leading-snug group-hover:text-gold-200 transition-colors">
          {post.title}
        </Heading>
        <p className="text-sm text-stone-subtle/85 font-light leading-relaxed flex-1">{post.excerpt}</p>
        <PostMeta post={post} />
      </div>
    </Link>
  );
}

export function PopularPostRow({ post, rank }: { post: BlogPost; rank: number }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      prefetch={true}
      className="group flex items-start gap-4 h-full p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/25 hover:border-gold-400/60 transition-colors"
    >
      <span className="w-10 h-10 shrink-0 rounded-full bg-[#031713] border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold">
        {String(rank).padStart(2, '0')}
      </span>
      <span className="min-w-0 space-y-1.5">
        <span className="block font-serif text-xl text-ivory-50 leading-tight group-hover:text-gold-200 transition-colors">
          {post.title}
        </span>
        <PostMeta post={post} />
      </span>
    </Link>
  );
}

const EXPLORE_LINKS = [
  {
    href: '/daily-meditation',
    eyebrow: 'Guided Practice',
    title: 'Daily Guided Meditation',
    text: 'Join our guided meditation sessions and make stillness a part of every day.',
    icon: Flower2,
  },
  {
    href: '/healing-sessions',
    eyebrow: 'Individual • By Appointment',
    title: 'Transformative Healing Sessions',
    text: 'One-to-one sessions for emotional release, relationships, abundance and inner balance.',
    icon: Heart,
  },
  {
    href: '/about',
    eyebrow: 'Rishikesh • Oct 6–9, 2027',
    title: 'The Divine Retreat',
    text: 'Four days of meditation, healing and inner transformation beside the sacred Ganga.',
    icon: Mountain,
  },
];

export function ExploreLinks({ title = 'Continue the Journey Within' }: { title?: string }) {
  return (
    <section aria-labelledby="explore-heading" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 id="explore-heading" className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light text-center mb-10">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPLORE_LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            prefetch={true}
            className="group flex flex-col h-full p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 hover:border-gold-400/70 transition-colors space-y-3"
          >
            <l.icon className="w-7 h-7 text-gold-400" aria-hidden="true" />
            <span className="block text-[10px] uppercase tracking-[0.25em] text-gold-400">{l.eyebrow}</span>
            <span className="block font-serif text-2xl text-ivory-50 font-light leading-tight group-hover:text-gold-200 transition-colors">
              {l.title}
            </span>
            <span className="block text-sm text-stone-subtle/85 font-light leading-relaxed flex-1">{l.text}</span>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gold-300 pt-2">
              Explore
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
