import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SacredExperience } from '@/types';
import { Feather, Flame, Sun, Heart, Compass, Flower2, CircleDot, MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
};

/** A blank line in the admin description starts a new paragraph. */
export function toParagraphs(text: string | undefined): string[] {
  return (text || '')
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, ' ').trim())
    .filter(Boolean);
}

interface HealingSessionsListProps {
  sessions: SacredExperience[];
  whatsappNumber?: string;
  /** True on a session's own page: the title is not a link. */
  single?: boolean;
}

// Same card layout as the seven retreat sessions (alternating photo and text columns).
// Sessions without a photo show a decorative panel with the session's icon until one is uploaded in admin.
export function HealingSessionsList({ sessions, whatsappNumber, single = false }: HealingSessionsListProps) {
  const phone = whatsappNumber || '+91 8075572018';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {sessions.map((session, idx) => {
        const Icon = iconMap[session.icon_name] || CircleDot;
        const isEven = idx % 2 === 1;
        const paragraphs = toParagraphs(session.full_desc);
        const enquiryUrl = formatWhatsAppUrl(
          phone,
          `Namaste, I would like to book a "${session.title}" healing session. Could you share the available appointments and details?`
        );

        return (
          <article
            key={session.id}
            id={session.slug}
            className="scroll-mt-32 p-6 sm:p-10 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-2xl hover:border-gold-400/50 transition-colors"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Media column */}
              <div className={`lg:col-span-5 ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] border border-gold-500/40 shadow-xl bg-[#031713]">
                  {session.image ? (
                    <>
                      <Image
                        src={session.image}
                        alt={session.title}
                        fill
                        unoptimized
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        style={{ objectPosition: session.image_position || 'center' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07261F]/80 via-transparent to-transparent opacity-50" />
                    </>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.22),rgba(7,38,31,0.9)_55%,#031713_100%)]"
                    >
                      <div className="absolute w-[78%] aspect-square rounded-full border border-gold-400/15" />
                      <div className="absolute w-[58%] aspect-square rounded-full border border-gold-400/25" />
                      <div className="absolute w-[38%] aspect-square rounded-full border border-gold-400/35 rotate-45" />
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#031713]/80 border border-gold-400/60 flex items-center justify-center shadow-gold-md">
                        <Icon className="w-9 h-9 sm:w-11 sm:h-11 text-gold-300" strokeWidth={1.25} />
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full bg-[#031713]/90 border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold shadow-lg">
                    {String(session.order).padStart(2, '0')}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-ivory-100 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gold-400/20">
                    <span>Session {session.order}</span>
                    <span className="text-gold-300">By appointment</span>
                  </div>
                </div>
              </div>

              {/* Text column */}
              <div className={`lg:col-span-7 space-y-4 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                {session.spiritual_dimension && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-gold-500/30 text-xs uppercase tracking-wider text-gold-300 font-medium">
                    <Icon className="w-3.5 h-3.5 text-gold-400" />
                    <span>{session.spiritual_dimension}</span>
                  </div>
                )}

                <h2 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light leading-snug">
                  {single ? (
                    session.title
                  ) : (
                    <Link href={`/healing-sessions/${session.slug}`} className="hover:text-gold-200 transition-colors">
                      {session.title}
                    </Link>
                  )}
                </h2>

                {session.subtitle && (
                  <p className="font-serif text-lg sm:text-xl italic text-gold-300 font-light leading-snug">
                    {session.subtitle}
                  </p>
                )}

                <div className="space-y-3">
                  {paragraphs.map((p, i) => (
                    <p key={i} className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href={enquiryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-gold-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Book an Appointment</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
