'use client';

import React, { useState, useEffect } from 'react';
import { X, User, Phone, Calendar, Users, MessageSquare } from 'lucide-react';

interface WhatsAppInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export function WhatsAppInquiryModal({
  isOpen,
  onClose,
  defaultProgram = 'The Divine Retreat - Rishikesh 2027 (Offline)',
}: WhatsAppInquiryModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(defaultProgram);
  const [participants, setParticipants] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (defaultProgram) {
      setSelectedProgram(defaultProgram);
    }
  }, [defaultProgram]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = [
      `*Namaste Beyond the Mind Team,*`,
      ``,
      `I would like to enquire about: *${selectedProgram}*`,
      fullName ? `• *Full Name:* ${fullName}` : null,
      phone ? `• *Phone/WhatsApp:* ${phone}` : null,
      `• *Participants/Travelers:* ${participants}`,
      message ? `• *Note/Query:* ${message}` : null,
      ``,
      `Kindly share further details, schedule, and participation fee. Thank you!`,
    ]
      .filter((line) => line !== null)
      .join('\n');

    const whatsappUrl = `https://wa.me/918075572018?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#071F1B] border border-[#D4AF37]/50 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.15)] text-[#FAF8F5] p-6 sm:p-8 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Radial Gold Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-32 bg-gradient-to-b from-[#D4AF37]/15 to-transparent blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#031713]/80 border border-gold-400/30 flex items-center justify-center text-ivory-200 hover:text-white hover:border-gold-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-400/40 text-[11px] font-semibold tracking-[0.2em] text-gold-300 uppercase">
            <span>BEYOND THE MIND</span>
          </div>

          <p className="text-[11px] font-semibold tracking-[0.25em] text-gold-400/90 uppercase pt-2">
            PLAN YOUR SACRED RETREAT JOURNEY
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl font-light text-ivory-50 tracking-wide mt-1">
            INSTANT RETREAT <span className="font-semibold text-gradient-gold">INQUIRY</span>
          </h2>

          <p className="text-xs text-stone-subtle/85 font-light leading-relaxed max-w-md mx-auto pt-1">
            Connect directly with our retreat coordinators on WhatsApp for custom itineraries, Zoom meditation access, pricing, and sanctuary guidance.
          </p>
        </div>

        {/* Inquiry Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gold-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold-400" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-2.5 rounded-lg bg-[#041512] border border-gold-500/30 text-sm text-ivory-50 placeholder:text-stone-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/40 transition-all"
            />
          </div>

          {/* Phone / WhatsApp */}
          <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gold-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Phone / WhatsApp Number</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
              className="w-full px-4 py-2.5 rounded-lg bg-[#041512] border border-gold-500/30 text-sm text-ivory-50 placeholder:text-stone-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/40 transition-all"
            />
          </div>

          {/* Program & Travelers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-8 space-y-1.5">
              <label className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gold-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400" />
                <span>Session / Program of Interest</span>
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#041512] border border-gold-500/30 text-xs sm:text-sm text-ivory-50 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/40 transition-all appearance-none cursor-pointer"
              >
                <option value="The Divine Retreat - Rishikesh 2027 (Offline)">
                  The Divine Retreat 2027 (Offline • Rishikesh)
                </option>
                <option value="The Divine Retreat 2027 (Online Live Stream)">
                  The Divine Retreat 2027 (Online Live Stream)
                </option>
                <option value="Daily Guided Meditation (Online Zoom Mon-Fri 7:30 PM)">
                  Daily Guided Meditation (Zoom • Mon-Fri 7:30 PM)
                </option>
                <option value="Both Divine Retreat & Daily Guided Meditation">
                  Both Divine Retreat & Daily Practice
                </option>
                <option value="General Spiritual Inquiry / Guidance">
                  General Spiritual Inquiry
                </option>
              </select>
            </div>

            <div className="sm:col-span-4 space-y-1.5">
              <label className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gold-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-gold-400" />
                <span>Travelers</span>
              </label>
              <input
                type="number"
                min={1}
                max={15}
                value={participants}
                onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#041512] border border-gold-500/30 text-sm text-ivory-50 text-center focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/40 transition-all"
              />
            </div>
          </div>

          {/* Optional Message */}
          <div className="space-y-1.5">
            <label className="text-[10px] tracking-[0.18em] uppercase font-semibold text-gold-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gold-400" />
              <span>Questions / Custom Note (Optional)</span>
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Inquiring about single occupancy room or Zoom links"
              className="w-full px-4 py-2 rounded-lg bg-[#041512] border border-gold-500/30 text-xs sm:text-sm text-ivory-50 placeholder:text-stone-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/40 transition-all"
            />
          </div>

          {/* WhatsApp Submit Button (Matching Screenshot 3) */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.55)] active:scale-[0.99]"
            >
              <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current" aria-hidden="true">
                <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.2-3.8 1.2 1.2-3.7-.3-.4a10.4 10.4 0 0 1-1.7-5.7C5.1 9.9 10 5.2 16 5.2s10.9 4.7 10.9 10.6S22 26.4 16 26.4zm6-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.1 1.4 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
              </svg>
              <span>CONNECT ON WHATSAPP</span>
            </button>
          </div>

          {/* Privacy Trust Footer (Matching Screenshot 3) */}
          <p className="text-center text-[10px] text-stone-subtle/75 font-light pt-2">
            🔒 100% Confidential • Instant Response • Verified Spiritual Coordinators
          </p>
        </form>
      </div>
    </div>
  );
}
