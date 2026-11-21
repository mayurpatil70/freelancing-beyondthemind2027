import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactDetailsSection } from '@/components/contact/ContactDetailsSection';

export const metadata: Metadata = {
  title: 'Contact Concierge & Official Channels | Beyond the Mind 2027',
  description:
    'Contact the Beyond the Mind coordination team via WhatsApp (+91 8075572018), email (moolabrahman@gmail.com), or our concierge enquiry desk.',
};

export const revalidate = 300;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-24">
        {/* Header Hero */}
        <section className="page-header relative py-16 sm:py-24 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
              Retreat Concierge
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Contact & Support
            </h1>

            <p className="text-sm sm:text-base text-stone-subtle/85 font-light leading-relaxed max-w-xl mx-auto">
              Our retreat coordination team is here to assist with every aspect of your spiritual journey to Rishikesh.
            </p>
          </div>
        </section>

        {/* Dynamic CMS Contact Channels & Form */}
        <ContactDetailsSection />
      </main>

      <Footer />
    </div>
  );
}

