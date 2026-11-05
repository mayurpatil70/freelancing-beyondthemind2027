import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Plane, Train, Car, MessageCircle, MapPin, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'How to Reach Rishikesh | Travel Guide | Beyond the Mind 2027',
  description:
    'Comprehensive travel information for reaching Beyond the Mind 2027 in Rishikesh via Dehradun Airport, Yog Nagari Rishikesh Railway, and Delhi highways.',
};

export default function ReachPage() {
  const whatsappUrl = formatWhatsAppUrl(
    '+91 8075572018',
    'Namaste Beyond the Mind Concierge,\n\nI need travel assistance and guidance on planning my journey to Rishikesh for Beyond the Mind 2027.'
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
              Travel & Logistics
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Journeying to Rishikesh
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Practical travel connectivity for domestic and international seekers arriving for Beyond the Mind 2027.
            </p>
          </div>
        </section>

        {/* 3 Main Transit Modes */}
        <section className="py-12 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Air Travel */}
            <div className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 space-y-5 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-gold-400/40 flex items-center justify-center text-gold-300">
                <Plane className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  By Air
                </span>
                <h3 className="font-serif text-2xl text-ivory-50 font-medium mt-0.5">
                  Jolly Grant Airport, Dehradun (DED)
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                <p>
                  <strong>Distance:</strong> Approximately 21 km from Rishikesh (~35–45 minutes drive).
                </p>
                <p>
                  <strong>Connectivity:</strong> Frequent daily flights connect Dehradun directly with New Delhi
                  (DEL), Mumbai (BOM), Bangalore (BLR), and Hyderabad.
                </p>
                <p>
                  <strong>Transfers:</strong> Pre-paid airport taxis and private cabs are readily available at the
                  terminal. Our concierge can also arrange assistance upon advance request.
                </p>
              </div>
            </div>

            {/* Train Travel */}
            <div className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 space-y-5 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-gold-400/40 flex items-center justify-center text-gold-300">
                <Train className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  By Rail
                </span>
                <h3 className="font-serif text-2xl text-ivory-50 font-medium mt-0.5">
                  Yog Nagari Rishikesh (YNRK) & Haridwar (HW)
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                <p>
                  <strong>Station:</strong> Yog Nagari Rishikesh is within town. Major express trains and
                  Vande Bharat Express also connect Delhi to Haridwar Junction (~25 km away).
                </p>
                <p>
                  <strong>Recommended Trains:</strong> Vande Bharat Express and Dehradun Shatabdi Express from
                  New Delhi Railway Station.
                </p>
                <p>
                  <strong>Duration:</strong> Approximately 4 to 4.5 hours from Delhi to Haridwar.
                </p>
              </div>
            </div>

            {/* Road Travel */}
            <div className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 space-y-5 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-gold-400/40 flex items-center justify-center text-gold-300">
                <Car className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold block">
                  By Road
                </span>
                <h3 className="font-serif text-2xl text-ivory-50 font-medium mt-0.5">
                  Delhi – Meerut – Rishikesh Expressway
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                <p>
                  <strong>Distance:</strong> ~240 km from New Delhi via NH 334.
                </p>
                <p>
                  <strong>Drive Time:</strong> Approximately 4.5 to 5.5 hours along the newly upgraded highway corridors.
                </p>
                <p>
                  <strong>Buses & Cabs:</strong> Deluxe Volvo buses depart regularly from Kashmere Gate ISBT, Delhi.
                  Private one-way taxi transfers are widely accessible.
                </p>
              </div>
            </div>
          </div>

          {/* International Visitor Support & WhatsApp Concierge */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-400/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                Concierge Assistance
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light">
                Need Help Coordinating Flights or Pickups?
              </h3>
              <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed">
                Whether arriving from overseas via New Delhi International Airport (DEL) or traveling from within
                India, our concierge team is happy to advise on recommended flight timings and local cab arrangements.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-sm hover:scale-105 transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Travel Support on WhatsApp</span>
              </a>

              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-950 border border-gold-500/30 text-gold-300 font-semibold text-xs tracking-widest uppercase hover:bg-emerald-900 transition-all text-center"
              >
                Enquire for Retreat
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

