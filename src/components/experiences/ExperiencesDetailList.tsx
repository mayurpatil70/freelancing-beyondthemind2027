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
  CheckCircle2,
  Maximize2,
} from 'lucide-react';
import { ImageLightbox } from '@/components/media/ImageLightbox';
import { useCMS } from '@/contexts/CMSContext';
import { canOptimizeImage } from '@/lib/media/rules';

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
};

interface ExperiencesDetailListProps {
  initialExperiences: SacredExperience[];
  /** Render only this session (its own page at /experiences/[slug]). */
  onlySlug?: string;
}

export function ExperiencesDetailList({ initialExperiences, onlySlug }: ExperiencesDetailListProps) {
  const { experiences, liveUpdated } = useCMS();
  const hasLiveUpdate = liveUpdated?.experiences;
  const fullList = hasLiveUpdate && experiences && experiences.length > 0
    ? experiences
    : (initialExperiences && initialExperiences.length > 0 ? initialExperiences : experiences);
  const onlyMatch = onlySlug ? fullList.filter((exp) => exp.slug === onlySlug) : [];
  const list = onlySlug ? (onlyMatch.length > 0 ? onlyMatch : initialExperiences) : fullList;
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const lightboxImages = list.map((exp) => ({
    src: exp.image,
    alt: exp.title,
    title: exp.title,
    caption: `${exp.subtitle} • ${exp.short_desc}`,
    location: 'Rishikesh, Uttarakhand • Beyond the Mind 2027',
  }));

  // On a session's own page its title is the page H1; on the list page each title is an H2.
  const TitleTag = onlySlug ? 'h1' : 'h2';

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {list.map((exp, idx) => {
          const Icon = iconMap[exp.icon_name] || CircleDot;
          const isEven = idx % 2 === 1;

          return (
            <div
              key={exp.id}
              id={exp.slug}
              className="scroll-mt-32 p-6 sm:p-10 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-2xl space-y-6 hover:border-gold-400/50 transition-colors"
            >
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                  isEven ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Media Column with click-to-preview lightbox */}
                <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div
                    onClick={() => setActiveLightboxIndex(idx)}
                    className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] border border-gold-500/40 shadow-xl cursor-pointer group/img bg-[#031713]"
                    title="Click to view full photo"
                  >
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      unoptimized={!canOptimizeImage(exp.image)}
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover object-top w-full h-full transition-transform duration-700 ease-out group-hover/img:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07261F]/80 via-transparent to-transparent opacity-50 group-hover/img:opacity-30 transition-opacity" />
                    
                    <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full bg-[#031713]/90 border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold shadow-lg">
                      {String(exp.order).padStart(2, '0')}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-ivory-100 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gold-400/20">
                      <span>Session {exp.order}</span>
                      <span className="text-gold-300 flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>View Full Photo</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Text Column */}
                <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-gold-500/30 text-xs uppercase tracking-wider text-gold-300 font-medium">
                    <Icon className="w-3.5 h-3.5 text-gold-400" />
                    <span>{exp.spiritual_dimension}</span>
                  </div>

                  <TitleTag className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light leading-snug">
                    {onlySlug ? (
                      exp.title
                    ) : (
                      <Link href={`/experiences/${exp.slug}`} className="hover:text-gold-200 transition-colors">
                        {exp.title}
                      </Link>
                    )}
                  </TitleTag>

                  <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-medium block">
                    {exp.subtitle}
                  </span>

                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    {exp.full_desc}
                  </p>

                  {/* Highlights */}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-emerald-800/50">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                        Key Practice Dimensions:
                      </span>
                      {exp.highlights.map((h, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-ivory-100 font-light"
                        >
                          <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}



                  <div className="pt-4 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/register?programme=${encodeURIComponent(exp.title)}`}
                      prefetch={true}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-gold-sm"
                    >
                      <span>Enquire</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeLightboxIndex !== null && (
        <ImageLightbox
          isOpen={activeLightboxIndex !== null}
          onClose={() => setActiveLightboxIndex(null)}
          images={lightboxImages}
          currentIndex={activeLightboxIndex}
          onNavigate={(newIdx) => setActiveLightboxIndex(newIdx)}
        />
      )}
    </>
  );
}
