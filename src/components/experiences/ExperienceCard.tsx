'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SacredExperience } from '@/types';
import {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
  ArrowRight,
  Layers,
  MapPin,
  Users,
  Maximize2,
} from 'lucide-react';
import { ImageLightbox } from '@/components/media/ImageLightbox';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
};

interface ExperienceCardProps {
  experience: SacredExperience;
  featured?: boolean;
}

export function ExperienceCard({ experience, featured = false }: ExperienceCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const Icon = iconMap[experience.icon_name] || CircleDot;
  const meta = [
    { icon: Layers, text: `Session ${String(experience.order).padStart(2, '0')}` },
    { icon: Icon, text: experience.subtitle },
    { icon: MapPin, text: 'Rishikesh' },
    { icon: Users, text: 'In-Person & Online' },
  ];

  return (
    <>
      <article
        id={experience.slug}
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl bg-[#FAF8F5] text-[#031713] border border-gold-400/50 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.7),0_28px_60px_-20px_rgba(212,175,55,0.35)]',
          featured && 'lg:col-span-2'
        )}
      >
        {/* Full-width photo container with interactive click-to-view preview */}
        <div
          onClick={() => setLightboxOpen(true)}
          className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer group/img bg-[#02100d]"
          title="Click to view full photo in high resolution"
        >
          {/* Ambient blurred backdrop so whole photo fits seamlessly without empty letterboxing */}
          <Image
            src={experience.image}
            alt=""
            fill
            unoptimized
            aria-hidden="true"
            className="object-cover w-full h-full blur-md opacity-40 scale-110 pointer-events-none"
          />

          {/* Whole photo fully visible without any cropping */}
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain w-full h-full relative z-[1] transition-transform duration-700 ease-out group-hover/img:scale-105"
          />
          <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/45 via-transparent to-black/35 opacity-70 group-hover/img:opacity-40 transition-opacity pointer-events-none" />

          {/* Top Tag & Logo Bar: flex container guarantees a clear gap between tag & logo on all screens */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-3 pointer-events-none">
            <span className="rounded-md border border-gold-400/70 bg-[#031713]/90 px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase text-gold-300 backdrop-blur-md leading-snug break-words shadow-md max-w-[calc(100%-3.5rem)]">
              {experience.spiritual_dimension}
            </span>

            <span className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-gold-400/80 shadow-lg bg-[#031713]">
              <Image src="/images/brand/logo.jpg" alt="" fill sizes="40px" className="object-cover" />
            </span>
          </div>

          {/* Expand Overlay Pill */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-gold-400/40 text-[10px] uppercase tracking-wider text-gold-300 opacity-90 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all shadow-md">
            <Maximize2 className="w-3 h-3 text-gold-300" />
            <span>Click to View Photo</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="font-serif text-[22px] font-semibold uppercase leading-tight tracking-wide line-clamp-2">
            {experience.title}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-[#031713]/65 line-clamp-2">{experience.short_desc}</p>

          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 rounded-lg border border-[#E6DCC2] bg-[#F3EEE2] px-4 py-3 mb-5">
            {meta.map(({ icon: MetaIcon, text }) => (
              <li key={text} className="flex items-center gap-1.5 text-[12px] font-medium text-[#031713]/85">
                <MetaIcon className="h-3.5 w-3.5 shrink-0 text-gold-600" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-end justify-between gap-4 border-t border-[#E6DCC2] pt-5">
            <div>
              <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#031713]/55">Part of</span>
              <span className="font-serif text-xl font-bold leading-none">BTM 2027</span>
            </div>
            <Link
              href={`/experiences#${experience.slug}`}
              prefetch={true}
              className="inline-flex items-center gap-2 rounded-md bg-[#031713] px-4 py-3 text-[11px] font-bold tracking-[0.16em] uppercase text-gold-300 transition-colors hover:bg-[#07261F] hover:text-gold-200"
            >
              View experience
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </article>

      {/* Lightbox for full photo viewing */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={[
          {
            src: experience.image,
            alt: experience.title,
            title: experience.title,
            caption: `${experience.subtitle} • ${experience.short_desc}`,
            location: 'Rishikesh, Uttarakhand • Beyond the Mind 2027',
          },
        ]}
        currentIndex={0}
      />
    </>
  );
}
