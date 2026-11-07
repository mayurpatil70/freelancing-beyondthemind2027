'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { WhatsAppInquiryModal } from './WhatsAppInquiryModal';

export function WhatsAppFloat() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  const defaultProgram = pathname === '/daily-meditation'
    ? 'Daily Guided Meditation (Online Zoom Mon-Fri 7:30 PM)'
    : 'The Divine Retreat - Rishikesh 2027 (Offline)';

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Instant Himalayan & Retreat Inquiry on WhatsApp"
        className="group fixed z-40 right-4 sm:right-6 bottom-[calc(env(safe-area-inset-bottom,0px)+16px)] sm:bottom-6 flex items-center gap-3 rounded-full pl-1.5 pr-1.5 sm:pr-5 py-1.5 bg-[#031713]/90 backdrop-blur-md border border-gold-400/60 shadow-[0_10px_40px_-10px_rgba(212,175,55,0.55)] hover:border-gold-300 hover:scale-[1.03] transition-all cursor-pointer"
      >
        <span className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-gold-200 via-gold-400 to-gold-600 text-emerald-950">
          <span className="absolute inset-0 rounded-full border border-gold-300/70 animate-ping [animation-duration:2.6s]" aria-hidden="true" />
          <svg viewBox="0 0 32 32" className="w-6 h-6" fill="currentColor" aria-hidden="true">
            <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
          </svg>
        </span>
        <span className="hidden sm:flex flex-col leading-tight text-left">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400 font-semibold">WhatsApp</span>
          <span className="font-serif text-base text-ivory-50 group-hover:text-gold-200 transition-colors">Instant Inquiry</span>
        </span>
      </button>

      {/* WhatsApp Modal Popup matching Screenshot 3 */}
      <WhatsAppInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultProgram={defaultProgram}
      />
    </>
  );
}
