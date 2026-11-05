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
  Sparkles,
  ArrowRight,
  Heart,
  Brain,
  Feather,
} from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daily Guided Meditation (Online Zoom) | Beyond the Mind",
  description:
    "Join our live Monday to Friday 7:30 PM IST online guided meditation on Zoom. Cultivate daily stillness, nervous system calm, and spiritual consistency.",
};

export default async function DailyMeditationPage() {
  const settings = await getSiteSettings();

  const whatsappInquiryUrl = formatWhatsAppUrl(
    settings.whatsapp_number,
    `Namaste Beyond the Mind Team,\n\nI am interested in joining the Daily Guided Meditation sessions held Monday to Friday at 7:30 PM on Zoom. Kindly share participation details and monthly subscription information.`,
  );

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="page-header relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Regular Online Sanctuary
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Daily Guided Meditation
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              A daily pause to ground the nervous system, clear psychic
              accumulation, and sustain unbroken connection with your quiet
              center.
            </p>
          </div>
        </section>

        {/* Schedule & Overview Card */}
        <section className="py-12 -mt-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-400/40 p-8 sm:p-12 shadow-2xl space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center border-b border-gold-500/20 pb-8">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">Mode</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">Online</span>
                <span className="text-[11px] text-gold-300/80 block">Live, from anywhere</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">Timings</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">7:30 PM IST</span>
                <span className="text-[11px] text-gold-300/80 block">Monday to Friday</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">Session fee</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">Paid sessions</span>
                <span className="text-[11px] text-gold-300/80 block">Shared on enquiry</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">Platform</span>
                <span className="font-serif text-2xl text-ivory-50 font-medium block">Zoom</span>
                <span className="text-[11px] text-gold-300/80 block">Link sent after joining</span>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-stone-subtle/90 font-light leading-relaxed">
              <p>
                Between intensive spiritual retreats, everyday demands, digital
                noise, and deadlines can gradually pull awareness back into
                agitation. Our weekday guided meditation sessions serve as an
                essential energetic anchor.
              </p>
              <p>
                Each evening at 7:30 PM IST, participants log in from across
                India and around the globe into an intimate Zoom circle. Under
                live teacher stewardship, we practice progressive relaxation,
                pranic breath harmonization, and deep quiet contemplation.
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

              <Link
                href="/register?programme=Daily%20Guided%20Meditation%20(Online%20Zoom%20Mon%E2%80%93Fri)"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all text-center"
              >
                Submit Online Enquiry
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-[#05201a] text-ivory-100 mandala-section">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <SectionHeading
              eyebrow="The Practice"
              title="Why Cultivate a Regular Meditation Discipline?"
              subtitle="The cumulative effect of twenty minutes of guided stillness every weekday."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-4">
                <Brain className="w-8 h-8 text-gold-400" />
                <h4 className="font-serif text-xl font-semibold text-ivory-50">
                  Cognitive De-escalation
                </h4>
                <p className="text-xs sm:text-sm text-ivory-200/70 leading-relaxed font-light">
                  Dissolving the residual static of workplace decisions, screen
                  fatigue, and constant mental vigilance so the brain can enter
                  restorative alpha and theta states.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-4">
                <Heart className="w-8 h-8 text-gold-400" />
                <h4 className="font-serif text-xl font-semibold text-ivory-50">
                  Emotional Resilience
                </h4>
                <p className="text-xs sm:text-sm text-ivory-200/70 leading-relaxed font-light">
                  Creating responsive space instead of impulsive reactivity.
                  Meeting challenging interactions from an immovable baseline of
                  inner poise.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-[#07261F]/60 backdrop-blur-sm border border-gold-500/25 shadow-emerald-deep space-y-4">
                <Feather className="w-8 h-8 text-gold-400" />
                <h4 className="font-serif text-xl font-semibold text-ivory-50">
                  Subtle Pranic Alignment
                </h4>
                <p className="text-xs sm:text-sm text-ivory-200/70 leading-relaxed font-light">
                  Keeping the spinal energetic corridors purified and open,
                  laying continuous groundwork for the deeper initiations
                  experienced during annual in-person retreats.
                </p>
              </div>
            </div>

            {/* Session Architecture */}
            <div className="p-8 rounded-3xl bg-emerald-950/60 border border-gold-600/30 space-y-6">
              <h3 className="font-serif text-2xl text-ivory-50 font-semibold">
                What a Guided Session Involves
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
                <div className="space-y-1">
                  <span className="font-serif text-base text-gold-800 font-semibold block">
                    Phase 1
                  </span>
                  <strong className="text-ivory-50 block font-medium">
                    Somatic Grounding & Breath
                  </strong>
                  <p className="text-ivory-200/70 font-light">
                    Arriving into the posture, releasing ocular and jaw tension,
                    regulating the diaphragm.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-base text-gold-800 font-semibold block">
                    Phase 2
                  </span>
                  <strong className="text-ivory-50 block font-medium">
                    Guided Subtle Focus
                  </strong>
                  <p className="text-ivory-200/70 font-light">
                    Teacher guidance directing awareness to energy centers,
                    spinal axis, or sacred silent mantra.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-serif text-base text-gold-800 font-semibold block">
                    Phase 3
                  </span>
                  <strong className="text-ivory-50 block font-medium">
                    Vast Open Stillness
                  </strong>
                  <p className="text-ivory-200/70 font-light">
                    Resting without guidance in pure effortless awareness before
                    sealing with gratitude.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="enquire" className="mandala-section py-24 sm:py-28 bg-[#031713] scroll-mt-28">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <SectionHeading
              eyebrow="Join the Circle"
              title="Enquire About Daily Guided Meditation"
              subtitle="Share a few details and we will send you the session fee, the Zoom link and how to begin."
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
