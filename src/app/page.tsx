import React from 'react';
import type { Metadata } from 'next';
import { withCmsKeywords } from '@/lib/seo/keywords';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MandalaHero } from '@/components/hero/MandalaHero';
import { HeroNoticeCard } from '@/components/hero/HeroNoticeCard';
import { RetreatAtAGlance } from '@/components/retreat/RetreatAtAGlance';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { ExperiencesHomeGrid } from '@/components/experiences/ExperiencesHomeGrid';
import { RishikeshPhotoGrid } from '@/components/rishikesh/RishikeshPhotoGrid';
import { ProgrammeTimeline } from '@/components/programme/ProgrammeTimeline';
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel';
import {
  getSiteSettings,
  getExperiences,
  getHealingSessions,
  getProgramme,
  getTestimonials,
} from '@/lib/storage/store';
import { loadBlog } from '@/lib/blog';
import { PostCard } from '@/components/blog/BlogParts';
import {
  MapPin,
  ArrowRight,
  Video,
  Clock,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
  Calendar,
  Languages,
} from 'lucide-react';

export const revalidate = 300;

// Home keywords come from the admin SEO tab; without any, the root layout's keywords apply.
export function generateMetadata(): Promise<Metadata> {
  return withCmsKeywords({}, 'home', '/');
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const experiences = await getExperiences();
  const healingSessions = [...(await getHealingSessions())].sort((a, b) => a.order - b.order);
  const programme = await getProgramme();
  const testimonials = await getTestimonials();
  const blog = await loadBlog();
  const latestPosts = blog.posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">

      {/* Premium Floating Navigation */}
      <Navbar syncWithHeroIntro />

      <main>
        <MandalaHero
          title={settings.hero_title}
          subtitle={settings.hero_subtitle}
          tagline={settings.hero_tagline}
          dates={settings.retreat_dates}
          location={settings.retreat_location}
          videoUrl={settings.video_url || undefined}
        />

        <HeroNoticeCard notice={settings.hero_notice_card} />

        <RetreatAtAGlance
          className="pt-12 sm:pt-16"
          dates={settings.retreat_dates}
          location={settings.retreat_location}
        />

        {/* ========================================================================= */}
        {/* SECTION 3: RETREAT INTRODUCTION (EDITORIAL & PHILOSOPHY) */}
        {/* ========================================================================= */}
        <section className="relative py-24 sm:py-32 bg-[#05201a] text-ivory-100 mandala-section overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="The Philosophy"
              title="Beyond the Noise. Beyond the Ordinary. Beyond the Mind."
              subtitle="An invitation to step away from repetitive cognitive cycles and experience the pristine silence of your own essential nature."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Imagery Feature (LEFT SIDE on Desktop) */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-2xl aspect-[4/5] group">
                  <Image
                    src="/images/rishikesh/meditation-himalayas.jpg"
                    alt="Meditation along the Holy Ganges in the Sacred Foothills of Rishikesh"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#031713]/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                    <span className="text-[10px] tracking-widest uppercase text-gold-300 font-semibold block">
                      Rishikesh Sanctuary
                    </span>
                    <p className="text-sm sm:text-base text-ivory-50 font-light mt-0.5">
                      Where the sacred river carries the breath of the Himalayas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Editorial Prose (RIGHT SIDE on Desktop) */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6 text-sm sm:text-base leading-relaxed text-ivory-200/90 font-light">
                <p>
                  Modern life draws us into a constant cycle of thinking, anticipating and reacting, keeping us immersed in the activity of the mind. In the sacred foothills of Rishikesh, where the holy Ganges flows from the majestic Himalayas, Beyond the Mind offers a space to pause, turn inward and reconnect with the deeper dimensions of your being.
                </p>

                <p className="leading-relaxed">
                  Guided by Pradeep Muthukulam, Beyond the Mind is an invitation to move beyond intellectual understanding and discover spirituality through direct experience.
                </p>

                <p className="leading-relaxed">
                  More than a conventional meditation programme or physical practice, it is an experiential journey into inner stillness, subtle energy awareness and emotional liberation. Through guided practices and transformative experiences, participants are invited to explore the silence within, deepen their consciousness and discover a more profound connection with their true essence.
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-normal">
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-gold-600/30">
                    <span className="font-serif text-sm font-semibold text-ivory-50 block">
                      Authentic Transmission
                    </span>
                    <span className="text-ivory-200/80 mt-1 block">
                      Direct, grounded experiential methods without dogmatic constraints.
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-gold-600/30">
                    <span className="font-serif text-sm font-semibold text-ivory-50 block">
                      Intimate Circle
                    </span>
                    <span className="text-ivory-200/80 mt-1 block">
                      Carefully curated cohort ensuring attentive personal energetic support.
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/about"
                    prefetch={true}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-gold-300 hover:text-gold-200 transition-colors"
                  >
                    <span>Read The Complete Philosophy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: SEVEN RETREAT SESSIONS */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#031713] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gold-radial opacity-20 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              eyebrow="The Journey Within"
              title="Seven Retreat Sessions"
              subtitle="The exact experiential progression of Beyond the Mind 2027 — from somatic stress release to transcendental stillness."
            />

            <ExperiencesHomeGrid initialExperiences={experiences} />

            <div className="text-center mt-14">
              <Link
                href="/experiences"
                prefetch={true}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 hover:from-gold-500 hover:via-gold-400 hover:to-gold-600 hover:text-emerald-950 text-gold-300 transition-all shadow-gold-sm"
              >
                <span>Discover All Seven Retreat Sessions & Attractions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4b: TRANSFORMATIVE HEALING SESSIONS (individual, by appointment) */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-28 bg-[#02100d] border-t border-gold-500/20 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              eyebrow="Individual Sessions • By Appointment"
              title="Transformative Healing Sessions"
              subtitle="A collection of specialised healing sessions designed to support inner balance, emotional release and profound personal transformation."
            />

            {healingSessions.length > 0 && (
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {healingSessions.map((s) => (
                  <li key={s.id}>
                    <Link
                      href={`/healing-sessions/${s.slug}`}
                      prefetch={true}
                      className="group flex items-start gap-4 h-full p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/25 hover:border-gold-400/60 transition-colors"
                    >
                      <span className="w-10 h-10 shrink-0 rounded-full bg-[#031713] border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold">
                        {String(s.order).padStart(2, '0')}
                      </span>
                      <span className="min-w-0 space-y-1">
                        <span className="block font-serif text-xl text-ivory-50 leading-tight group-hover:text-gold-200 transition-colors">
                          {s.title}
                        </span>
                        <span className="block text-sm text-stone-subtle/85 font-light leading-relaxed">
                          {s.subtitle}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            <div className="text-center mt-14">
              <Link
                href="/healing-sessions"
                prefetch={true}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 hover:from-gold-500 hover:via-gold-400 hover:to-gold-600 hover:text-emerald-950 text-gold-300 transition-all shadow-gold-sm"
              >
                <span>Explore Transformative Healing Sessions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: FOUR DAYS OF TRANSFORMATION (Arrival Oct 5) */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#07261F]/60 border-y border-gold-500/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Arrival: Oct 5, 2027 • Sessions: Oct 6–9"
              title="Four Days of Transformation"
              subtitle="Arrive on October 5 for sanctuary check-in, orientation, and Ganga acclimatization, followed by four days of progressive spiritual sessions."
            />

            <ProgrammeTimeline days={programme} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 6: A SANCTUARY IN RISHIKESH */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#031713] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gold-400" />
                  <span>Rishikesh, Uttarakhand, India</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-5xl text-ivory-50 font-light leading-tight">
                  Where the Mountains Meet Stillness
                </h2>

                <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed">
                  For millennia, sages, yogis, and seekers from every continent have walked the banks of the
                  Ganges in Rishikesh to touch something sacred. The crisp Himalayan air carries a natural stillness
                  that quiets the human nervous system before words are spoken.
                </p>

                <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed">
                  Beyond the Mind gathers in this timeless cradle of spiritual illumination. Away from commercial
                  commotion, we immerse ourselves in the pure currents of Ganga and the quiet majesty of the
                  Garhwal mountain ridges.
                </p>

                <div className="pt-2">
                  <Link
                    href="/rishikesh"
                    prefetch={true}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 text-gold-300 hover:bg-gold-500 hover:text-emerald-950 transition-all"
                  >
                    <span>Discover Rishikesh Destination</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <RishikeshPhotoGrid />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: DAILY GUIDED MEDITATION (Regular Activity of Beyond the Mind) */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#05201a] text-ivory-100 mandala-section relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Regular Ongoing Practice"
              title="Daily Meditation - A Journey Within"
              subtitle="Meditation is an invitation to move beyond the constant activity of the mind and discover the stillness within."
            />

            <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-600/30 p-8 sm:p-12 shadow-xl space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-gold-500/20 pb-8">
                <div className="space-y-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">Mode</span>
                  <span className="font-serif text-xl font-medium text-ivory-50 h-8 flex items-center justify-center">Online</span>
                  <span className="text-[11px] text-gold-300/80 block">Live from anywhere</span>
                </div>
                <div className="space-y-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">Timings</span>
                  <span className="font-serif text-xl font-medium text-ivory-50 h-8 flex items-center justify-center lining-nums tabular-nums [font-feature-settings:'lnum'_1]">7:30 PM IST</span>
                  <span className="text-[11px] text-gold-300/80 block">Monday to Friday</span>
                </div>
                <div className="space-y-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">Session Fee</span>
                  <span className="font-serif text-xl font-medium text-ivory-50 h-8 flex items-center justify-center">Paid Sessions</span>
                  <span className="text-[11px] text-gold-300/80 block">Details on enquiry</span>
                </div>
                <div className="space-y-1 flex flex-col items-center">
                  <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">Platform</span>
                  <span className="font-serif text-xl font-medium text-ivory-50 h-8 flex items-center justify-center">Zoom</span>
                  <span className="text-[11px] text-gold-300/80 block">Link sent after joining</span>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-ivory-200/90 leading-relaxed font-light">
                <p>
                  &ldquo;Meditation is an invitation to move beyond the constant activity of the mind and discover the stillness within.&rdquo;
                </p>
                <p>
                  Through regular guided meditation sessions, Beyond the Mind encourages individuals to cultivate awareness, explore inner silence and deepen their understanding of themselves.
                </p>
                <p>
                  Whether you are beginning your meditation journey or have an established practice, these sessions offer an opportunity to pause, observe and reconnect with your inner being.
                </p>
                <div className="pt-2 text-center">
                  <span className="inline-block px-5 py-2 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 font-serif tracking-[0.2em] text-sm uppercase">
                    Pause. Observe. Transcend.
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/daily-meditation"
                  prefetch={true}
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase hover:scale-[1.03] transition-all text-center shadow-md"
                >
                  Learn More & View Benefits
                </Link>
                <a
                  href="https://wa.me/918075572018?text=Namaste%20Beyond%20the%20Mind%20Team%2C%20I%20would%20like%20to%20enquire%20about%20joining%20the%20Monday%E2%80%93Friday%207%3A30%20PM%20Daily%20Guided%20Meditation%20sessions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3 rounded-full border border-gold-500/50 text-gold-300 hover:text-white hover:bg-gold-500/20 font-semibold text-xs tracking-widest uppercase transition-all text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7.5: THE SPIRITUAL GUIDE & FOUNDER */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#05201a] text-ivory-100 mandala-section relative overflow-hidden border-t border-gold-500/20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <SectionHeading
              eyebrow="Spiritual Guide & Founder"
              title="Pradeep Muthukulam – A Journey Towards Inner Awakening"
              subtitle="Devoted to the timeless wisdom of spirituality, self-realisation and the awakening of inner consciousness."
            />

            <div className="rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-500/30 p-8 sm:p-12 shadow-2xl space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full overflow-hidden border-2 border-gold-400/80 shadow-gold-md shrink-0">
                  <Image
                    src="/images/brand/pradeep-muthukulam.jpg"
                    alt="Pradeep Muthukulam - Spiritual Guide & Founder"
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-4 text-center md:text-left">
                  <span className="text-xs tracking-widest uppercase text-gold-400 font-semibold block">
                    Spiritual Guide & Founder
                  </span>
                  <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
                    Pradeep Muthukulam
                  </h3>
                  <h4 className="font-serif text-lg text-gold-300 italic font-normal">
                    A Journey Towards Inner Awakening
                  </h4>
                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    Pradeep Muthukulam is a seeker and spiritual guide devoted to the timeless wisdom of spirituality, self-realisation and the awakening of inner consciousness. His vision is to inspire individuals to journey beyond the boundaries of the mind, reconnect with their true essence and discover the profound peace, wisdom and divinity that reside within.
                  </p>
                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    Through spiritual insights, meditation and personal guidance, he encourages seekers to embrace a life of mindfulness, awareness, compassion and higher purpose. His philosophy rests on a simple yet profound truth: <em>The Divine is not something to be found outside, but a truth to be awakened within.</em>
                  </p>
                  <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                    His endeavour is to guide every seeker towards inner transformation, spiritual clarity and the ultimate experience of inner peace.
                  </p>
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
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 8: TESTIMONIAL SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#031713] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Voices of Transformation"
              title="Seeker Testimonials"
              subtitle="Authentic reflections from participants who walked the sacred journey of Beyond the Mind."
            />

            <TestimonialCarousel testimonials={testimonials.map(({ keywords: _kw, ...t }) => t)} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: DESTINATION & PARTICIPATION SUMMARY */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#031713] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Flagship Sanctuary Summary
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
              The Divine Retreat - Rishikesh 2027
            </h3>
            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Arrival on <strong>Tuesday, October 5, 2027</strong>. Intensive retreat sessions run <strong>October 6–9, 2027</strong> in Rishikesh, Uttarakhand. Sessions and retreat are available in English and Malayalam. Hindi translation is available upon request. Available in both offline (in-person at Rishikesh) and online live streaming modes. Strictly Vegetarian Cuisine Throughout the Retreat.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-gold-300">
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                Arrival: Oct 5, 2027
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                Strictly Vegetarian Cuisine Throughout the Retreat
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                Offline & Online Options
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                English & Malayalam (Hindi translation upon request)
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: FINAL CONVERSION SECTION (Cleaned AI Star) */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-gradient-to-b from-[#07261F] to-[#02100d] text-center relative overflow-hidden border-t border-gold-500/25">
          <div className="absolute inset-0 bg-gold-radial opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/40">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
              Your Invitation
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ivory-50 font-light leading-tight">
              Your Journey Within Begins Here.
            </h2>

            <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed max-w-xl mx-auto">
              Take the first step towards an experience of stillness, reflection and deeper connection. Reserve
              your place in the sacred circle today.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                prefetch={true}
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:via-gold-300 hover:to-gold-500 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                Begin Your Registration
              </Link>
              <Link
                href="/contact"
                prefetch={true}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-950/80 text-gold-300 border border-gold-500/30 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
              >
                Speak with Concierge
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 12: LATEST FROM THE BLOG (Wisdom Beyond the Mind, edited in admin Blog tab) */}
        {/* ========================================================================= */}
        {latestPosts.length > 0 && (
          <section className="py-24 sm:py-28 bg-[#031713] border-t border-gold-500/20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <SectionHeading
                eyebrow="Blog & Journal"
                title="Wisdom Beyond the Mind"
                subtitle="Explore the Journey Within. Insights on meditation, spirituality, consciousness, healing and inner transformation."
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {latestPosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
              <div className="text-center mt-14">
                <Link
                  href="/blog"
                  prefetch={true}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 hover:from-gold-500 hover:via-gold-400 hover:to-gold-600 hover:text-emerald-950 text-gold-300 transition-all shadow-gold-sm"
                >
                  <span>Read All Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}

