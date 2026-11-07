'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThemeSelectOption {
  value: string;
  label: string;
  description?: string;
}

export interface ThemeSelectProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | ThemeSelectOption)[];
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
  required?: boolean;
}

export function ThemeSelect({
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  menuClassName = '',
  disabled = false,
  required = false,
}: ThemeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to object format
  const normalizedOptions: ThemeSelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Hidden input for standard form serialization */}
      {name && <input type="hidden" name={name} value={value} required={required} />}

      {/* Dropdown Trigger Button */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'w-full rounded-xl bg-[#031713]/80 border border-gold-500/25 px-4 py-3 text-sm text-ivory-50 flex items-center justify-between text-left cursor-pointer transition-all hover:border-gold-400 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
      >
        <span className={selectedOption ? 'text-ivory-50 truncate' : 'text-ivory-200/40 truncate'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gold-400 shrink-0 ml-2 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Sacred Theme Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className={cn(
            'absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-y-auto rounded-xl bg-[#07261F] border border-gold-400/40 p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(212,175,55,0.15)] backdrop-blur-2xl space-y-1 animate-in fade-in zoom-in-95 duration-150',
            menuClassName
          )}
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(212, 175, 55, 0.4) transparent',
          }}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-gold-500/25 to-gold-600/15 text-gold-300 font-medium border border-gold-400/40 shadow-sm'
                    : 'text-ivory-100 hover:bg-gold-500/12 hover:text-gold-200 border border-transparent'
                }`}
              >
                <div className="flex flex-col pr-2">
                  <span className="font-normal">{opt.label}</span>
                  {opt.description && (
                    <span className="text-[10px] text-stone-subtle/70 mt-0.5">
                      {opt.description}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-gold-400 shrink-0 ml-auto" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
