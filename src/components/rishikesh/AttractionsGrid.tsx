'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { RishikeshAttraction } from '@/types';
import { MapPin, Clock, CheckCircle2, MessageCircle, Compass } from 'lucide-react';
import { WhatsAppInquiryModal } from '@/components/layout/WhatsAppInquiryModal';

interface AttractionsGridProps {
  attractions: RishikeshAttraction[];
  title?: string;
  subtitle?: string;
}

export function AttractionsGrid({
  attractions,
  title = 'Rishikesh Attractions & Sacred Adventures',
  subtitle = 'Enhance your retreat pilgrimage with iconic Rishikesh experiences — from adrenaline-pumping bungee jumps and river rafting to ancient meditation caves.',
}: AttractionsGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttraction, setSelectedAttraction] = useState('');

  const handleInquire = (attrTitle: string) => {
    setSelectedAttraction(`Rishikesh Attraction Inquiry: ${attrTitle}`);
    setIsModalOpen(true);
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {attractions.map((attraction) => (
          <div
            key={attraction.id}
            className="group relative flex flex-col rounded-3xl overflow-hidden bg-[#07261F]/70 border border-gold-500/25 shadow-xl hover:border-gold-400/60 transition-all duration-300 hover:-translate-y-1"
          >
            {/* Image Header */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <Image
                src={attraction.image_url}
                alt={attraction.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07261F] via-transparent to-transparent" />

              <span className="absolute top-4 left-4 rounded-full border border-gold-400/60 bg-[#031713]/85 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-gold-300 backdrop-blur-sm">
                {attraction.category}
              </span>

              <span className="absolute bottom-3 right-4 inline-flex items-center gap-1 text-[11px] text-ivory-100 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                <Clock className="w-3 h-3 text-gold-400" />
                <span>{attraction.duration}</span>
              </span>
            </div>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-6 space-y-4">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-light text-ivory-50 leading-snug group-hover:text-gold-300 transition-colors">
                  {attraction.title}
                </h3>

                <div className="flex items-center gap-1.5 text-gold-400 text-xs mt-1.5 font-light">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{attraction.location_tip}</span>
                </div>
              </div>

              <p className="text-xs text-stone-subtle/85 leading-relaxed font-light line-clamp-3">
                {attraction.description}
              </p>

              {/* Highlights */}
              <div className="space-y-1.5 pt-2 border-t border-gold-500/15">
                {attraction.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-ivory-200/90 font-light">
                    <CheckCircle2 className="w-3 h-3 text-gold-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gold-500/15 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleInquire(attraction.title)}
                  className="w-full py-2.5 rounded-full bg-emerald-950 border border-gold-500/35 hover:border-gold-400 text-gold-300 hover:text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 group-hover:bg-gold-500 group-hover:text-emerald-950"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire / Arrange Activity</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WhatsAppInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultProgram={selectedAttraction}
      />
    </div>
  );
}
