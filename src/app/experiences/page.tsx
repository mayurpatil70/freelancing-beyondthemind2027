import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getExperiences } from "@/lib/storage/store";
import {
  Feather,
  Flame,
  Sun,
  Sparkles,
  Heart,
  Compass,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Six Sacred Experiences | Beyond the Mind 2027",
  description:
    "Explore the six progressive spiritual practices of Beyond the Mind 2027: Deep Relaxation, Kundalini Awakening, Energy Field Activation, Soul Liberation, Inner Child Healing, and Soul Retrieval.",
};

const iconMap: Record<string, React.ElementType> = {
  Feather,
  Flame,
  Sun,
  Sparkles,
  Heart,
  Compass,
};

export default async function ExperiencesPage() {
  const experiences = await getExperiences();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Banner */}
        <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              The Sacred Curriculum
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Six Sacred Experiences
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              A comprehensive energetic progression designed to quiet somatic
              tension, awaken subtle prana, heal timeline fragmentation, and
              merge with the unbounded Shiva Mandala.
            </p>
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
              These experiences are offered as contemplative and spiritual
              disciplines for self-discovery and inner peace. They are not
              intended as medical treatments or clinical psychotherapeutic
              interventions. Every participant is guided with deep personal care
              and respect for their individual boundaries.
            </p>
          </div>
        </div>

        {/* Detailed Individual Experience Sections */}
        <section className="py-12 pb-28 space-y-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {experiences.map((exp, idx) => {
              const Icon = iconMap[exp.icon_name] || Sparkles;
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={exp.id}
                  id={exp.slug}
                  className="scroll-mt-32 p-6 sm:p-12 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-2xl space-y-8"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
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
                        <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-[#031713]/85 border border-gold-500/40 flex items-center justify-center font-serif text-sm text-gold-300 font-medium">
                          0{exp.order}
                        </div>
                      </div>
                    </div>

                    {/* Text Column */}
                    <div
                      className={`lg:col-span-7 space-y-5 ${isEven ? "lg:order-1" : "lg:order-2"}`}
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

                      <div className="pt-4 flex items-center gap-4">
                        <Link
                          href={`/register?programme=${encodeURIComponent(exp.title)}`}
                          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase hover:scale-105 transition-all shadow-gold-sm"
                        >
                          <span>Enquire For This Experience</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Conversion Box */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#031713] border border-gold-500/30 space-y-6 shadow-2xl">
              <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light">
                Ready to Experience These Sacred Dimensions?
              </h3>
              <p className="text-sm text-stone-subtle/85 font-light max-w-xl mx-auto leading-relaxed">
                Join our intimate gathering in Rishikesh from October 6–9, 2027.
                Early registration is recommended to reserve single or shared
                accommodation.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
              >
                <span>Reserve Your Sanctuary Place</span>
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
