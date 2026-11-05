'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/types';
import { ImageLightbox } from '@/components/media/ImageLightbox';
import { Maximize2, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryGridProps {
  items: GalleryItem[];
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    'All',
    'Retreat Experience',
    'Participants',
    'Meditation',
    'Kundalini Awakening',
    'Nature & Mountains',
    'Rishikesh',
    'Sacred Moments',
  ];

  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  const openLightboxAt = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const lightboxImages = filteredItems.map((item) => ({
    src: item.image_url,
    alt: item.title,
    title: item.title,
    caption: item.caption,
    location: item.location,
  }));

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all duration-200',
              activeCategory === cat
                ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold shadow-gold-sm scale-105'
                : 'bg-[#07261F]/80 text-ivory-200/80 hover:text-gold-300 hover:bg-emerald-900/60 border border-gold-500/15'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openLightboxAt(idx)}
            className="group relative rounded-2xl overflow-hidden bg-[#07261F]/60 border border-gold-500/25 hover:border-gold-400/60 shadow-lg cursor-pointer transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07261F] via-[#07261F]/20 to-transparent" />

              {/* Hover overlay with button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-gold-400 text-gold-300 text-xs uppercase tracking-wider font-medium">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View High-Res</span>
                </span>
              </div>

              {/* Category Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2.5 py-0.5 rounded-full bg-[#031713]/80 backdrop-blur-md border border-gold-500/30 text-[10px] uppercase tracking-wider text-gold-300 font-medium">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-1.5">
              <h3 className="font-serif text-lg text-ivory-50 group-hover:text-gold-200 transition-colors font-medium">
                {item.title}
              </h3>
              <p className="text-xs text-stone-subtle/80 font-light leading-relaxed line-clamp-2">
                {item.caption}
              </p>
              {item.location && (
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gold-400/80 pt-1">
                  <MapPin className="w-3 h-3 text-gold-400" />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
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

