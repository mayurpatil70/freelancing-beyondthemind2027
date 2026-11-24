'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Testimonial } from '@/types';
import { ChevronLeft, ChevronRight, Quote, Sparkles } from 'lucide-react';

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
}

export interface ClonedTestimonial {
  id: string;
  name: string;
  location: string;
  badge: string;
  paragraphs: string[];
}

// 4 Exact Clone Testimonials from Screenshots 2, 3, 4, 5 in exact sequential order
export const CLONED_TESTIMONIALS: ClonedTestimonial[] = [
  {
    id: 'btm-testimonial-1-neethu',
    name: 'Neethu',
    location: 'Muscat, Oman',
    badge: 'Testimonial from BTM 2026',
    paragraphs: [
      'Master, I experienced that day as a second birth. I feel deeply grateful for your care, guidance, and the attention you gave me during that moment. I will always hold this experience close to my heart.',
      'Thank you for being my guide on this spiritual journey and for helping me feel renewed and hopeful. My heart is filled with love, respect, and gratitude for you.',
      'May I always receive your guidance and continue growing on my spiritual path. I offer you my heartfelt pranams, Master.',
    ],
  },
  {
    id: 'btm-testimonial-2-binu',
    name: 'Binu',
    location: 'Kottayam, Kerala',
    badge: 'Testimonial from BTM 2026',
    paragraphs: [
      'Words are insufficient to express my deepest and infinite gratitude to you.',
      'I am returning from this journey as a completely transformed person.',
      'Stepping away from my usual routines and familiar surroundings into this distinct, powerful environment made these days the most valuable moments of my life.',
      'For three years, I had been waiting for this opportunity.',
      'This experience helped me overcome my limitations and shortcomings, blessing me with a profound sense of inner peace and composure. I was able to deeply absorb the universal energy and experience every single process at a deeper level.',
    ],
  },
  {
    id: 'btm-testimonial-3-binu',
    name: 'Binu',
    location: 'Kottayam, Kerala',
    badge: 'Testimonial from BTM 2026',
    paragraphs: [
      'The group healing, deep meditation, Shivalinga Activation, and Kundalini Sakthi Activation made me truly realize the state of oneness.',
      'Though I find it hard to put every intricate detail of these processes into words, I am immensely thankful for receiving such a divine opportunity.',
      'You have become the guiding light for my eyes and the path for my feet in this life.',
      'No amount of gratitude will ever be enough.',
    ],
  },
  {
    id: 'btm-testimonial-4-arjun',
    name: 'Arjun Pradeep',
    location: 'Bangalore',
    badge: 'Testimonial from BTM 2026',
    paragraphs: [
      'The Beyond the Mind retreat was a really positive experience. Since this was my second time attending, it felt even more special doing it at Kanyakumari.',
      'We started the first day with Pooja Veppu for ourselves, which was a great way to begin.',
      'During the process of activating the Maha Theerthas and the three Shiva Lingams, I could actually feel subtle sensations in my body.',
      'On the last day’s meditation, even though there were many mandalas, I felt something really special during the Shiva Mandala and the merging process.',
      'Learning about entity removal and getting to know about our spirit guides was very insightful. The soul liberation process was also a very good and experiential process.',
      'Overall, it gave me a wonderful sense of calm and connection.',
      'Thank you Pradeep Sir and a heartfelt thanks to all the who were part of this retreat.',
    ],
  },
];

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // If testimonials are passed from props or db, map them, otherwise default to the exact 4 clone testimonials
  const cards: ClonedTestimonial[] = React.useMemo(() => {
    if (testimonials && testimonials.length > 0 && testimonials[0]?.full_testimonial) {
      return testimonials.map((t, idx) => ({
        id: t.id || `test-${idx}`,
        name: t.name,
        location: t.location,
        badge: t.edition || 'Testimonial from BTM 2026',
        paragraphs: t.full_testimonial.split('\n\n').filter(Boolean),
      }));
    }
    return CLONED_TESTIMONIALS;
  }, [testimonials]);

  const current = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards.length]);

  // Touch Swipe for mobile sliding
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  return (
    <div className="relative max-w-4xl mx-auto px-2 sm:px-4">
      {/* Sliding Testimonial Card Container */}
      <div
        className="relative rounded-3xl bg-gradient-to-br from-[#07261F] via-[#05211b] to-[#031713] border border-gold-500/30 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden transition-all duration-500"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Subtle decorative gold ambient glow & corner flourish */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-radial opacity-20 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gold-radial opacity-15 pointer-events-none" />

        {/* Card Header: Edition Badge & Slide Navigation */}
        <div className="relative z-10 flex items-center justify-between border-b border-gold-500/20 pb-4 mb-6 gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-gold-400/50 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-[10px] sm:text-xs tracking-wider sm:tracking-widest whitespace-nowrap text-gold-400 font-semibold uppercase">
              {current.badge}
            </span>
          </div>

          {/* Top Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
              aria-label="Previous Testimonial"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
              aria-label="Next Testimonial"
              title="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonial Quote & Paragraphs (Exact clone content, no image) */}
        <div className="relative z-10 space-y-4">
          <div className="space-y-3">
            {/* Opening Golden Quote Mark */}
            <div className="text-gold-400/80 font-serif text-4xl sm:text-5xl -mb-5 leading-none select-none" aria-hidden="true">
              “
            </div>

            {/* Paragraphs rendered with clean serene typography */}
            <div className="space-y-4 text-sm sm:text-base text-ivory-100 font-light leading-relaxed">
              {current.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-[#FAF8F5]/95">
                  {p}
                </p>
              ))}
            </div>

            {/* Closing Golden Quote Mark */}
            <div className="text-right text-gold-400/80 font-serif text-4xl sm:text-5xl -mt-3 -mb-4 leading-none select-none" aria-hidden="true">
              ”
            </div>
          </div>

          {/* Golden Lotus Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400/50" />
            <span className="text-gold-400 text-sm select-none" aria-hidden="true">🪷</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400/50" />
          </div>

          {/* Author & Location */}
          <div className="text-center space-y-1">
            <p className="font-serif text-xl sm:text-2xl text-gold-300 font-medium tracking-wide">
              {current.name}
            </p>
            <p className="text-[11px] sm:text-xs text-stone-subtle/80 tracking-widest uppercase font-light">
              {current.location}
            </p>
          </div>
        </div>

        {/* Bottom Sliding Pagination Dots & Slide Counter */}
        <div className="relative z-10 mt-6 pt-5 border-t border-gold-500/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {cards.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-7 bg-gradient-to-r from-gold-400 to-gold-500 shadow-gold-sm'
                    : 'w-2 bg-emerald-900/90 hover:bg-gold-500/50'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>

          <div className="text-[11px] text-stone-subtle/70 tracking-widest uppercase">
            Testimonial <span className="text-gold-400 font-semibold">{currentIndex + 1}</span> of{' '}
            <span className="text-gold-400">{cards.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
