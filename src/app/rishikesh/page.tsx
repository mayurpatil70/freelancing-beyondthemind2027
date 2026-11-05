import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MapPin, Sparkles, Sun, Compass, Waves, Mountain, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rishikesh Destination Storytelling | Beyond the Mind 2027',
  description:
    'Discover the spiritual sanctity of Rishikesh, Uttarakhand — the yoga capital of the world, where the sacred Ganges flows from the Himalayan peaks.',
};

export default function RishikeshPage() {
  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              The Sacred Cradle
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Rishikesh, Uttarakhand
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Where the majestic Garhwal Himalayas meet the crystalline flow of the holy Ganges.
              A sanctuary sanctified by centuries of silent meditation.
            </p>
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
                  confirmed participants prior to arrival.
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
                frenzy, creating ideal acoustic and atmospheric conditions for deep trance and relaxation.
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

          {/* Travel Assistance CTA */}
          <div className="text-center pt-8 border-t border-gold-500/20">
            <Link
              href="/reach"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
            >
              <span>Learn How to Reach Rishikesh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

