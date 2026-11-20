import React from 'react';
import { Calendar, MapPin, Languages, Clock, Users, Video } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  dates: string;
  location: string;
  meditationDays: string;
  meditationTime: string;
  className?: string;
}

export function RetreatAtAGlance({ dates, location, meditationDays, meditationTime, className }: Props) {
  const items = [
    { icon: Calendar, label: 'Dates', value: 'Oct 6–9, 2027', note: 'Arrival: Oct 5' },
    { icon: Video, label: 'Mode', value: 'Offline & Online', note: 'Rishikesh & Live Stream' },
    { icon: MapPin, label: 'Location', value: location, note: 'Garhwal Himalayan foothills' },
    { icon: Languages, label: 'Languages', value: 'English, Hindi & Malayalam', note: 'All sessions & retreats' },
    { icon: Users, label: 'Guided by', value: 'Pradeep Muthukulam', note: 'Curated intimate circle' },
    { icon: Clock, label: 'Regular Practice', value: 'Daily Meditation', note: `${meditationDays} · ${meditationTime} (Zoom)` },
  ];

  return (
    <section aria-label="Retreat at a glance" className={cn('relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', className)}>
      <div className="rounded-3xl border border-gold-500/25 bg-[#07261F]/70 backdrop-blur-xl shadow-emerald-deep">
        <div className="flex items-center justify-center gap-3 pt-6">
          <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold-500/60" />
          <span className="text-[10px] tracking-[0.4em] uppercase text-gold-400">Retreat at a glance</span>
          <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>
        <dl className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px p-6 pt-4">
          {items.map(({ icon: Icon, label, value, note }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1.5 px-3 py-4 min-w-0">
              <Icon className="w-4 h-4 text-gold-400" aria-hidden="true" />
              <dt className="text-[10px] tracking-[0.25em] uppercase text-ivory-200/60">{label}</dt>
              <dd className="font-serif text-xl text-ivory-50 leading-tight">{value}</dd>
              <dd className="text-[11px] text-gold-300/80 leading-snug">{note}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
