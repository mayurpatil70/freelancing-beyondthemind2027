import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBannerProps {
  badge?: string;
  text: string;
  link?: string;
}

export function AnnouncementBanner({ badge = 'Retreat Update', text, link }: AnnouncementBannerProps) {
  return (
    <aside data-announcement aria-label="Retreat Announcement" className="relative z-50 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 border-b border-gold-500/25 py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 text-xs flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[10px] tracking-wider uppercase font-semibold border border-gold-500/30">
          <Sparkles className="w-2.5 h-2.5 text-gold-400" />
          {badge}
        </span>
        <span className="text-ivory-100 font-light tracking-wide">{text}</span>
        {link && (
          <Link
            href={link}
            className="inline-flex items-center gap-1 text-gold-300 hover:text-gold-200 font-medium underline underline-offset-4 decoration-gold-400/50 hover:decoration-gold-300 transition-colors ml-1"
          >
            <span>Learn More</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </aside>
  );
}

