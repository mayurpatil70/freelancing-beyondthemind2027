import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ProgrammeTimeline } from '@/components/programme/ProgrammeTimeline';
import { getProgramme } from '@/lib/storage/store';
import { Sparkles, Calendar, Languages, ShieldCheck, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Four-Day Divine Programme (Oct 6–9, 2027) | Beyond the Mind',
  description:
    'Experience the four-day spiritual journey of Beyond the Mind 2027 in Rishikesh. From sacred Pooja Veppu dedication to the expansive Shiva Mandala.',
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Four-Day Divine Timetable
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Four Days of Sacred Transformation
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Wednesday, October 6 to Saturday, October 9, 2027 in Rishikesh, Uttarakhand.
              A deliberately paced journey designed to lead consciousness beyond ordinary cognitive limits.
            </p>
          </div>
        </section>

        {/* Detailed Timeline Component */}
        <section className="py-12 pb-28 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <ProgrammeTimeline days={programme} showCta={false} />

          {/* Registration Bottom Callout */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 text-center space-y-6 shadow-2xl">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              October 6–9, 2027
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
              Secure Your Place in the Four-Day Circle
            </h3>
            <p className="text-sm text-stone-subtle/85 font-light max-w-xl mx-auto leading-relaxed">
              We maintain a limited sanctuary circle to ensure personal guidance and unhurried experiential attention.
            </p>
            <div className="pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                <span>Register for Beyond the Mind 2027</span>
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

