'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, ArrowRight, X, Bell, Tag } from 'lucide-react';
import { WhatsAppInquiryModal } from '@/components/layout/WhatsAppInquiryModal';

interface HeroNoticeCardProps {
  notice?: {
    enabled: boolean;
    badge?: string;
    title: string;
    description: string;
    discount_text?: string;
    cta_text?: string;
    cta_link?: string;
  };
}

export function HeroNoticeCard({ notice }: HeroNoticeCardProps) {
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!notice || !notice.enabled || dismissed) return null;

  const isWhatsAppOrModal = !notice.cta_link || notice.cta_link === '#' || notice.cta_link === 'whatsapp';

  return (
    <>
      <aside
        aria-label="Important Announcement & Offer"
        className="fixed bottom-20 sm:bottom-8 left-4 sm:left-8 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] rounded-2xl bg-[#031713]/95 backdrop-blur-xl border border-gold-400/50 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(212,175,55,0.2)] text-[#FAF8F5] animate-in slide-in-from-bottom-5 duration-300"
      >
        {/* Subtle Gold Ambient Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-gold-500/15 via-transparent to-transparent pointer-events-none rounded-2xl" />

        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-[10px] font-bold uppercase tracking-wider text-gold-300">
              <Bell className="w-3 h-3 text-gold-400 animate-pulse" />
              <span>{notice.badge || 'Important Notice'}</span>
            </span>

            {notice.discount_text && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-900/90 border border-emerald-400/40 text-[10px] font-semibold text-emerald-200">
                <Tag className="w-2.5 h-2.5 text-emerald-300" />
                <span>{notice.discount_text}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="w-6 h-6 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-stone-subtle hover:text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-2.5 space-y-1">
          <h4 className="font-serif text-base sm:text-lg font-normal text-ivory-50 leading-snug">
            {notice.title}
          </h4>
          <p className="text-xs text-stone-subtle/90 font-light leading-relaxed line-clamp-3">
            {notice.description}
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-gold-500/20 flex items-center justify-between gap-3">
          <span className="text-[10px] text-gold-400/80 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Beyond the Mind 2027</span>
          </span>

          {isWhatsAppOrModal ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 text-[11px] font-bold uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-transform"
            >
              <span>{notice.cta_text || 'Enquire Now'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <Link
              href={notice.cta_link!}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 text-[11px] font-bold uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-transform"
            >
              <span>{notice.cta_text || 'Enquire Now'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </aside>

      <WhatsAppInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultProgram={notice.title}
      />
    </>
  );
}
