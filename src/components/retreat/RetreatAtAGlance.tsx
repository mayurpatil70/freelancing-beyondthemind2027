'use client';

import React from 'react';
import { Calendar, MapPin, Languages, Users, Video, Sparkles, Utensils } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCMS } from '@/contexts/CMSContext';

interface Props {
  dates?: string;
  location?: string;
  meditationDays?: string;
  meditationTime?: string;
  className?: string;
}

export function RetreatAtAGlance({ dates: propDates, location: propLocation, className }: Props) {
  const { settings } = useCMS();
  const dates = settings?.retreat_dates || propDates || 'Oct 6–9, 2027';
  const location = settings?.retreat_location || propLocation || 'Rishikesh';

  const items = [
    { icon: Calendar, label: 'Dates', value: dates, note: 'Arrival: Oct 5' },
    { icon: Video, label: 'Mode', value: 'Offline & Online', note: 'Rishikesh & Live Stream' },
    { icon: MapPin, label: 'Location', value: location, note: 'Garhwal Himalayan foothills' },
    { icon: Languages, label: 'Languages', value: 'English & Malayalam', note: 'Hindi translation is available upon request' },
    { icon: Users, label: 'Guided by', value: 'Pradeep Muthukulam', note: 'Curated intimate circle' },
    { icon: Sparkles, label: 'Guidance', value: 'Personal Guidance Sessions', note: 'Available by Appointment' },
    { icon: Utensils, label: 'Cuisine', value: 'Strictly Vegetarian Cuisine', note: 'Throughout the Retreat' },
  ];

  return (
    <section aria-label="Retreat at a glance" className={cn('relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      <div className="rounded-3xl border border-gold-500/25 bg-[#07261F]/70 backdrop-blur-xl shadow-emerald-deep">
        <div className="flex items-center justify-center gap-3 pt-6">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold-400 font-semibold">Retreat at a glance</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>
        <dl className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-px p-6 pt-4">
          {items.map(({ icon: Icon, label, value, note }, idx) => (
            <div
              key={label}
              className={cn(
                'flex flex-col items-center text-center gap-1.5 px-2.5 py-4 min-w-0 transition-all hover:bg-gold-500/5 rounded-2xl',
                idx === items.length - 1 ? 'col-span-2 sm:col-span-1' : ''
              )}
            >
              <Icon className="w-4 h-4 text-gold-400 shrink-0" aria-hidden="true" />
              <dt className="text-[10px] tracking-[0.25em] uppercase text-ivory-200/60 font-medium">{label}</dt>
              <dd className="font-serif text-lg sm:text-xl text-ivory-50 leading-tight">{value}</dd>
              <dd className="text-[11px] text-gold-300/80 leading-snug">{note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
