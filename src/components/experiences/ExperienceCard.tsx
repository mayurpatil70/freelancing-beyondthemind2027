import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SacredExperience } from '@/types';
import { Feather, Flame, Sun, Sparkles, Heart, Compass, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Sparkles,
  Heart,
  Compass,
};

interface ExperienceCardProps {
  experience: SacredExperience;
  featured?: boolean;
}

export function ExperienceCard({ experience, featured = false }: ExperienceCardProps) {
  const IconComponent = iconMap[experience.icon_name] || Sparkles;

  return (
    <article
      id={experience.slug}
      className={cn(
        'group relative rounded-2xl overflow-hidden bg-[#07261F]/60 border border-gold-500/20 hover:border-gold-400/50 transition-all duration-500 flex flex-col justify-between shadow-lg hover:shadow-gold-sm',
        featured ? 'lg:col-span-2' : ''
      )}
    >
      {/* Visual Header / Image */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07261F] via-[#07261F]/40 to-transparent" />

        {/* Spiritual Dimension Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#031713]/85 backdrop-blur-md border border-gold-500/30 text-[10px] tracking-wider uppercase text-gold-300 font-medium">
            <IconComponent className="w-3 h-3 text-gold-400" />
            {experience.spiritual_dimension}
          </span>
        </div>

        {/* Order Badge */}
        <div className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#031713]/80 border border-gold-500/30 flex items-center justify-center font-serif text-xs text-gold-300">
          0{experience.order}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] tracking-widest text-gold-400/90 uppercase font-light">
            {experience.subtitle}
          </span>
          <h3 className="font-serif text-2xl text-ivory-50 group-hover:text-gold-200 transition-colors font-medium mt-1">
            {experience.title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-subtle/80 leading-relaxed font-light mt-2.5">
            {experience.short_desc}
          </p>
        </div>

        {/* Highlights List */}
        {experience.highlights && experience.highlights.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-emerald-800/40">
            {experience.highlights.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-[11px] sm:text-xs text-ivory-200/90 font-light">
                <CheckCircle2 className="w-3.5 h-3.5 text-gold-400/80 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Learn More & Anchor Link */}
        <div className="pt-4 flex items-center justify-between border-t border-gold-500/15">
          <Link
            href={`/experiences#${experience.slug}`}
            className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-gold-300 hover:text-gold-200 font-medium group/btn"
          >
            <span>Explore Experience</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-gold-400" />
          </Link>
          <Link
            href="/register"
            className="text-[11px] tracking-wider uppercase text-stone-subtle/70 hover:text-gold-300 transition-colors"
          >
            Enquire
          </Link>
        </div>
      </div>
    </article>
  );
}

