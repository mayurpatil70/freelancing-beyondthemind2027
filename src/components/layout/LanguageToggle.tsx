'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ml', label: 'Malayalam', nativeLabel: 'മലയാളം' },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = languageOptions.find((opt) => opt.code === language) || languageOptions[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative inline-block text-left select-none', className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
        className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07261F]/90 hover:bg-[#07261F] text-gold-300 hover:text-gold-200 border border-gold-500/35 hover:border-gold-400 transition-all duration-200 shadow-md backdrop-blur-md text-xs font-medium tracking-wide focus:outline-none focus:ring-1 focus:ring-gold-400"
      >
        <Languages className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="font-serif tracking-normal text-ivory-100 text-xs font-semibold">
          {currentOption.nativeLabel}
        </span>
        <ChevronDown
          className={cn(
            'w-3 h-3 text-gold-400/80 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#07261F]/95 backdrop-blur-xl border border-gold-500/35 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right focus:outline-none"
        >
          <div className="px-3 py-1.5 border-b border-gold-500/15 mb-1">
            <span className="text-[10px] uppercase tracking-widest text-gold-400/80 font-semibold block">
              Choose Language
            </span>
          </div>

          {languageOptions.map((opt) => {
            const isSelected = opt.code === language;
            return (
              <button
                key={opt.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLanguage(opt.code);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors',
                  isSelected
                    ? 'bg-gold-500/20 text-gold-200 border border-gold-500/30 font-medium'
                    : 'text-stone-subtle/90 hover:bg-gold-500/10 hover:text-ivory-50'
                )}
              >
                <div className="flex flex-col">
                  <span className="font-serif font-semibold text-ivory-50 text-sm">
                    {opt.nativeLabel}
                  </span>
                  <span className="text-[10px] text-gold-400/70 font-light">
                    {opt.label} {opt.code === 'en' ? '(Default)' : ''}
                  </span>
                </div>

                {isSelected && <Check className="w-4 h-4 text-gold-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
