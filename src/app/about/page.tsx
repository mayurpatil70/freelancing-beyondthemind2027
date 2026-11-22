import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getSiteSettings } from '@/lib/storage/store';
import { Heart, Compass, ShieldCheck, ArrowRight, Sun, Award, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About the Retreat & Spiritual Guidance | Beyond the Mind 2027',
  description:
    'Discover the vision, sacred philosophy, and personal guidance behind Beyond the Mind 2027 in Rishikesh. An experiential sanctuary guided by Pradeep Muthukulam under Moola Brahman.',
};

export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const guideName = settings.guide_name || 'Pradeep Muthukulam';
  const guideHeadline = settings.guide_headline || `${guideName} – A Journey Towards Inner Awakening`;
  const headlineTail = guideHeadline.split(/\s[–-]\s/).slice(1).join(' – ');
  const bioParagraphs = (settings.guide_bio || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Editorial Hero Header */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              The Sacred Origin
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              A Living Sanctuary for Inner Awakening
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Beyond the Mind was born from a singular spiritual calling: to provide a pure, grounded, and
              transformative crucible where modern seekers can reconnect with the Infinite within.
            </p>
          </div>
        </section>

        {/* Philosophy & Meaning — Warm Ivory Editorial Magazine Section */}
        <section className="py-24 bg-[#05201a] text-ivory-100 mandala-section">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <SectionHeading
              eyebrow="The Essence"
              title="The Meaning Behind &lsquo;Beyond the Mind&rsquo;"
              subtitle="Transcending cognitive identification to rest in pure unconditioned presence."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5 text-sm sm:text-base text-ivory-200/80 leading-relaxed font-light">
                <p>
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
                <p>
                  Through meditation, deep awareness and transformative inner practices, we begin to move beyond the
                  limitations of conditioned thought and rediscover the stillness that has always existed within us. As
                  the layers of emotional conditioning gradually dissolve, a deeper connection with our true essence
                  emerges. Beyond the Mind is an invitation to experience life from a space of inner freedom, expanded
                  consciousness and profound peace.
                </p>
              </div>

              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] border border-gold-600/30 shadow-xl">
                <Image
                  src="/images/rishikesh/stillness-ganges.jpg"
                  alt="Stillness by the mountains"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gold-500/20">
              <div className="p-6 rounded-2xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-3">
                <Compass className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif text-lg text-ivory-50 font-semibold">Direct Experience</h4>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  Focusing on tangible energetic and somatic shifts rather than philosophical theorizing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-3">
                <Heart className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif text-lg text-ivory-50 font-semibold">Compassionate Space</h4>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  A tender, judgment-free field where inner child wounds and grief can safely emerge and resolve.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-3">
                <Sun className="w-6 h-6 text-gold-400" />
                <h4 className="font-serif text-lg text-ivory-50 font-semibold">Grounded Awakening</h4>
                <p className="text-xs text-ivory-200/70 leading-relaxed">
                  Harmonizing the subtle spiritual channels with practical daily living in modern society.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guidance by Pradeep Muthukulam */}
        <section className="py-24 sm:py-32 bg-[#031713] text-[#FAF8F5] relative">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <SectionHeading
              eyebrow="Spiritual Guide & Founder"
              title={guideHeadline}
              subtitle="Devoted to the timeless wisdom of spirituality, self-realisation and the awakening of inner consciousness."
            />

            <div className="rounded-3xl bg-[#07261F]/80 border border-gold-500/30 p-8 sm:p-12 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-gold-400/80 shadow-gold-md shrink-0">
                  <Image
                    src="/images/brand/pradeep-muthukulam.jpg"
                    alt="Pradeep Muthukulam - Lead Spiritual Guide"
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 text-center md:text-left">
                  <span className="text-xs tracking-widest uppercase text-gold-400 font-semibold block">
                    Spiritual Guide & Founder
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">{guideName}</h3>
                  {headlineTail && (
                    <h4 className="font-serif text-lg text-gold-300 italic font-normal">{headlineTail}</h4>
                  )}
                  {bioParagraphs.length > 0 ? (
                    bioParagraphs.map((p, i) => (
                      <p key={i} className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                        {p}
                      </p>
                    ))
                  ) : (
                  <>
                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    Pradeep Muthukulam is a seeker and spiritual guide devoted to the timeless wisdom of spirituality, self-realisation and the awakening of inner consciousness. His vision is to inspire individuals to journey beyond the boundaries of the mind, reconnect with their true essence and discover the profound peace, wisdom and divinity that reside within.
                  </p>
                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    Through spiritual insights, meditation and personal guidance, he encourages seekers to embrace a life of mindfulness, awareness, compassion and higher purpose. His philosophy rests on a simple yet profound truth: <em>The Divine is not something to be found outside, but a truth to be awakened within.</em>
                  </p>
                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    His endeavour is to guide every seeker towards inner transformation, spiritual clarity and the ultimate experience of inner peace.
                  </p>
                  </>
                  )}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-950/70 border border-gold-500/20 text-xs sm:text-sm text-stone-subtle/90 leading-relaxed font-light space-y-2 text-center md:text-left">
                <p className="text-sm sm:text-base text-ivory-100 font-light">
                  &ldquo;The Divine is not something to be found outside, but a truth to be awakened within.&rdquo;
                </p>
                <span className="text-[11px] text-gold-400 uppercase tracking-widest block font-medium">
                  — Pradeep Muthukulam, Beyond the Mind
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link
                href="/register"
                prefetch={true}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                <span>Reserve Your Place with Pradeep Muthukulam</span>
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

