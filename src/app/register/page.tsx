import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegistrationCard } from '@/components/retreat/RegistrationCard';
import { getSiteSettings } from '@/lib/storage/store';
import { ShieldCheck, Lock, CheckCircle2, Calendar, Languages, Video } from 'lucide-react';
import { LanguageNote } from '@/components/retreat/LanguageNote';

export const metadata: Metadata = {
  title: 'Enquiry & Registration | The Divine Retreat & Daily Meditation | Beyond the Mind',
  description:
    'Reserve your sanctuary place for Beyond the Mind 2027 in Rishikesh (Arrival Oct 5 at 2:45 PM • Sessions Oct 6–9) or join Daily Guided Meditation on Zoom.',
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams?: { programme?: string };
}) {
  const settings = await getSiteSettings();
  const selectedProgramme = searchParams?.programme;

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-24">
        {/* Header Hero */}
        <section className="page-header relative py-16 sm:py-24 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Sanctuary Reservation & Enquiry
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Begin Your Sacred Journey
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Choose your mode of participation below. Available both in-person at Rishikesh and online via live stream. No password or complicated account setup required.
            </p>

            {/* Quick Summary Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-gold-300">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Arrival: October 5, 2027 at 2:45 PM</span>
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Video className="w-3.5 h-3.5 text-gold-400" />
                <span>Modes: In-Person (Rishikesh) & Online</span>
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-gold-500/25">
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>English (Hindi Translation Available)</span>
              </span>
            </div>
          </div>
        </section>

        {/* Language Accommodation Note */}
        <div className="pb-8">
          <LanguageNote />
        </div>

        {/* Comprehensive Registration Card & Options */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegistrationCard
            allowPaymentProof={settings.payment_proof_upload_enabled}
            defaultProgramme={selectedProgramme || 'The Divine Retreat Rishikesh (Offline: Oct 5–9, 2027)'}
            googleFormUrl={settings.registration_google_form_url}
            googleFormEnabled={settings.registration_google_form_enabled}
          />

          {/* Privacy & Trust Assurance */}
          <div className="mt-14 p-6 rounded-2xl bg-emerald-950/40 border border-gold-500/15 max-w-2xl mx-auto text-center space-y-2 text-xs text-stone-subtle/80 font-light">
            <div className="flex items-center justify-center gap-2 text-gold-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Data Protection & Sanctuary Discretion</span>
            </div>
            <p>
              Your contact details are strictly confidential and used only by our retreat coordinators for your participation arrangements.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
