import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { getFAQs } from "@/lib/storage/store";
import { Sparkles, MessageCircle, HelpCircle, ArrowRight } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Beyond the Mind 2027",
  description:
    "Answers to common questions regarding Beyond the Mind 2027 in Rishikesh, travel arrangements, dietary needs, session languages, and daily online meditation.",
};

export default async function FAQPage() {
  const faqs = await getFAQs();

  const whatsappConciergeUrl = formatWhatsAppUrl(
    "+91 8075572018",
    "Namaste Beyond the Mind Concierge,\n\nI have a question that is not covered in the retreat FAQ. Could you kindly assist me?",
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
              Clarity & Guidance
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl text-ivory-50 font-light leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-stone-subtle/85 font-light leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about our upcoming October 2027
              retreat in Rishikesh and our regular online daily meditation
              sessions.
            </p>
          </div>
        </section>

        {/* Searchable Accordion Section */}
        <section className="py-12 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <FAQAccordion faqs={faqs} />

          {/* Unanswered Question Concierge Callout */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#07261F] to-[#041a15] border border-gold-400/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                Direct Inquiry
              </span>
              <h3 className="font-serif text-2xl text-ivory-50 font-medium">
                Have a specific requirement or question?
              </h3>
              <p className="text-xs sm:text-sm text-stone-subtle/80 font-light">
                Our retreat coordinators are readily available to answer
                personal queries via WhatsApp or phone.
              </p>
            </div>

            <a
              href={whatsappConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-sm hover:scale-105 transition-all shrink-0"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Ask on WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
