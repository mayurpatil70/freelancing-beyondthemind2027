'use client';

import React, { useEffect, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  id?: string;
  /** Accessible name, e.g. "Number of travelers". */
  label: string;
  /** Visual size: "md" matches the enquiry modal inputs, "sm" the contact page inputs. */
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * − / + counter with a typeable middle field. The field may be empty while the visitor types,
 * and is clamped to [min, max] when it loses focus, so it never snaps back mid-edit on mobile.
 */
export function NumberStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  id,
  label,
  size = 'md',
  className = '',
}: NumberStepperProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const commit = (raw: string) => {
    const n = parseInt(raw, 10);
    const next = Number.isNaN(n) ? value : clamp(n);
    onChange(next);
    setDraft(String(next));
  };

  const step = (delta: number) => onChange(clamp(value + delta));

  const btn =
    'flex items-center justify-center shrink-0 text-gold-300 transition-colors hover:bg-gold-500/10 hover:text-gold-200 active:bg-gold-500/20 disabled:opacity-30 disabled:pointer-events-none focus:outline-none focus-visible:bg-gold-500/15';
  const btnSize = size === 'sm' ? 'w-10' : 'w-11';
  const height = size === 'sm' ? 'h-[42px]' : 'h-[44px]';

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex items-stretch overflow-hidden ${height} ${className}`}
    >
      <button
        type="button"
        onClick={() => step(-1)}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
        className={`${btn} ${btnSize} border-r border-gold-500/25`}
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        role="spinbutton"
        value={draft}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '').slice(0, 2);
          setDraft(digits);
          const n = parseInt(digits, 10);
          if (!Number.isNaN(n) && n >= min && n <= max) onChange(n);
        }}
        onBlur={(e) => commit(e.target.value)}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            step(1);
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            step(-1);
          } else if (e.key === 'Enter') {
            commit((e.target as HTMLInputElement).value);
          }
        }}
        className="min-w-0 flex-1 bg-transparent text-center text-sm font-medium text-ivory-50 tabular-nums focus:outline-none"
      />
      <button
        type="button"
        onClick={() => step(1)}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
        className={`${btn} ${btnSize} border-l border-gold-500/25`}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
