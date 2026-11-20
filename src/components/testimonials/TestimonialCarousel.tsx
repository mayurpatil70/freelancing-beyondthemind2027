'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Testimonial } from '@/types';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { ImageLightbox } from '@/components/media/ImageLightbox';

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
}

const DEFAULT_SLIDES = [
  {
    src: '/images/posters/btm2026-testimonial.jpg',
    alt: 'Beyond the Mind Seeker Experience Photo 1',
    title: 'Seeker Experience Photo 1',
  },
  {
    src: '/images/posters/btm2026-tribe.jpg',
    alt: 'Beyond the Mind Seeker Experience Photo 2',
    title: 'Seeker Experience Photo 2',
  },
  {
    src: '/images/posters/btm-kundalini.jpg',
    alt: 'Beyond the Mind Seeker Experience Photo 3',
    title: 'Seeker Experience Photo 3',
  },
];

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Derive exactly 3 sliding photos
  const slides =
    testimonials && testimonials.length >= 3
      ? testimonials.slice(0, 3).map((t, index) => ({
          src: t.poster_url || DEFAULT_SLIDES[index % DEFAULT_SLIDES.length].src,
          alt: t.name || DEFAULT_SLIDES[index % DEFAULT_SLIDES.length].alt,
          title: t.name || DEFAULT_SLIDES[index % DEFAULT_SLIDES.length].title,
        }))
      : DEFAULT_SLIDES;

  const currentSlide = slides[currentIndex] || slides[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const lightboxImages = slides.map((s) => ({
    src: s.src,
    alt: s.alt,
    title: s.title,
    caption: '',
  }));

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Sliding 3 Photos Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-500/30 p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Subtle gold ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-radial opacity-25 pointer-events-none" />

        {/* Carousel Showcase Container */}
        <div className="relative w-full flex items-center justify-center">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 p-3 sm:p-4 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-gold-500/40 text-gold-300 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Sliding Photo Card */}
          <div
            className="group relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-[2/3] rounded-2xl overflow-hidden border-2 border-gold-400/50 shadow-gold-md cursor-pointer transition-all duration-500 hover:border-gold-300 hover:shadow-2xl"
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={currentSlide.src}
              alt={currentSlide.alt}
              fill
              sizes="(max-width: 640px) 320px, (max-width: 768px) 384px, 448px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-emerald-950/10 group-hover:bg-transparent transition-colors" />

            {/* Hover overlay with inspection button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950/95 border border-gold-400 text-gold-300 text-xs uppercase tracking-wider font-semibold shadow-md">
                <Maximize2 className="w-4 h-4" />
                <span>View Full Photo</span>
              </span>
            </div>
          </div>

          {/* Next Arrow */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-3 sm:p-4 rounded-full bg-emerald-950/90 hover:bg-emerald-900 border border-gold-500/40 text-gold-300 hover:text-white transition-all shadow-xl hover:scale-110 active:scale-95"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Bottom Pagination Dots & Counter */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'w-8 bg-gradient-to-r from-gold-400 to-gold-500 shadow-gold-sm'
                    : 'w-2.5 bg-emerald-900 hover:bg-gold-500/50'
                }`}
                aria-label={`Go to photo ${idx + 1}`}
              />
            ))}
          </div>

          <span className="text-xs text-stone-subtle/70 font-mono tracking-wider">
            Photo {currentIndex + 1} of {slides.length}
          </span>
        </div>
      </div>

      {/* Lightbox for Fullscreen Inspection */}
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
