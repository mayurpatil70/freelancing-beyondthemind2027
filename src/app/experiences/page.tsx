import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getExperiences, getAttractions } from "@/lib/storage/store";
import {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Languages,
  Video,
  MapPin,
} from "lucide-react";
import { AttractionsGrid } from "@/components/rishikesh/AttractionsGrid";

export const metadata: Metadata = {
  title: "Seven Retreat Sessions & Rishikesh Attractions | Beyond the Mind 2027",
  description:
    "Explore the 7 retreat sessions of Beyond the Mind 2027: Stress Buster, Soul Retrieval, Kundalini Awakening, Soul Liberation, Merkaba Activation, Inner Child Healing, and Guided Meditation. Plus top Rishikesh attractions.",
};

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Heart,
  Compass,
  Flower2,
  CircleDot,
};

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  const attractions = await getAttractions();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Banner */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              The Sacred Retreat Sessions
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Seven Sacred Sessions
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              A comprehensive energetic progression designed to release stress, awaken dormant prana,
              restore wholeness, and merge with transcendental stillness beside holy Mother Ganga.
            </p>

            {/* Retreat Details Strip */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-gold-300 pt-2">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Arrival: Oct 5 (2:45 PM) • Sessions: Oct 6–9, 2027</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Video className="w-3.5 h-3.5 text-gold-400" />
                <span>Modes: Offline (Rishikesh) & Online Live</span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>English (Hindi translation available)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Responsible Stewardship Note */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-gold-500/25 flex items-start gap-3 text-xs text-stone-subtle/85 font-light leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-gold-300 font-medium">
                Sacred Ethics & Guidance:
              </strong>{" "}
              These sessions are offered as experiential contemplative and energetic practices for inner stillness, self-awareness, and spiritual growth. Guided under the reverence of Pradeep Sir and Beyond the Mind.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RETREAT SESSIONS CARDS (Screenshot 1 Order) */}
        {/* ========================================================================= */}
        <section className="py-6 pb-20 space-y-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {experiences.map((exp, idx) => {
              const Icon = iconMap[exp.icon_name] || CircleDot;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={exp.id}
                  id={exp.slug}
                  className="scroll-mt-32 p-6 sm:p-10 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-2xl space-y-6 hover:border-gold-400/50 transition-colors"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${
                      isEven ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    {/* Media Column */}
                    <div
                      className={`lg:col-span-5 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                    >
                      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] sm:aspect-[4/5] border border-gold-500/40 shadow-xl">
                        <Image
                          src={exp.image}
                          alt={exp.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#07261F] via-transparent to-transparent" />
                        <div className="absolute top-4 left-4 z-10 w-11 h-11 rounded-full bg-[#031713]/90 border border-gold-500/50 flex items-center justify-center font-serif text-sm text-gold-300 font-bold shadow-lg">
                          0{exp.order}
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-ivory-100 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gold-400/20">
                          <span>Session {exp.order} of 7</span>
                          <span className="text-gold-300">In-Person & Online</span>
                        </div>
                      </div>
                    </div>

                    {/* Text Column */}
                    <div
                      className={`lg:col-span-7 space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-gold-500/30 text-xs uppercase tracking-wider text-gold-300 font-medium">
                        <Icon className="w-3.5 h-3.5 text-gold-400" />
                        <span>{exp.spiritual_dimension}</span>
                      </div>

                      <h2 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light leading-snug">
                        {exp.title}
                      </h2>

                      <span className="text-xs uppercase tracking-[0.2em] text-gold-400 font-medium block">
                        {exp.subtitle}
                      </span>

                      <p className="text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
                        {exp.full_desc}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-2 pt-2 border-t border-emerald-800/50">
                        <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                          Key Practice Dimensions:
                        </span>
                        {exp.highlights.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-ivory-100 font-light"
                          >
                            <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 flex flex-wrap items-center gap-4">
                        <Link
                          href={`/register?programme=${encodeURIComponent(exp.title)}`}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-gold-sm"
                        >
                          <span>Enquire For This Session</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* RISHIKESH ATTRACTIONS & ADVENTURES (Added where session cards are) */}
        {/* ========================================================================= */}
        <section className="py-20 bg-[#02100d] border-t border-gold-500/20 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <AttractionsGrid
              attractions={attractions}
              title="Rishikesh Attractions & Things to Do"
              subtitle="Complement your retreat experience with Rishikesh's legendary activities — from India's highest bungee jumping and thrilling river rafting to sacred evening Ganga Aarti and silent meditation caves."
            />
          </div>
        </section>

        {/* Bottom Conversion Box */}
        <section className="py-20 bg-[#031713] text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 space-y-6 shadow-2xl">
              <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
                Ready to Experience These Seven Dimensions?
              </h3>
              <p className="text-sm text-stone-subtle/85 font-light max-w-xl mx-auto leading-relaxed">
                Join our intimate gathering in Rishikesh. Arrival on October 5, 2027 at 2:45 PM, with sessions running October 6–9, 2027. Available both in-person and online live stream.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
                >
                  <span>Reserve Your Sanctuary Place</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/daily-meditation"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-950 text-gold-300 border border-gold-500/30 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all"
                >
                  <span>Explore Daily Meditation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
