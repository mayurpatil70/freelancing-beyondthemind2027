import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';
import { HeroVideoPlayer } from '@/components/media/HeroVideoPlayer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ExperienceCard } from '@/components/experiences/ExperienceCard';
import { ProgrammeTimeline } from '@/components/programme/ProgrammeTimeline';
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel';
import {
  getSiteSettings,
  getExperiences,
  getProgramme,
  getTestimonials,
  getGallery,
} from '@/lib/storage/store';
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Video,
  Clock,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 60; // Regenerate at most once per minute

export default async function HomePage() {
  const settings = await getSiteSettings();
  const experiences = await getExperiences();
  const programme = await getProgramme();
  const testimonials = await getTestimonials();
  const gallery = await getGallery();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      {/* Announcement Banner if configured */}
      {settings.announcement_banner?.enabled && (
        <AnnouncementBanner
          badge={settings.announcement_banner.badge}
          text={settings.announcement_banner.text}
          link={settings.announcement_banner.link}
        />
      )}

      {/* Premium Floating Navigation */}
      <Navbar />

      <main>
        {/* ========================================================================= */}
        {/* SECTION 2: CINEMATIC FULL-SCREEN HERO */}
        {/* ========================================================================= */}
        <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
          {/* Dedicated Hero Video / Poster Layer */}
          <div className="absolute inset-0 z-0">
            <HeroVideoPlayer
              videoUrl={settings.video_url}
              posterUrl={settings.poster_url || '/images/rishikesh/meditation-ganges.jpg'}
              fallbackImageUrl="/images/rishikesh/meditation-ganges.jpg"
              overlayOpacity="bg-emerald-950/70"
            />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12 sm:pt-16">
            {/* Official Logo Display (Untouched Aspect Ratio) */}
            <div className="inline-block relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-gold-400/70 shadow-gold-md mb-2">
              <Image
                src="/images/brand/logo.jpg"
                alt="Beyond the Mind 2027 Official Emblem"
                fill
                sizes="112px"
                className="object-contain"
                priority
              />
            </div>

            {/* Date & Location Pill */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-950/80 backdrop-blur-md border border-gold-400/40 text-gold-300 text-xs sm:text-sm font-medium tracking-widest uppercase">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                {settings.retreat_dates}
              </span>
              <span className="text-gold-500/40">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400" />
                {settings.retreat_location}, {settings.retreat_state}
              </span>
            </div>

            {/* Main Editorial Typography */}
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-ivory-50 font-light leading-[1.05]">
                {settings.hero_title}
              </h1>
              <p className="font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.25em] text-gold-300 uppercase font-light">
                {settings.hero_subtitle}
              </p>
              <p className="text-sm sm:text-base md:text-lg text-stone-subtle/90 font-light max-w-2xl mx-auto tracking-wide italic pt-1">
                &ldquo;{settings.hero_tagline}&rdquo;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:via-gold-300 hover:to-gold-500 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                Begin Your Journey
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 text-gold-300 border border-gold-400/50 backdrop-blur-md font-semibold text-xs tracking-widest uppercase transition-all hover:scale-105"
              >
                Explore The Retreat
              </Link>
            </div>

            {/* Subtle Scroll Indicator */}
            <div className="pt-8 flex flex-col items-center justify-center text-stone-subtle/60 text-xs tracking-widest uppercase gap-1 animate-bounce">
              <span className="text-[10px] text-gold-400/80">Descend into Stillness</span>
              <ChevronDown className="w-4 h-4 text-gold-400" />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: RETREAT INTRODUCTION (EDITORIAL) */}
        {/* ========================================================================= */}
        <section className="relative py-24 sm:py-32 bg-[#FAF8F5] text-[#191D19] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              light
              eyebrow="The Philosophy"
              title="Beyond the Noise. Beyond the Ordinary. Beyond the Mind."
              subtitle="An invitation to step away from repetitive cognitive cycles and experience the pristine silence of your own essential nature."
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Editorial Prose */}
              <div className="lg:col-span-7 space-y-6 text-sm sm:text-base leading-relaxed text-[#191D19]/80 font-light">
                <p className="text-lg sm:text-xl font-serif text-[#031713] leading-snug">
                  Modern life conditions us to exist perpetually in the head — calculating, anticipating,
                  and reacting. In the sacred foothills of Rishikesh, where the holy Ganges descends from the
                  Himalayas, we create a sanctuary for your consciousness to soften, drop into the heart, and expand.
                </p>

                <p>
                  Guided by Pradeep Sir and anchored in the spiritual vision of Moola Brahman, Beyond the Mind
                  is not an intellectual study or standard physical exercise regimen. It is an experiential initiation
                  into internal space, subtle energy balance, and emotional liberation.
                </p>

                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-normal">
                  <div className="p-4 rounded-xl bg-ivory-100 border border-gold-600/30">
                    <span className="font-serif text-sm font-semibold text-[#031713] block">
                      Authentic Transmission
                    </span>
                    <span className="text-stone-700 mt-1 block">
                      Direct, grounded experiential methods without dogmatic constraints.
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-ivory-100 border border-gold-600/30">
                    <span className="font-serif text-sm font-semibold text-[#031713] block">
                      Intimate Circle
                    </span>
                    <span className="text-stone-700 mt-1 block">
                      Carefully curated cohort ensuring attentive personal energetic support.
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-emerald-900 hover:text-gold-700 transition-colors"
                  >
                    <span>Read The Complete Philosophy</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Imagery Feature */}
              <div className="lg:col-span-5">
                <div className="relative rounded-3xl overflow-hidden border-2 border-gold-500/40 shadow-xl aspect-[4/5]">
                  <Image
                    src="/images/rishikesh/meditation-ganges.jpg"
                    alt="Meditation beside the Sacred Ganges in Rishikesh"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                    <span className="text-[10px] tracking-widest uppercase text-gold-300 font-semibold block">
                      Rishikesh Sanctuary
                    </span>
                    <p className="font-serif text-base text-ivory-50 mt-0.5">
                      Where the sacred river carries the breath of the Himalayas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: SIX SACRED EXPERIENCES */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#031713] relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gold-radial opacity-20 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <SectionHeading
              eyebrow="The Journey Within"
              title="Six Sacred Experiences"
              subtitle="Progressive dimensions of purification, energetic awakening, and soul wholeness."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>

            <div className="text-center mt-14">
              <Link
                href="/experiences"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 hover:from-gold-500 hover:via-gold-400 hover:to-gold-600 hover:text-emerald-950 text-gold-300 transition-all shadow-gold-sm"
              >
                <span>Discover All Six Spiritual Dimensions</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 5: FOUR DAYS OF TRANSFORMATION */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#07261F]/60 border-y border-gold-500/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="October 6, 7, 8 & 9, 2027"
              title="Four Days of Transformation"
              subtitle="An intentional, progressive timetable from sacred arrival and Pooja Veppu to the boundless Shiva Mandala."
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
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs uppercase tracking-widest font-semibold border border-gold-400/60 text-gold-300 hover:bg-gold-500 hover:text-emerald-950 transition-all"
                  >
                    <span>Discover Rishikesh Destination</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-gold-500/30 shadow-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"
                        alt="Himalayan Foothills Dawn"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden aspect-square border border-gold-500/30 shadow-lg">
                      <Image
                        src="/images/rishikesh/meditation-ganges.jpg"
                        alt="Meditation along Ganga"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-8">
                    <div className="relative rounded-2xl overflow-hidden aspect-square border border-gold-500/30 shadow-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80"
                        alt="Sacred Lamp Aarti"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] border border-gold-500/30 shadow-lg">
                      <Image
                        src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80"
                        alt="Lakshman Jhula Rishikesh"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 7: DAILY GUIDED MEDITATION */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#FAF8F5] text-[#191D19] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              light
              eyebrow="Regular Online Practice"
              title="A Daily Pause. A Deeper Connection."
              subtitle="Sustaining inner quietude between retreats through live daily guided meditation sessions."
            />

            <div className="max-w-4xl mx-auto rounded-3xl bg-[#FFFFFF] border border-gold-600/30 p-8 sm:p-12 shadow-xl space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center border-b border-stone-200 pb-8">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                    Schedule
                  </span>
                  <span className="font-serif text-xl font-medium text-[#031713]">
                    {settings.daily_meditation_days}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                    Session Time
                  </span>
                  <span className="font-serif text-xl font-medium text-[#031713]">
                    {settings.daily_meditation_time}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                    Mode & Platform
                  </span>
                  <span className="font-serif text-xl font-medium text-[#031713]">
                    {settings.daily_meditation_platform}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-stone-700 leading-relaxed font-light">
                <p>
                  True transformation is anchored in steady daily discipline. Join our dedicated community for
                  regular paid guided meditation sessions designed to recalibrate your nervous system, clear
                  daily cognitive fatigue, and deepen the subtle spiritual channels.
                </p>
                <p>
                  Sessions are held online via Zoom. To maintain sanctuary sanctity, private access credentials
                  and registration fees are shared directly upon enquiry.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/daily-meditation"
                  className="w-full sm:w-auto px-7 py-3 rounded-full bg-emerald-950 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all text-center shadow-md"
                >
                  Learn More About Daily Practice
                </Link>
                <a
                  href="https://wa.me/918075572018?text=Namaste%20Beyond%20the%20Mind%20Team%2C%20I%20would%20like%20to%20enquire%20about%20joining%20the%20Monday%E2%80%93Friday%207%3A30%20PM%20Daily%20Guided%20Meditation%20sessions."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3 rounded-full border border-gold-600 text-gold-800 font-semibold text-xs tracking-widest uppercase hover:bg-gold-50 transition-all text-center flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire via WhatsApp</span>
                </a>
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

            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 9: ORIGINAL POSTER SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-[#07261F]/40 border-y border-gold-500/20 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Archival Artwork & Posters"
              title="Official Visual Invitations"
              subtitle="The original artwork and announcements designed for Beyond the Mind."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Poster 1: 2027 Invitation */}
              <div className="group relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-lg bg-[#07261F]">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src="/images/posters/btm2027-invitation.jpg"
                    alt="Beyond the Mind 2027 Invitation Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="font-serif text-base text-gold-300 font-medium block">
                    BTM 2027 Official Invitation
                  </span>
                  <span className="text-[11px] text-stone-subtle/70 uppercase tracking-wider">
                    October 6–9, 2027 • Rishikesh
                  </span>
                </div>
              </div>

              {/* Poster 2: 2026 Community Gathering */}
              <div className="group relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-lg bg-[#07261F]">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src="/images/posters/btm2026-gathering.jpg"
                    alt="Beyond the Mind 2026 Gathering Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="font-serif text-base text-gold-300 font-medium block">
                    BTM 2026 Community Gathering
                  </span>
                  <span className="text-[11px] text-stone-subtle/70 uppercase tracking-wider">
                    Sacred Fellowship & Kinship
                  </span>
                </div>
              </div>

              {/* Poster 3: 2026 Testimonial */}
              <div className="group relative rounded-2xl overflow-hidden border border-gold-500/30 shadow-lg bg-[#07261F]">
                <div className="relative aspect-[2/3] w-full">
                  <Image
                    src="/images/posters/btm2026-testimonial.jpg"
                    alt="BTM 2026 Arjun Pradeep Testimonial Poster"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 text-center">
                  <span className="font-serif text-base text-gold-300 font-medium block">
                    BTM 2026 Testimonial Poster
                  </span>
                  <span className="text-[11px] text-stone-subtle/70 uppercase tracking-wider">
                    Arjun Pradeep (Bangalore)
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200 font-semibold"
              >
                <span>View Complete Visual Gallery</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 10: DESTINATION & PARTICIPATION SUMMARY */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#031713] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Sanctuary Summary
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
              Four Days of Sacred Stillness
            </h3>
            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              October 6–9, 2027 in Rishikesh, Uttarakhand. Delivered in English with Hindi translation
              assistance available. Intimate cohort ensuring individual energetic attention and safe guidance.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-gold-300">
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                Private & Shared Options
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                Nourishing Sattvic Dining
              </span>
              <span className="px-4 py-2 rounded-full bg-emerald-950/80 border border-gold-500/25">
                Dedicated Travel Concierge
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 11: FINAL CONVERSION SECTION */}
        {/* ========================================================================= */}
        <section className="py-24 sm:py-32 bg-gradient-to-b from-[#07261F] to-[#02100d] text-center relative overflow-hidden border-t border-gold-500/25">
          <div className="absolute inset-0 bg-gold-radial opacity-30 pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/40">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
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
                className="w-full sm:w-auto px-9 py-4 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:via-gold-300 hover:to-gold-500 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                Begin Your Enquiry
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-950/80 text-gold-300 border border-gold-500/30 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
              >
                Speak with Concierge
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Premium Footer */}
      <Footer />
    </div>
  );
}

