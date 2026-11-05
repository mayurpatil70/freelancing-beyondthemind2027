import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { getSiteSettings } from '@/lib/storage/store';
import { Sparkles, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { LanguageNote } from '@/components/retreat/LanguageNote';

export const metadata: Metadata = {
  title: 'Enquiry & Registration | Beyond the Mind 2027',
  description:
    'Reserve your sanctuary place for Beyond the Mind 2027 in Rishikesh. Quick, account-free registration form with immediate confirmation and WhatsApp coordination.',
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Sanctuary Reservation
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Begin Your Journey
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-xl mx-auto">
              Complete the registration form below. No account or password is required. Our retreat coordinators
              will personally connect with you regarding confirmation.
            </p>
          </div>
        </section>

        {/* Registration Form Component */}
        <div className="pb-10">
          <LanguageNote />
        </div>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <RegistrationForm
            allowPaymentProof={settings.payment_proof_upload_enabled}
            defaultProgramme={selectedProgramme || '4-Day Divine Retreat Rishikesh (Oct 6–9, 2027)'}
          />

          {/* Privacy & Trust Assurance */}
          <div className="mt-12 p-6 rounded-2xl bg-emerald-950/40 border border-gold-500/15 max-w-2xl mx-auto text-center space-y-2 text-xs text-stone-subtle/80 font-light">
            <div className="flex items-center justify-center gap-2 text-gold-400 font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Data Protection & Sanctuary Discretion</span>
            </div>
            <p>
              Your contact details are encrypted in transit and never shared with third parties. They are used
              strictly by the Beyond the Mind coordination team for your retreat arrangements.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

