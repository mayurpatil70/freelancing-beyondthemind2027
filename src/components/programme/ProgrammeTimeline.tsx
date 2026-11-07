'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ProgrammeDay } from '@/types';
import { Calendar, Clock, ChevronDown, Languages, ArrowRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgrammeTimelineProps {
  days: ProgrammeDay[];
  showCta?: boolean;
}

export function ProgrammeTimeline({ days, showCta = true }: ProgrammeTimelineProps) {
  const [activeDay, setActiveDay] = useState<number>(days.length > 0 ? days[0].day_number : 0);

  return (
    <div className="space-y-10">
      {/* Language & Arrival Arrangement Banner */}
      <div className="p-4 rounded-xl bg-emerald-950/70 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gold-300">
          <Languages className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="font-medium tracking-wide">Language Accommodations:</span>
          <span className="text-ivory-100 font-light">
            Sessions conducted in English, with Hindi translation available for participants who require it.
          </span>
        </div>
        <span className="text-[11px] uppercase tracking-wider text-gold-400 font-medium shrink-0">
          Arrival: Oct 5 (2:45 PM) • Sessions: Oct 6–9, 2027
        </span>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-b border-gold-500/20 pb-4">
        {days.map((day) => {
          const isActive = activeDay === day.day_number;
          return (
            <button
              key={day.day_number}
              type="button"
              onClick={() => setActiveDay(day.day_number)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-widest transition-all duration-300 font-medium',
                isActive
                  ? 'bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold shadow-gold-sm scale-105'
                  : 'bg-emerald-900/40 text-ivory-200/80 hover:text-gold-300 hover:bg-emerald-800/40 border border-gold-500/15'
              )}
            >
              <Calendar className={cn('w-3.5 h-3.5', isActive ? 'text-emerald-950' : 'text-gold-400')} />
              <span>{day.day_name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Day Detail Card */}
      {days
        .filter((d) => d.day_number === activeDay)
        .map((day) => (
          <div
            key={day.day_number}
            className="p-6 sm:p-10 rounded-2xl bg-[#07261F]/70 border border-gold-500/25 shadow-xl animate-in fade-in duration-300 space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gold-500/15">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold-400 block font-medium">
                  {day.formatted_date}
                </span>
                <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light mt-1">
                  {day.theme}
                </h3>
                <p className="text-sm text-gold-200/90 font-light italic mt-1">{day.subtitle}</p>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/30 text-xs text-gold-300 font-medium shrink-0">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                <span>Rishikesh Sanctuary</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-stone-subtle/90 leading-relaxed font-light">
              {day.summary}
            </p>

            {/* Sessions Timeline */}
            <div className="space-y-4 pt-4">
              <h4 className="text-xs uppercase tracking-widest text-gold-400 font-semibold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span>Day Flow & Focus Areas</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {day.sessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-emerald-950/60 border border-gold-500/15 hover:border-gold-500/30 transition-colors space-y-2"
                  >
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-400 px-2 py-0.5 rounded bg-emerald-900/60 inline-block">
                      {session.phase}
                    </span>
                    <h5 className="font-serif text-lg text-ivory-100 font-medium leading-snug">
                      {session.title}
                    </h5>
                    <p className="text-xs text-stone-subtle/80 font-light leading-relaxed">
                      {session.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-stone-subtle/60 italic pt-2">
              Note: Exact hour-by-hour sequence is attuned organically by Pradeep Sir based on group energetic receptivity and atmospheric rhythms.
            </p>
          </div>
        ))}

      {/* Programme CTA */}
      {showCta && (
        <div className="text-center pt-4">
          <Link
            href="/programme"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 hover:from-gold-500 hover:via-gold-400 hover:to-gold-600 hover:text-emerald-950 text-gold-300 transition-all shadow-gold-sm hover:shadow-gold-md"
          >
            <span>Explore Complete Four-Day Journey</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

