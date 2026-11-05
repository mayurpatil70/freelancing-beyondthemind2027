"use client";

import React, { useState } from "react";
import { MessageCircle, X, ChevronRight, Sparkles } from "lucide-react";
import { formatWhatsAppUrl } from "@/lib/utils";

export function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "+91 8075572018";

  const quickMessages = [
    {
      label: "Retreat Enquiry (Oct 6–9, 2027)",
      text: "Namaste Beyond the Mind Team,\n\nI would like to enquire about participation in Beyond the Mind 2027: The Divine Retreat in Rishikesh.",
    },
    {
      label: "Daily Guided Meditation Enquiry",
      text: "Namaste Beyond the Mind Team,\n\nI am interested in joining your Monday–Friday 7:30 PM Zoom Daily Guided Meditation sessions.",
    },
    {
      label: "Travel & Venue Concierge",
      text: "Namaste Beyond the Mind Concierge,\n\nI have questions regarding transport connectivity and travel arrangements to Rishikesh for the retreat.",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded Quick Options Menu */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl bg-[#07261F]/95 backdrop-blur-xl border border-gold-500/30 p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 text-ivory-100">
          <div className="flex items-start justify-between pb-3 border-b border-gold-500/20">
            <div>
              <span className="text-[10px] tracking-widest text-gold-400 uppercase font-semibold block">
                Official Concierge
              </span>
              <h4 className="font-serif text-base text-ivory-50 font-medium">
                Beyond the Mind Assistance
              </h4>
              <p className="text-xs text-stone-subtle/80 mt-0.5">
                +91 8075572018
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full text-stone-subtle hover:text-gold-300 hover:bg-emerald-900/40 transition-colors"
              aria-label="Close Concierge Menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-subtle/90 my-3 leading-relaxed">
            Connect directly with our retreat coordinators. Select an enquiry
            topic below to start a chat:
          </p>

          <div className="space-y-2">
            {quickMessages.map((item, idx) => (
              <a
                key={idx}
                href={formatWhatsAppUrl(phoneNumber, item.text)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-gold-500/20 hover:border-gold-400/50 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-ivory-100 group-hover:text-gold-200">
                    {item.label}
                  </span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gold-400/70 group-hover:translate-x-0.5 transition-transform" />
              </a>
            ))}
          </div>

          <div className="mt-3 pt-2 text-center text-[11px] text-stone-subtle/60">
            Typically replies within a few hours • Direct WhatsApp Link
          </div>
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-800 to-emerald-900 border border-gold-400/60 shadow-gold-sm hover:shadow-gold-md hover:border-gold-300 text-ivory-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gold-400"
        aria-label="Open WhatsApp Retreat Concierge"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-400"></span>
        </span>
        <MessageCircle className="w-5 h-5 text-gold-300 group-hover:text-gold-200 transition-colors" />
        <span className="text-xs font-medium tracking-wider uppercase text-gold-300 group-hover:text-gold-200 hidden sm:inline">
          Retreat Concierge
        </span>
      </button>
    </div>
  );
}
