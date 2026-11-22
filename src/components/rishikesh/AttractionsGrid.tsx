'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RishikeshAttraction } from '@/types';
import { MapPin, Clock, CheckCircle2, Maximize2 } from 'lucide-react';
import { useCMS } from '@/contexts/CMSContext';
import { ImageLightbox } from '@/components/media/ImageLightbox';

interface AttractionsGridProps {
  attractions: RishikeshAttraction[];
  title?: string;
  subtitle?: string;
}

interface AttractionCardItemProps {
  attraction: RishikeshAttraction;
  index: number;
  onOpenLightbox: () => void;
}

function AttractionCardItem({ attraction, onOpenLightbox }: AttractionCardItemProps) {
  const [imgSrc, setImgSrc] = useState(attraction.image_url || '/images/rishikesh/ganga-aarti.jpg');

  useEffect(() => {
    if (attraction.image_url) {
      setImgSrc(attraction.image_url);
    }
  }, [attraction.image_url]);

  return (
    <div className="group relative flex flex-col h-full rounded-3xl overflow-hidden bg-[#07261F]/70 border border-gold-500/25 shadow-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-gold-400/60 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.7),0_28px_60px_-20px_rgba(212,175,55,0.35)]">
      {/* Full-width photo container with interactive click-to-view preview */}
      <div
        onClick={onOpenLightbox}
        className="relative aspect-[16/10] w-full overflow-hidden shrink-0 cursor-pointer group/img"
        title={`Click to view full photo of ${attraction.title}`}
      >
        <Image
          src={imgSrc}
          alt={attraction.title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top w-full h-full transition-transform duration-700 ease-out group-hover/img:scale-105"
          onError={() => setImgSrc('/images/rishikesh/ganga-aarti.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07261F] via-transparent to-black/30 opacity-70 group-hover/img:opacity-50 transition-opacity" />

        {/* Category Tag (matching Spiritual Dimension tag on retreat cards) */}
        <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 max-w-[calc(100%-3.75rem)] rounded-md border border-gold-400/70 bg-[#031713]/90 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-semibold tracking-wider sm:tracking-[0.14em] uppercase text-gold-300 backdrop-blur-md pointer-events-none leading-snug break-words">
          {attraction.category}
        </span>

        {/* Logo Badge (matching 7 retreat cards) */}
        <span className="absolute top-3 right-3 h-10 w-10 overflow-hidden rounded-full ring-1 ring-gold-400/80 shadow-lg pointer-events-none">
          <Image src="/images/brand/logo.jpg" alt="" fill sizes="40px" className="object-cover" />
        </span>

        {/* Duration on bottom-left */}
        <span className="absolute bottom-3 left-3 sm:left-4 inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-ivory-100 bg-black/75 border border-gold-400/30 px-3 py-1 rounded-full backdrop-blur-md shadow-md pointer-events-none">
          <Clock className="w-3.5 h-3.5 text-gold-400" />
          <span>{attraction.duration}</span>
        </span>

        {/* Expand Overlay Pill on bottom-right (matching 7 retreat cards) */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-gold-400/40 text-[10px] uppercase tracking-wider text-gold-300 opacity-90 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all shadow-md">
          <Maximize2 className="w-3 h-3 text-gold-300" />
          <span>Click to View Photo</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 flex-col justify-between p-6 sm:p-7 space-y-4">
        <div className="space-y-3">
          <div className="min-h-[64px]">
            <h3
              onClick={onOpenLightbox}
              className="font-serif text-xl sm:text-2xl font-light text-ivory-50 leading-snug group-hover:text-gold-300 transition-colors cursor-pointer"
              title={`Click to view full photo of ${attraction.title}`}
            >
              {attraction.title}
            </h3>

            <div className="flex items-center gap-1.5 text-gold-400 text-xs mt-1.5 font-light">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{attraction.location_tip}</span>
            </div>
          </div>

          <p className="text-xs text-stone-subtle/85 leading-relaxed font-light min-h-[56px]">
            {attraction.description}
          </p>
        </div>

        {/* Highlights */}
        <div className="space-y-2 pt-4 border-t border-gold-500/15 mt-auto">
          <span className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold block mb-1">
            Experience Highlights:
          </span>
          {attraction.highlights.map((h, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-ivory-200/90 font-light">
              <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
              <span>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AttractionsGrid({
  attractions: initialAttractions,
  title = 'Rishikesh Attractions & Sacred Adventures',
  subtitle = 'Enhance your retreat pilgrimage with iconic Rishikesh experiences — from adrenaline-pumping bungee jumps and river rafting to ancient meditation caves.',
}: AttractionsGridProps) {
  const { attractions: cmsAttractions, liveUpdated } = useCMS();
  const hasLiveUpdate = liveUpdated?.attractions;
  const attractions = hasLiveUpdate && cmsAttractions && cmsAttractions.length > 0
    ? cmsAttractions
    : (initialAttractions && initialAttractions.length > 0 ? initialAttractions : cmsAttractions);

  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const lightboxImages = attractions.map((attr) => ({
    src: attr.image_url || '/images/rishikesh/ganga-aarti.jpg',
    alt: attr.title,
    title: attr.title,
    caption: `${attr.category} • ${attr.duration} • ${attr.description}`,
    location: attr.location_tip,
  }));

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium text-gold-400">
          <span className="w-6 h-px bg-gold-400/60 inline-block" />
          <span>Things to Do in Rishikesh</span>
          <span className="w-6 h-px bg-gold-400/60 inline-block" />
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-50 font-light leading-tight">
          {title}
        </h2>

        <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {attractions.map((attraction, idx) => (
          <AttractionCardItem
            key={attraction.id}
            attraction={attraction}
            index={idx}
            onOpenLightbox={() => setActiveLightboxIndex(idx)}
          />
        ))}
      </div>

      {/* Lightbox for full photo viewing */}
      {activeLightboxIndex !== null && (
        <ImageLightbox
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
          images={lightboxImages}
          currentIndex={activeLightboxIndex}
          onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
        />
      )}
    </div>
  );
}
