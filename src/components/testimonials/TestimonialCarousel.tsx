'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types';
import { Quote, ChevronLeft, ChevronRight, Maximize2, MapPin, Sparkles } from 'lucide-react';
import { ImageLightbox } from '@/components/media/ImageLightbox';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const current = testimonials[currentIndex] || testimonials[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const lightboxImages = testimonials
    .filter((t) => t.poster_url)
    .map((t) => ({
      src: t.poster_url!,
      alt: `${t.name} Testimonial Poster`,
      title: `${t.name} — ${t.edition}`,
      caption: t.highlight_quote,
      location: t.location,
    }));

  return (
    <div className="relative max-w-5xl mx-auto">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-500/30 p-6 sm:p-12 shadow-2xl overflow-hidden">
        {/* Subtle gold ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-radial opacity-30 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Testimonial Text & Credibility */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-[10px] tracking-widest uppercase text-gold-300 font-semibold">
                <Sparkles className="w-3 h-3 text-gold-400" />
                Verified Seeker Experience
              </span>
              <span className="text-xs text-stone-subtle/70">{current.edition}</span>
            </div>

            <Quote className="w-10 h-10 text-gold-400/40" />

            <blockquote className="font-serif text-lg sm:text-xl text-ivory-50 leading-relaxed font-light italic">
              &ldquo;{current.highlight_quote}&rdquo;
            </blockquote>

            <div className="text-xs sm:text-sm text-stone-subtle/85 leading-relaxed whitespace-pre-line font-light border-l-2 border-gold-500/40 pl-4 py-1">
              {current.full_testimonial}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-gold-500/15">
              <div>
                <h4 className="font-serif text-xl text-gold-300 font-medium">{current.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-stone-subtle/80 mt-0.5">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  <span>{current.location}</span>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-gold-200 transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs text-stone-subtle font-mono px-1">
                  {currentIndex + 1} / {testimonials.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-gold-200 transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Original Client Artwork / Poster Preview */}
          {current.poster_url && (
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                className="group relative w-64 sm:w-72 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-gold-400/50 shadow-gold-md cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                onClick={() => setLightboxOpen(true)}
              >
                <Image
                  src={current.poster_url}
                  alt={`${current.name} Official Poster`}
                  fill
                  sizes="(max-width: 768px) 256px, 288px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition-colors" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/90 border border-gold-400 text-gold-300 text-xs uppercase tracking-wider font-medium">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Original Poster</span>
                  </span>
                </div>
              </div>

              <span className="text-[11px] text-stone-subtle/60 mt-3 italic text-center">
                Click artwork to inspect official archival testimonial
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox for full-size inspection */}
      {lightboxImages.length > 0 && (
        <ImageLightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          images={lightboxImages}
          currentIndex={currentIndex}
          onNavigate={(idx) => setCurrentIndex(idx)}
        />
      )}
    </div>
  );
}

