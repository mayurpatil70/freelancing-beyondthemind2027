import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import {
  Home,
  Users,
  Utensils,
  BookOpen,
  Car,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { LanguageNote } from '@/components/retreat/LanguageNote';

export const metadata: Metadata = {
  title: 'Participation & Accommodation Inclusions | Beyond the Mind 2027',
  description:
    'Overview of retreat participation options for Beyond the Mind 2027 in Rishikesh, including private room, twin sharing, sattvic dining, and retreat materials.',
};

export default function ParticipationPage() {
  const participationTiers = [
    {
      title: 'Private Sanctuary Room',
      subtitle: 'Single Occupancy Accommodation',
      description:
        'A tranquil private room designed for deep individual contemplation and undisturbed rest between intensive meditative processes.',
      inclusions: [
        'Single private room with en-suite bath',
        'Four days of retreat sessions with Pradeep Sir',
        'All nourishing sattvic vegetarian meals & teas',
        'Retreat initiation materials & journal',
        'Direct personal energetic check-ins',
      ],
      statusNote: 'Enquiry-based availability • Limited single rooms',
    },
    {
      title: 'Shared Sanctuary Room',
      subtitle: 'Twin-Sharing Accommodation',
      description:
        'Share comfortable accommodations with a fellow retreat participant or come with a friend or partner to share the sacred experience.',
      inclusions: [
        'Twin-sharing room with separate beds & en-suite bath',
        'Four days of retreat sessions with Pradeep Sir',
        'All nourishing sattvic vegetarian meals & teas',
        'Retreat initiation materials & journal',
        'Shared communal kinship & reflection',
      ],
      statusNote: 'Enquiry-based availability • Popular option',
    },
    {
      title: 'Non-Residential Seeker',
      subtitle: 'Day Attendance Participation',
      description:
        'Ideal for seekers who have arranged their own accommodations in Rishikesh or residents of Uttarakhand attending the daily programme.',
      inclusions: [
        'Full daily access to all retreat sessions & ceremonies',
        'Midday sattvic lunch and evening retreat dinner',
        'Morning & afternoon herbal tea refreshments',
        'Complete retreat materials & ceremony access',
      ],
      statusNote: 'Enquiry-based availability • Subject to venue capacity',
    },
  ];

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Retreat Inclusions
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Participation & Accommodations
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Thoughtfully curated participation options to support peaceful contemplation, sacred rest, and
              wholesome nourishment throughout our four days in Rishikesh.
            </p>
          </div>
        </section>

        {/* Advisory / Inclusions Integrity Note */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-gold-500/25 flex items-start gap-3 text-xs text-stone-subtle/85 font-light leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-gold-300 font-medium">Transparent Booking Guidance:</strong> Exact fees,
              room categories, and tier availability are confirmed directly through our retreat concierge upon
              reviewing your enquiry form. We intentionally do not advertise speculative luxury ratings; our priority
              is authentic spiritual guidance, cleanliness, serenity, and wholesome sattvic nourishment.
            </p>
          </div>
        </div>

        {/* Accommodation & Attendance Tiers */}
        <div className="pb-10">
          <LanguageNote />
        </div>

        <section className="py-8 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {participationTiers.map((tier, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 flex flex-col justify-between shadow-xl space-y-6 hover:border-gold-400/50 transition-colors"
              >
                <div className="space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                    {tier.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl text-ivory-50 font-medium">{tier.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                    {tier.description}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-emerald-800/50">
                    <span className="text-xs uppercase tracking-wider text-gold-300 font-semibold block">
                      Included In Sanctuary:
                    </span>
                    {tier.inclusions.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-ivory-100 font-light">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gold-500/15 space-y-3">
                  <span className="text-[11px] text-gold-300/80 block font-medium">
                    {tier.statusNote}
                  </span>
                  <Link
                    href={`/register?programme=${encodeURIComponent(tier.title)}`}
                    className="w-full py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-wider uppercase text-center block hover:scale-102 transition-all shadow-sm"
                  >
                    Enquire For Availability
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Dining & Atmosphere Features */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#07261F]/40 border border-gold-500/20 space-y-8">
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 text-center font-light">
              Nourishment for Body & Spirit
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-gold-500/15 space-y-2">
                <Utensils className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif text-lg text-ivory-100 font-medium">Pure Sattvic Dining</h4>
                <p className="text-xs text-stone-subtle/80 font-light leading-relaxed">
                  Carefully prepared fresh vegetarian meals designed to keep the digestive tract calm and subtle
                  energy channels responsive.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-gold-500/15 space-y-2">
                <BookOpen className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif text-lg text-ivory-100 font-medium">Retreat Manual & Journal</h4>
                <p className="text-xs text-stone-subtle/80 font-light leading-relaxed">
                  Supplied guidance materials to document energetic insights, inner child revelations, and
                  meditation reflections.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-gold-500/15 space-y-2">
                <HelpCircle className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif text-lg text-ivory-100 font-medium">Dietary Accommodations</h4>
                <p className="text-xs text-stone-subtle/80 font-light leading-relaxed">
                  Vegan, gluten-free, or special medical dietary needs can be noted during registration and accommodated
                  by our kitchen team.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

