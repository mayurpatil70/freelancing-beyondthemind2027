import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProgrammeTimeline } from '@/components/programme/ProgrammeTimeline';
import { getProgramme } from '@/lib/storage/store';
import { Calendar, Languages, ShieldCheck, ArrowRight, Sun, Shirt } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Retreat Timetable (Arrival Oct 5 at 2:45 PM • Sessions Oct 6–9, 2027) | Beyond the Mind',
  description:
    'Detailed retreat schedule for Beyond the Mind 2027 in Rishikesh. Arrival on Tuesday, October 5 at 2:45 PM, followed by four days of sacred sessions from Stress Buster to Shiva Mandala.',
};

export default async function ProgrammePage() {
  const programme = await getProgramme();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Retreat Timetable & Progression
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Order of Program
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Arrival in Rishikesh on <strong>Tuesday, October 5, 2027 at 2:45 PM</strong>. Intensive sessions run across four days from <strong>Wednesday, October 6 to Saturday, October 9, 2027</strong>.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gold-300">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Sanctuary Arrival: Oct 5 at 2:45 PM</span>
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>English (Hindi Translation Available)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Detailed Timeline Component */}
        <section className="py-12 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <ProgrammeTimeline days={programme} showCta={false} />

          {/* Weather & Clothes Guidance Note */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#07261F]/70 border border-gold-500/25 space-y-4">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-gold-400" />
              <h4 className="font-serif text-lg text-ivory-50 font-medium">
                Weather & Clothes Required During Retreat Days
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
              October brings crystal-clear autumn skies to Rishikesh. Expect comfortable warm daytime temperatures around <strong>28°C–30°C</strong> and cool, crisp mornings and evenings around <strong>15°C–18°C</strong>. Please pack comfortable, loose cotton/linen clothing for meditation postures (modest attire covering shoulders and knees), easy slip-on sandals, and a light woolen shawl or cardigan for early morning and evening riverside sessions.
            </p>
          </div>

          {/* Registration Bottom Callout */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 text-center space-y-6 shadow-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Sanctuary Reservation
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
              Secure Your Place in the Four-Day Circle
            </h3>
            <p className="text-sm text-stone-subtle/85 font-light max-w-xl mx-auto leading-relaxed">
              We maintain a limited sanctuary circle to ensure personal guidance and unhurried experiential attention. Available in both offline (in-person at Rishikesh) and online live streaming modes.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                <span>Register for Beyond the Mind 2027</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/daily-meditation"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
              >
                <span>Explore Daily Guided Meditation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
