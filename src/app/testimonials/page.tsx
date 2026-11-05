import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TestimonialCarousel } from '@/components/testimonials/TestimonialCarousel';
import { getTestimonials } from '@/lib/storage/store';
import { Sparkles, Quote, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guest Testimonials & Participant Reflections | Beyond the Mind 2027',
  description:
    'Read authentic reflections from Beyond the Mind participants, featuring Arjun Pradeep from Bangalore sharing his experience of Maha Theerthas, Shiva Lingams, and the Shiva Mandala.',
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="min-h-screen bg-[#031713] text-[#FAF8F5]">
      <Navbar />

      <main className="pt-24 sm:pt-28">
        {/* Header Hero */}
        <section className="relative py-20 sm:py-28 bg-gradient-to-b from-[#07261F] via-[#031713] to-[#031713] text-center overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs tracking-widest uppercase font-semibold border border-gold-400/30">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              Verified Participant Words
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Seeker Testimonials
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Original words and reflections from seekers who experienced the transformative field of Beyond the Mind.
            </p>
          </div>
        </section>

        {/* Carousel & Featured Testimonials */}
        <section className="py-12 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          <TestimonialCarousel testimonials={testimonials} />

          {/* Testimonial Integrity Guarantee */}
          <div className="p-8 rounded-3xl bg-emerald-950/60 border border-gold-500/25 max-w-4xl mx-auto text-center space-y-3">
            <ShieldCheck className="w-6 h-6 text-gold-400 mx-auto" />
            <h4 className="font-serif text-lg text-ivory-100 font-medium">
              Authentic Seeker Transparency
            </h4>
            <p className="text-xs sm:text-sm text-stone-subtle/80 font-light leading-relaxed max-w-2xl mx-auto">
              We never fabricate ratings, buy reviews, or publish simulated endorsements. Every testimony
              published by Beyond the Mind originates from a real participant who completed an in-person or online
              immersion with Pradeep Sir.
            </p>
          </div>

          {/* Registration CTA */}
          <div className="text-center pt-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
            >
              <span>Begin Your Own Journey in Rishikesh</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

