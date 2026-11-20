'use client';

import React from 'react';
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
} from 'lucide-react';
import { useCMS } from '@/contexts/CMSContext';

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
}

export function ExperiencesDetailList({ initialExperiences }: ExperiencesDetailListProps) {
  const { experiences } = useCMS();
  const list = experiences && experiences.length > 0 ? experiences : initialExperiences;

  return (
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
              {/* Media Column */}
              <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] border border-gold-500/40 shadow-xl">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07261F] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full bg-[#031713]/90 border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold shadow-lg">
                    {String(exp.order).padStart(2, '0')}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-ivory-100 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gold-400/20">
                    <span>Session {exp.order}</span>
                    <span className="text-gold-300">In-Person & Online</span>
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-gold-500/30 text-xs uppercase tracking-wider text-gold-300 font-medium">
                  <Icon className="w-3.5 h-3.5 text-gold-400" />
                  <span>{exp.spiritual_dimension}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light leading-snug">
                  {exp.title}
                </h2>

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

                {/* SEO Search Keywords for Google & AI Engines */}
                {exp.keywords && (
                  <div className="pt-3">
                    <span className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold block mb-1.5">
                      Focus Dimensions & SEO Keywords:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.keywords.split(',').map((kw, ki) => (
                        <span
                          key={ki}
                          className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-gold-500/25 text-gold-300 font-light"
                        >
                          #{kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href={`/register?programme=${encodeURIComponent(exp.title)}`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-gold-sm"
                  >
                    <span>Enquire For This Session</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
