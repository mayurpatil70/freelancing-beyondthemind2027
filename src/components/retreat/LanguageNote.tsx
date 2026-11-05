import React from 'react';
import { Languages } from 'lucide-react';

export function LanguageNote() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4 rounded-2xl border border-gold-500/25 bg-[#07261F]/60 backdrop-blur-sm px-5 py-4">
        <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full border border-gold-400/40 bg-gold-500/10">
          <Languages className="w-4.5 h-4.5 text-gold-300" aria-hidden="true" />
        </span>
        <p className="text-sm text-ivory-200/85 leading-relaxed">
          <span className="block text-[10px] tracking-[0.3em] uppercase text-gold-400 mb-0.5">Language</span>
          Retreat sessions are conducted in <strong className="font-medium text-ivory-50">English</strong>, with{' '}
          <strong className="font-medium text-ivory-50">Hindi translation</strong> available for participants who require it.
        </p>
      </div>
    </div>
  );
}
