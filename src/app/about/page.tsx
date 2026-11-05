import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Sparkles, Heart, Compass, ShieldCheck, ArrowRight, Sun, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Retreat & Spiritual Guidance | Beyond the Mind 2027',
  description:
    'Discover the vision, sacred philosophy, and personal guidance behind Beyond the Mind 2027 in Rishikesh. An experiential sanctuary guided by Pradeep Sir under Moola Brahman.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Editorial Hero Header */}
        <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              The Sacred Origin
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              A Living Sanctuary for Inner Awakening
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Beyond the Mind was born from a singular spiritual calling: to provide a pure, grounded, and
              transformative crucible where modern seekers can reconnect with the Infinite within.
            </p>
          </div>
        </section>

        {/* Philosophy & Meaning — Warm Ivory Editorial Magazine Section */}
        <section className="py-24 bg-[#FAF8F5] text-[#191D19]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <SectionHeading
              light
              eyebrow="The Essence"
              title="The Meaning Behind &lsquo;Beyond the Mind&rsquo;"
              subtitle="Transcending cognitive identification to rest in pure unconditioned presence."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5 text-sm sm:text-base text-stone-700 leading-relaxed font-light">
                <p className="font-serif text-xl sm:text-2xl text-[#031713] leading-snug">
                  The mind is an extraordinary instrument for navigating the external world, yet it was never
                  designed to be our ultimate master.
                </p>
                <p>
                  When identity becomes entangled with repetitive narratives, old trauma, and ambient anxiety,
                  we lose contact with our intrinsic inner majesty. Beyond the Mind signifies crossing the threshold
                  from restless mental turbulence into the luminous silence that witnesses all things.
                </p>
                <p>
                  In this space, healing is not an aggressive struggle to &lsquo;fix&rsquo; oneself; it is the natural
                  unfurling of wholeness when tension is safely surrendered.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-gold-600/30 shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=80"
                  alt="Stillness by the mountains"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-stone-200">
              <div className="p-6 rounded-2xl bg-white border border-gold-600/20 shadow-sm space-y-3">
                <Compass className="w-6 h-6 text-gold-700" />
                <h4 className="font-serif text-lg text-[#031713] font-semibold">Direct Experience</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Focusing on tangible energetic and somatic shifts rather than philosophical theorizing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gold-600/20 shadow-sm space-y-3">
                <Heart className="w-6 h-6 text-gold-700" />
                <h4 className="font-serif text-lg text-[#031713] font-semibold">Compassionate Space</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  A tender, judgment-free field where inner child wounds and grief can safely emerge and resolve.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gold-600/20 shadow-sm space-y-3">
                <Sun className="w-6 h-6 text-gold-700" />
                <h4 className="font-serif text-lg text-[#031713] font-semibold">Grounded Awakening</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Harmonizing the subtle spiritual channels with practical daily living in modern society.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guidance by Pradeep Sir & Moola Brahman */}
        <section className="py-24 sm:py-32 bg-[#031713] text-[#FAF8F5] relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <SectionHeading
              eyebrow="Spiritual Mentorship"
              title="Guidance by Pradeep Sir"
              subtitle="Quiet mastery, energetic precision, and compassionate personal stewardship."
            />

            <div className="rounded-3xl bg-[#07261F]/80 border border-gold-500/30 p-8 sm:p-12 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-gold-400/60 shadow-gold-sm shrink-0">
                  <Image
                    src="/images/brand/logo.jpg"
                    alt="Beyond the Mind Spiritual Vision"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>

                <div className="space-y-4 text-center md:text-left">
                  <span className="text-xs tracking-widest uppercase text-gold-400 font-semibold block">
                    Lead Spiritual Guide & Founder
                  </span>
                  <h3 className="font-serif text-3xl text-ivory-50 font-light">Pradeep Sir</h3>
                  <p className="text-sm text-stone-subtle/85 font-light leading-relaxed">
                    Under the spiritual canopy of Moola Brahman, Pradeep Sir guides seekers with clarity,
                    reverence, and an unwavering commitment to safe energetic evolution. With deep attunement
                    to the Maha Theerthas, subtle Kundalini channels, and the Shiva Mandala, his role is not to
                    command, but to hold the sacred field wherein each soul remembers its innate divinity.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/70 border border-gold-500/20 text-xs sm:text-sm text-stone-subtle/90 leading-relaxed font-light space-y-3">
                <p>
                  &ldquo;A true retreat is not an escape from life, but an arrival into life. When you awaken the
                  vastness within, the same world looks luminous.&rdquo;
                </p>
                <span className="text-[11px] text-gold-400 uppercase tracking-widest block font-medium">
                  — Guidance Principle, Beyond the Mind
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                <span>Reserve Your Place with Pradeep Sir</span>
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

