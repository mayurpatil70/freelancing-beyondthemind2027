import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-3xl space-y-3 mb-12 sm:mb-16',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            'inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium',
            light ? 'text-gold-700' : 'text-gold-400'
          )}
        >
          <span className="w-6 h-px bg-gold-400/60 inline-block" />
          <span>{eyebrow}</span>
          <span className="w-6 h-px bg-gold-400/60 inline-block" />
        </div>
      )}

      <h2
        className={cn(
          'font-serif text-3xl sm:text-4xl lg:text-5xl tracking-wide font-light leading-[1.15]',
          light ? 'text-[#191D19]' : 'text-ivory-50'
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            'text-sm sm:text-base leading-relaxed font-light pt-1',
            light ? 'text-[#191D19]/75' : 'text-stone-subtle/80'
          )}
        >
          {subtitle}
        </p>
      )}

      {/* Subtle Antique Gold Divider Accent */}
      <div className={cn('flex items-center gap-2 pt-2', align === 'center' ? 'justify-center' : 'justify-start')}>
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
        <div className="w-1.5 h-1.5 rotate-45 border border-gold-400/80 bg-gold-500/30" />
        <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />
      </div>
    </div>
  );
}

