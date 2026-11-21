'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X, Radio } from 'lucide-react';
import { WhatsAppInquiryModal } from '@/components/layout/WhatsAppInquiryModal';
import { useCMS } from '@/contexts/CMSContext';

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

export function HeroNoticeCard({ notice: initialNotice }: HeroNoticeCardProps) {
  const { settings } = useCMS();
  const notice = settings?.hero_notice_card || initialNotice;
  const [dismissed, setDismissed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (notice && notice.enabled === false) return null;
  if (dismissed) return null;

  const defaultText =
    'Beyond the Mind 2028 – The Divine Retreat Dwaraka, Gujarat | 25–28 September 2028';

  // Determine display text from admin panel settings or default
  let displayHeadline = notice?.title?.trim() || defaultText;
  if (displayHeadline.includes('25 seekers') || displayHeadline.includes('October 6–9, 2027')) {
    displayHeadline = defaultText;
  }

  let subDetail = notice?.description?.trim() || '';
  if (subDetail.includes('25 seekers')) {
    subDetail = '';
  }

  const fullAnnouncement = subDetail && subDetail !== displayHeadline
    ? `${displayHeadline} • ${subDetail}`
    : displayHeadline;

  const isWhatsAppOrModal =
    !notice?.cta_link || notice.cta_link === '#' || notice.cta_link === 'whatsapp';

  return (
    <>
      {/* Floating News Channel Ticker Bar - Scrolling smoothly from right to left */}
      <aside
        aria-label="Breaking Announcement Marquee"
        className="fixed bottom-3 sm:bottom-5 left-2 sm:left-6 right-[72px] sm:right-[260px] md:right-[265px] z-40 max-w-6xl mx-auto rounded-full bg-[#031713]/95 backdrop-blur-xl border border-gold-500/40 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(212,175,55,0.25)] flex items-center p-1.5 sm:p-2 overflow-hidden gap-2 sm:gap-3 animate-in slide-in-from-bottom-5 duration-500"
      >
        {/* Left Live Badge (News Channel Live Indicator - Desktop only to maximize space on mobile) */}
        <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-extrabold text-[10px] sm:text-xs uppercase tracking-wider shrink-0 shadow-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span className="whitespace-nowrap font-bold">
            {notice?.badge?.trim() || 'NEXT GATHERING NOTICE'}
          </span>
        </div>

        {/* Center Infinite Floating Marquee Ticker (Right-to-Left Scrolling) */}
        <div
          className="overflow-hidden flex-1 relative py-1 cursor-pointer select-none"
          title="Click to enquire about this gathering"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="animate-marquee-rtl flex items-center gap-8 sm:gap-12">
            {/* Duplicated items to provide a seamless continuous scroll */}
            {[0, 1, 2, 3].map((idx) => (
              <span
                key={idx}
                className="text-xs sm:text-sm font-medium text-ivory-100 whitespace-nowrap flex items-center gap-3"
              >
                <span>{fullAnnouncement}</span>
                <span className="text-gold-400/80 font-bold px-2 select-none" aria-hidden="true">•</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Action CTA & Dismiss Button (Always visible and cleanly separated) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 pr-1">
          {isWhatsAppOrModal ? (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="hidden md:inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-transform whitespace-nowrap"
            >
              <span>{notice?.cta_text || 'Enquire for Retreat'}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <Link
              href={notice?.cta_link || '/register'}
              className="hidden md:inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-transform whitespace-nowrap"
            >
              <span>{notice?.cta_text || 'Enquire for Retreat'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className="w-7 h-7 rounded-full bg-emerald-950/90 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 hover:text-ivory-50 flex items-center justify-center transition-all shrink-0 hover:scale-110 shadow-sm"
            aria-label="Dismiss Announcement"
            title="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      <WhatsAppInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultProgram={fullAnnouncement}
      />
    </>
  );
}
