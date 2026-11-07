import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getAttractions, getWeatherClothing } from '@/lib/storage/store';
import { MapPin, Sun, Compass, Waves, Mountain, ArrowRight, Calendar, Shirt, CheckCircle2 } from 'lucide-react';
import { AttractionsGrid } from '@/components/rishikesh/AttractionsGrid';

export const metadata: Metadata = {
  title: 'Rishikesh Sanctuary, Attractions & Weather Guide | Beyond the Mind 2027',
  description:
    'Discover Rishikesh, Uttarakhand — holy Ganges, top attractions including bungee jumping and river rafting, October weather, and packing guidance for Beyond the Mind 2027.',
};

export default async function RishikeshPage() {
  const attractions = await getAttractions();
  const weather = await getWeatherClothing();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              The Sacred Cradle
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Rishikesh, Uttarakhand
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Where the majestic Garhwal Himalayas meet the crystalline flow of the holy Ganges.
              A sanctuary sanctified by centuries of silent meditation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gold-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Arrival: October 5, 2027 at 2:45 PM • Sessions: Oct 6–9</span>
              </span>
            </div>
          </div>
        </section>

        {/* Cinematic Image Grid & Storytelling */}
        <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                The Spiritual Epicenter
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light leading-snug">
                The Timeless Tapestry of Tapasya
              </h2>
              <p>
                Rishikesh is not merely a geographic point on the map; it is a profound vibrational field.
                Nestled in the foothills of the Garhwal Himalayas, it has drawn saints, mystics, yogis, and
                seekers since ancient Vedic times.
              </p>
              <p>
                As the Ganges surges forth from the high glacier caves of Gangotri, it enters the plains
                here with pristine vitality. The sheer volume of negative ions, mountain air, and unbroken
                devotional prayer imbues the entire valley with a palpable, quiet reverence.
              </p>
              <div className="p-5 rounded-2xl bg-[#07261F]/80 border border-gold-500/25 text-xs text-gold-200/90 space-y-1">
                <span className="font-serif text-sm text-gold-300 font-medium block">
                  Sanctuary Venue Policy:
                </span>
                <p>
                  To protect retreat peace and privacy, our dedicated sanctuary location is shared privately with
                  confirmed participants prior to arrival on October 5 at 2:45 PM.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-gold-400/40 shadow-2xl">
                <Image
                  src="/images/rishikesh/meditation-ganges.jpg"
                  alt="Meditation beside the Ganges in Rishikesh"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Destination Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#07261F]/60 border border-gold-500/20 space-y-4">
              <Waves className="w-8 h-8 text-gold-400" />
              <h3 className="font-serif text-xl text-ivory-50 font-medium">Mother Ganga</h3>
              <p className="text-xs sm:text-sm text-stone-subtle/80 leading-relaxed font-light">
                The sacred waters act as a natural purifier of subtle bio-fields. Sitting by the riverbanks
                clears psychic heaviness and attunes your inner rhythm to eternal flow.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#07261F]/60 border border-gold-500/20 space-y-4">
              <Mountain className="w-8 h-8 text-gold-400" />
              <h3 className="font-serif text-xl text-ivory-50 font-medium">Garhwal Foothills</h3>
              <p className="text-xs sm:text-sm text-stone-subtle/80 leading-relaxed font-light">
                Surrounded by pine-scented hills, forest sanctuaries, and high ridgelines that block out urban
                frenzy, creating ideal acoustic and atmospheric conditions for deep stillness.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#07261F]/60 border border-gold-500/20 space-y-4">
              <Sun className="w-8 h-8 text-gold-400" />
              <h3 className="font-serif text-xl text-ivory-50 font-medium">Sacred Aarti & Heritage</h3>
              <p className="text-xs sm:text-sm text-stone-subtle/80 leading-relaxed font-light">
                Witness the timeless resonance of evening bell chimes, butter lamps, and Sanskrit chanting
                echoing across the water as dusk descends over the Himalayan riverbend.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* WEATHER & CLOTHES REQUIRED SECTION */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#02100d] border-y border-gold-500/20 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.25em] uppercase font-medium text-gold-400">
                <span className="w-6 h-px bg-gold-400/60 inline-block" />
                <span>October Climate & Packing Guide</span>
                <span className="w-6 h-px bg-gold-400/60 inline-block" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ivory-50 font-light">
                Weather & Clothes Required During Retreat Days
              </h2>
              <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                {weather.summary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Climate Overview Card */}
              <div className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-300">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                      October Atmosphere
                    </span>
                    <h3 className="font-serif text-xl text-ivory-50 font-medium">
                      Pleasant Autumn Conditions
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-gold-500/15 py-4 text-center">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold-400/80 block">Daytime Warmth</span>
                    <span className="font-serif text-2xl text-ivory-50 font-medium">{weather.day_temp}</span>
                    <span className="text-[11px] text-stone-subtle/70 block">Bright & comfortable</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-gold-400/80 block">Night & Morning</span>
                    <span className="font-serif text-2xl text-ivory-50 font-medium">{weather.night_temp}</span>
                    <span className="text-[11px] text-stone-subtle/70 block">Crisp Himalayan breeze</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-ivory-200/90 font-light">
                  {weather.clothing_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to Pack Checklist */}
              <div className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-xl space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-400/40 flex items-center justify-center text-gold-300">
                    <Shirt className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                      Recommended Packing Checklist
                    </span>
                    <h3 className="font-serif text-xl text-ivory-50 font-medium">
                      What to Wear & Bring
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {weather.recommended_items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-emerald-950/60 border border-gold-500/15 flex items-center gap-3 text-xs text-ivory-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-[10px] font-bold shrink-0">
                        0{idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-stone-subtle/75 font-light italic border-t border-gold-500/15 pt-4">
                  Note: Rishikesh is a sacred vegetarian pilgrimage town. Respectful modest attire covering shoulders and knees is strictly requested in ashram and temple premises.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RISHIKESH ATTRACTIONS GRID */}
        {/* ========================================================================= */}
        <section className="py-24 bg-[#031713] relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AttractionsGrid
              attractions={attractions}
              title="Iconic Rishikesh Attractions & Adventures"
              subtitle="From world-famous bungee jumping and white-water rapids to the historic Beatles Ashram and ancient meditation caves — explore what makes Rishikesh unique."
            />
          </div>
        </section>

        {/* Travel Assistance CTA */}
        <section className="py-16 bg-[#02100d] border-t border-gold-500/20 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light">
              Plan Your Journey to Rishikesh
            </h3>
            <p className="text-xs sm:text-sm text-stone-subtle/85 font-light">
              Arrival on Tuesday, October 5, 2027 at 2:45 PM. Connect with our concierge for assistance with airport transfers, train connectivity, and local travel arrangements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/reach"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                <span>Learn How to Reach Rishikesh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
              >
                <span>Register for Retreat</span>
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
