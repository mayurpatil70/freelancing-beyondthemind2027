'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import { ImageLightbox } from '@/components/media/ImageLightbox';

export interface RishikeshPhoto {
  src: string;
  alt: string;
  title: string;
  caption: string;
  location: string;
}

const RISHIKESH_PHOTOS: RishikeshPhoto[] = [
  {
    src: '/images/rishikesh/ganga-himalaya-sunrise-landscape.jpg',
    alt: 'Himalayan Foothills Dawn',
    title: 'Himalayan Foothills Dawn',
    caption: 'Golden sunrise over Mother Ganga, the snow-capped Himalayas and the temples of Rishikesh.',
    location: 'Rishikesh, Uttarakhand, India',
  },
  {
    src: '/images/rishikesh/ganga-aarti-landscape.jpg',
    alt: 'Sacred Lamp Aarti',
    title: 'Sacred Ganga Aarti',
    caption: 'Evening lamp offering and sacred Vedic chants along the sacred ghats of Mother Ganga.',
    location: 'Parmarth Niketan, Rishikesh',
  },
  {
    src: '/images/rishikesh/river-meditation-landscape.jpg',
    alt: 'Meditation along Ganga',
    title: 'Meditation Along Ganga',
    caption: 'Deep contemplative stillness and inner absorption amidst the pure currents of the Ganges.',
    location: 'Ganga Ghats, Rishikesh',
  },
  {
    src: '/images/rishikesh/himalayan-snow-trek-landscape.jpg',
    alt: 'Garhwal Himalayan Snow Trail',
    title: 'Garhwal Himalayan Snow Trail',
    caption: 'Majestic snowy mountain ridges where the sacred Garhwal peaks meet timeless stillness.',
    location: 'Garhwal Himalayas, Uttarakhand, India',
  },
];

export function RishikeshPhotoGrid() {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {RISHIKESH_PHOTOS.map((photo, idx) => (
          <div
            key={photo.src}
            onClick={() => setActiveLightboxIndex(idx)}
            className="group relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-gold-500/30 bg-[#07261F]/40 shadow-lg cursor-pointer transition-all duration-300 hover:border-gold-400/80 hover:shadow-[0_0_30px_rgba(212,175,55,0.25)] hover:-translate-y-1"
            title={`Click to view ${photo.title} in high resolution`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 40vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient & Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

            {/* Expand / Maximize Hover Icon */}
            <div className="absolute bottom-3 right-3 p-2.5 rounded-full bg-emerald-950/85 border border-gold-400/50 text-gold-300 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
              <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Pop-up with rounded borders */}
      {activeLightboxIndex !== null && (
        <ImageLightbox
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
          images={RISHIKESH_PHOTOS}
          currentIndex={activeLightboxIndex}
          onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
        />
      )}
    </>
  );
}
