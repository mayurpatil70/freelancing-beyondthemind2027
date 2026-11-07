'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Languages,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
  Video,
  Sun,
  Shirt,
} from 'lucide-react';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { WhatsAppInquiryModal } from '@/components/layout/WhatsAppInquiryModal';

interface RegistrationCardProps {
  allowPaymentProof?: boolean;
  defaultProgramme?: string;
  googleFormUrl?: string;
  googleFormEnabled?: boolean;
}

export function RegistrationCard({
  allowPaymentProof = true,
  defaultProgramme = 'The Divine Retreat Rishikesh (Offline: Oct 5–9, 2027)',
  googleFormUrl = '',
  googleFormEnabled = false,
}: RegistrationCardProps) {
  const [activeMode, setActiveMode] = useState<'demo-form' | 'google-form'>(
    googleFormEnabled && googleFormUrl ? 'google-form' : 'demo-form'
  );
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [modalProgram, setModalProgram] = useState(defaultProgramme);

  const openWhatsApp = (prog: string) => {
    setModalProgram(prog);
    setIsWhatsAppModalOpen(true);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. PARTICIPATION TIERS & OVERVIEW CARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* Tier 1: In-Person Flagship Retreat */}
        <div className="relative rounded-3xl bg-gradient-to-b from-[#0A2620] via-[#07201B] to-[#041512] border-2 border-gold-400/50 p-6 sm:p-8 flex flex-col justify-between shadow-2xl overflow-hidden hover:border-gold-400 transition-all">
          <div className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-[10px] tracking-widest uppercase shadow-md">
            Flagship Event
          </div>

          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              In-Person • Rishikesh
            </span>

            <h3 className="font-serif text-2xl text-ivory-50 font-medium">
              The Divine Retreat 2027
            </h3>

            <div className="space-y-2 text-xs text-stone-subtle/90 font-light border-y border-gold-500/20 py-3">
              <div className="flex items-center gap-2 text-gold-300 font-medium">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Arrival: October 5, 2027 at 2:45 PM</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Sessions: October 6, 7, 8 & 9 (4 Full Days)</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Rishikesh, Uttarakhand, India</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <Languages className="w-4 h-4 text-gold-400 shrink-0" />
                <span>English (Hindi translation available)</span>
              </div>
            </div>

            <p className="text-xs text-stone-subtle/80 leading-relaxed font-light">
              Complete immersive residential experience beside holy Ganga. Includes all 7 transformative sessions, sattvic meals, and guided Himalayan ceremonies.
            </p>

            <ul className="space-y-2 text-xs text-ivory-200/90 pt-1">
              {[
                'All 7 Retreat Sessions with Pradeep Sir',
                'Pooja Veppu & Shiva Mandala Merging',
                'Fresh Sattvic Vegetarian Nourishment',
                'Private single or twin sharing rooms',
                'Dedicated Concierge & Airport Assistance',
              ].map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-gold-500/20 space-y-3">
            <button
              type="button"
              onClick={() => openWhatsApp('The Divine Retreat - Rishikesh 2027 (Offline)')}
              className="w-full py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-bold text-xs tracking-wider uppercase text-center shadow-gold-sm hover:scale-[1.02] transition-all"
            >
              Enquire via WhatsApp
            </button>
            <p className="text-[10px] text-center text-stone-subtle/70">
              Limited sanctuary cohort • Single & twin rooms
            </p>
          </div>
        </div>

        {/* Tier 2: Online Retreat Stream */}
        <div className="relative rounded-3xl bg-[#07261F]/70 border border-gold-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl overflow-hidden hover:border-gold-400/50 transition-all">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Online Live Access
            </span>

            <h3 className="font-serif text-2xl text-ivory-50 font-medium">
              The Divine Retreat (Online)
            </h3>

            <div className="space-y-2 text-xs text-stone-subtle/90 font-light border-y border-gold-500/20 py-3">
              <div className="flex items-center gap-2 text-gold-300 font-medium">
                <Video className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Live Interactive Stream (Zoom)</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                <span>October 6–9, 2027</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <Languages className="w-4 h-4 text-gold-400 shrink-0" />
                <span>English with Hindi translation</span>
              </div>
            </div>

            <p className="text-xs text-stone-subtle/80 leading-relaxed font-light">
              Join the sacred circle from anywhere in the world. Receive live teacher guidance, energetic attunements, and full immersion from home.
            </p>

            <ul className="space-y-2 text-xs text-ivory-200/90 pt-1">
              {[
                'Full live stream access to all 7 sessions',
                'Live interactive Q&A segments',
                'Digital Retreat Guidebook & Mantras',
                'Session recordings for integration',
              ].map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-gold-500/20 space-y-3">
            <button
              type="button"
              onClick={() => openWhatsApp('The Divine Retreat 2027 (Online Live Stream)')}
              className="w-full py-3 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-wider uppercase text-center hover:bg-emerald-900 transition-all"
            >
              Enquire for Online Access
            </button>
            <p className="text-[10px] text-center text-stone-subtle/70">
              Worldwide accessibility • Zoom link shared upon registration
            </p>
          </div>
        </div>

        {/* Tier 3: Daily Guided Meditation */}
        <div className="relative rounded-3xl bg-[#07261F]/70 border border-gold-500/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl overflow-hidden hover:border-gold-400/50 transition-all">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Regular Ongoing Activity
            </span>

            <h3 className="font-serif text-2xl text-ivory-50 font-medium">
              Daily Guided Meditation
            </h3>

            <div className="space-y-2 text-xs text-stone-subtle/90 font-light border-y border-gold-500/20 py-3">
              <div className="flex items-center gap-2 text-gold-300 font-medium">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Monday to Friday at 7:30 PM IST</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <Video className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Platform: Zoom</span>
              </div>
              <div className="flex items-center gap-2 text-ivory-100">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Session Fee: Paid Sessions</span>
              </div>
            </div>

            <p className="text-xs text-stone-subtle/80 leading-relaxed font-light">
              A regular spiritual practice to explore inner stillness, self-awareness and spiritual growth through continuous weekday guidance. Pause. Observe. Transcend.
            </p>

            <ul className="space-y-2 text-xs text-ivory-200/90 pt-1">
              {[
                'Live weekday guided sessions at 7:30 PM',
                'Nervous system recalibration & de-stress',
                'Breathwork & subtle channel purification',
                'Ongoing spiritual community kinship',
              ].map((inc, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                  <span>{inc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-gold-500/20 space-y-3">
            <button
              type="button"
              onClick={() => openWhatsApp('Daily Guided Meditation (Online Zoom Mon-Fri 7:30 PM)')}
              className="w-full py-3 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-wider uppercase text-center hover:bg-emerald-900 transition-all"
            >
              Enquire for Daily Zoom Pass
            </button>
            <p className="text-[10px] text-center text-stone-subtle/70">
              Monthly & quarterly access passes available
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. WEATHER & CLOTHES REQUIRED GUIDE */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#07261F]/80 border border-gold-500/25 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold-500/15 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Travel Preparation & Packing
            </span>
            <h3 className="font-serif text-2xl text-ivory-50 font-light">
              Weather & Recommended Clothing for October in Rishikesh
            </h3>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 border border-gold-400/30 text-xs text-gold-300 font-medium shrink-0">
            <Sun className="w-4 h-4 text-gold-400" />
            <span>Autumn Season • Clear Skies</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
          {/* Day / Night Temperature */}
          <div className="p-5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
              Temperature & Climate
            </span>
            <p className="text-ivory-50 font-medium text-base">
              Sunny Days (28°C–30°C) • Crisp Evenings (15°C–18°C)
            </p>
            <p className="text-stone-subtle/85 font-light leading-relaxed text-xs">
              October is the most pleasant post-monsoon month in the Garhwal Himalayas. The river flows clear emerald green and humidity is low.
            </p>
          </div>

          {/* Clothes Required */}
          <div className="p-5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
              Meditation Attire
            </span>
            <p className="text-ivory-50 font-medium text-base">
              Loose Cotton / Linen Clothes
            </p>
            <p className="text-stone-subtle/85 font-light leading-relaxed text-xs">
              Comfortable, modest clothes covering shoulders and knees. White or light natural earth tones are recommended for energetic openness.
            </p>
          </div>

          {/* Early Morning / Evening Shawl */}
          <div className="p-5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
              Morning & Evening Layers
            </span>
            <p className="text-ivory-50 font-medium text-base">
              Light Shawl, Cardigan & Slip-ons
            </p>
            <p className="text-stone-subtle/85 font-light leading-relaxed text-xs">
              Riverside Ganga Aarti and dawn meditations can be breezy. Bring a light woolen shawl or cardigan, plus easy slip-on sandals.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. REGISTRATION FORM & GOOGLE FORM DEMO SWITCHER */}
      {/* ========================================================================= */}
      <div className="rounded-3xl bg-[#07261F]/90 border border-gold-500/30 p-6 sm:p-10 shadow-2xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gold-500/20 pb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-400 font-semibold block">
              Official Registration
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light">
              Submit Your Registration Details
            </h2>
          </div>

          {/* Form Mode Toggle */}
          <div className="inline-flex rounded-full p-1 bg-emerald-950 border border-gold-500/30">
            <button
              type="button"
              onClick={() => setActiveMode('demo-form')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeMode === 'demo-form'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 shadow-sm'
                  : 'text-ivory-200/80 hover:text-gold-300'
              }`}
            >
              Demo Registration Form
            </button>
            <button
              type="button"
              onClick={() => setActiveMode('google-form')}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                activeMode === 'google-form'
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 shadow-sm'
                  : 'text-ivory-200/80 hover:text-gold-300'
              }`}
            >
              Google Form Mode
            </button>
          </div>
        </div>

        {/* Content based on Active Mode */}
        {activeMode === 'google-form' ? (
          <div className="space-y-6 text-center py-8">
            <div className="max-w-xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-[10px] tracking-widest uppercase text-gold-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                Google Form Integration Container
              </span>
              <h3 className="font-serif text-2xl text-ivory-50 font-medium">
                Official Google Registration Form
              </h3>
              <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                {googleFormUrl ? (
                  'You can complete the official registration form directly embedded below, or click to open it in a new window.'
                ) : (
                  'The official Google Form link will be added by the retreat administrator. In the meantime, you can use the Demo Registration Form tab or connect with our coordinators directly on WhatsApp.'
                )}
              </p>

              {googleFormUrl ? (
                <div className="pt-4">
                  <a
                    href={googleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
                  >
                    <span>Open Official Google Form</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <div className="mt-8 rounded-2xl overflow-hidden border border-gold-500/30 bg-white">
                    <iframe
                      src={googleFormUrl}
                      width="100%"
                      height="800"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      title="Registration Google Form"
                    >
                      Loading Google Form...
                    </iframe>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-emerald-950/60 border border-gold-500/20 max-w-md mx-auto space-y-4 text-center">
                  <p className="text-xs text-gold-300">
                    💡 <em>Admin Tip:</em> You can easily configure the Google Form URL anytime in the{' '}
                    <Link href="/admin" className="underline font-semibold text-white">
                      Admin Panel
                    </Link>{' '}
                    without touching any code.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveMode('demo-form')}
                    className="px-6 py-2.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-400/40 text-xs uppercase tracking-wider font-semibold hover:bg-gold-500 hover:text-emerald-950 transition-all"
                  >
                    Switch to Demo Form
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <RegistrationForm
            allowPaymentProof={allowPaymentProof}
            defaultProgramme={defaultProgramme}
          />
        )}
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppInquiryModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        defaultProgram={modalProgram}
      />
    </div>
  );
}
