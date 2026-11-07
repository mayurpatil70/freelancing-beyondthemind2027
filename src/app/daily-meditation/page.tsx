import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MeditationEnquiryForm } from "@/components/forms/MeditationEnquiryForm";
import { getSiteSettings } from "@/lib/storage/store";
import {
  Calendar,
  Clock,
  Video,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Heart,
  Brain,
  Feather,
  Compass,
} from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daily Meditation - A Journey Within | Beyond the Mind",
  description:
    "Join our live Monday to Friday 7:30 PM online guided meditation on Zoom. Cultivate awareness, explore inner silence, and pause, observe, and transcend.",
};

export default async function DailyMeditationPage() {
  const settings = await getSiteSettings();

  const whatsappInquiryUrl = formatWhatsAppUrl(
    settings.whatsapp_number,
    `Namaste Beyond the Mind Team,\n\nI am interested in joining the Daily Guided Meditation sessions held Monday to Friday at 7:30 PM on Zoom. Kindly share participation details, session fee, and how to begin.`
  );

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Regular Activity of Beyond the Mind
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Daily Meditation - A Journey Within
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Meditation is an invitation to move beyond the constant activity of the mind and discover the stillness within.
            </p>

            <div className="pt-2">
              <span className="inline-block px-6 py-2 rounded-full bg-gold-500/10 border border-gold-400/40 text-gold-300 font-serif tracking-[0.25em] text-sm uppercase">
                Pause. Observe. Transcend.
              </span>
            </div>
          </div>
        </section>

        {/* Schedule & Overview Card */}
        <section className="py-12 -mt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-400/40 p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-gold-500/20 pb-8">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">1. Mode</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">Online</span>
                <span className="text-[11px] text-gold-300/80 block">Live from anywhere</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">2. Timings</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">7:30 PM</span>
                <span className="text-[11px] text-gold-300/80 block">Monday to Friday</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">3. Session Fee</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">Paid sessions</span>
                <span className="text-[11px] text-gold-300/80 block">Shared on enquiry</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">4. Platform</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">Zoom</span>
                <span className="text-[11px] text-gold-300/80 block">Access link sent on joining</span>
              </div>
            </div>

            {/* Editorial Philosophy Text */}
            <div className="space-y-5 text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
              <p className="text-base sm:text-lg text-ivory-100 font-serif leading-snug">
                Through regular guided meditation sessions, Beyond the Mind encourages individuals to cultivate awareness, explore inner silence and deepen their understanding of themselves.
              </p>
              <p>
                Whether you are beginning your meditation journey or have an established practice, these sessions offer an opportunity to pause, observe and reconnect with your inner being.
              </p>
              <p>
                Apart from organising our flagship Divine Retreat in Rishikesh, we conduct these daily guided meditation sessions as a regular activity of Beyond the Mind, anchoring an ongoing spiritual journey that supports you in daily life.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gold-500/20">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire via WhatsApp for Zoom Details</span>
              </a>

              <a
                href="#enquire"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all text-center"
              >
                Submit Online Enquiry
              </a>
            </div>
          </div>
        </section>

        {/* Benefits & Purpose Section */}
        <section className="py-24 bg-[#05201a] text-ivory-100 mandala-section">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <SectionHeading
              eyebrow="The Purpose & Benefits"
              title="Why Regular Daily Practice Matters"
              subtitle="Cultivating inner stillness, heightened self-awareness, and lasting spiritual growth through consistent weekday meditation."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-4">
                <Brain className="w-8 h-8 text-gold-400" />
                <h4 className="font-serif text-xl font-semibold text-ivory-50">
                  Cultivating Awareness
                </h4>
                <p className="text-xs sm:text-sm text-ivory-200/70 leading-relaxed font-light">
                  Step away from constant mental chatter. Develop clear witness consciousness to observe thoughts without getting swept into automatic reactions.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-4">
                <Heart className="w-8 h-8 text-gold-400" />
                <h4 className="font-serif text-xl font-semibold text-ivory-50">
                  Exploring Inner Silence
                </h4>
                <p className="text-xs sm:text-sm text-ivory-200/70 leading-relaxed font-light">
                  Access the restorative stillness beneath cognitive noise. Calm the nervous system, release stress, and nurture deep emotional balance.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-4">
                <Feather className="w-8 h-8 text-gold-400" />
                <h4 className="font-serif text-xl font-semibold text-ivory-50">
                  Deepening Self-Understanding
                </h4>
                <p className="text-xs sm:text-sm text-ivory-200/70 leading-relaxed font-light">
                  Reconnect with your essential nature. Daily practice keeps subtle energy channels open, providing continuity between our annual intensive retreats.
                </p>
              </div>
            </div>

            {/* Flagship Retreat Link Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#07261F] via-[#0A2620] to-[#07261F] border-2 border-gold-400/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
                  Our Flagship In-Person Sanctuary
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light">
                  The Divine Retreat - Rishikesh 2027
                </h3>
                <p className="text-xs sm:text-sm text-stone-subtle/85 font-light max-w-xl">
                  Arrival: October 5, 2027 at 2:45 PM • Sessions: October 6–9, 2027 in Rishikesh, Uttarakhand. Available both offline in Rishikesh and online via live stream.
                </p>
              </div>
              <Link
                href="/register"
                className="px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs tracking-wider uppercase shrink-0 shadow-gold-sm hover:scale-105 transition-all"
              >
                Learn More About Retreat
              </Link>
            </div>
          </div>
        </section>

        {/* Online Enquiry Form */}
        <section id="enquire" className="mandala-section py-24 sm:py-28 bg-[#031713] scroll-mt-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeading
              eyebrow="Join the Circle"
              title="Enquire About Daily Guided Meditation"
              subtitle="Share a few details and our coordination team will reach out with the session fee, Zoom credentials, and how to begin."
            />
            <div className="rounded-3xl border border-gold-500/30 bg-gradient-to-br from-[#07261F] to-[#041a15] p-6 sm:p-10 shadow-emerald-deep">
              <MeditationEnquiryForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
