import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, Lock, Eye, Trash2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy & Sanctuary Data Discretion | Beyond the Mind 2027',
  description:
    'Our privacy commitments regarding registration details, contact numbers, payment proof documents, and personal reflection data for Beyond the Mind.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-24">
        {/* Header Hero */}
        <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Sanctuary Data Discretion
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl text-ivory-50 font-light leading-tight">
              Privacy & Participation Policy
            </h1>

            <p className="text-xs sm:text-sm text-stone-subtle/85 font-light max-w-xl mx-auto">
              Effective Date: November 2026 • Applicable to Beyond the Mind 2027 and regular online sessions.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-xs sm:text-sm text-stone-subtle/90 font-light leading-relaxed">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 space-y-8 shadow-xl">
            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                1. Our Reverence for Your Privacy
              </h2>
              <p>
                At Beyond the Mind, we regard the personal information and spiritual reflections shared with us
                with the utmost sanctity. We collect only what is strictly necessary to communicate retreat
                arrangements, ensure your dietary and physical comfort, and maintain sanctuary integrity.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                2. Information Collected During Registration
              </h2>
              <p>
                When submitting an enquiry or registering for Beyond the Mind 2027 or our Daily Guided Meditation,
                we collect:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-ivory-100">
                <li>Your full name and contact information (email, phone number, and city/country).</li>
                <li>Your language preferences and interested programme choices.</li>
                <li>Voluntarily shared dietary preferences or special accommodation considerations.</li>
                <li>Any personal contemplation or question you choose to share with Pradeep Sir and the retreat team.</li>
              </ul>
              <p>
                Participants do not need to register a user account or create an access password to participate.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                3. Optional Payment Transaction Receipts
              </h2>
              <p>
                If you elect to upload a screenshot or receipt of an approved UPI or bank transfer transaction,
                the file is encrypted in transit and stored in a private directory inaccessible to public internet
                scrapers. Only verified retreat administrators may view the file for verification purposes.
              </p>
              <p>
                We do not collect or store credit card numbers, banking passwords, PINs, or sensitive financial
                credentials.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                4. Communication Discretion
              </h2>
              <p>
                We will contact you via WhatsApp, email, or telephone only in direct connection with your inquiry,
                travel logistics, or session notifications. We will never sell, rent, or lease your contact information
                to commercial advertisers or marketing networks.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl text-ivory-50 font-medium">
                5. Data Retention & Your Rights
              </h2>
              <p>
                You retain full sovereignty over your information. At any time before, during, or after the retreat,
                you may contact our team at{' '}
                <a href="mailto:moolabrahman@gmail.com" className="text-gold-300 underline">
                  moolabrahman@gmail.com
                </a>{' '}
                or via WhatsApp to request an export or complete erasure of your registration records.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gold-300 hover:text-gold-200 font-semibold"
            >
              <span>Return to Enquiry & Registration</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

