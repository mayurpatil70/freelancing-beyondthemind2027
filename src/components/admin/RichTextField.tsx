'use client';

import React, { useRef, useState } from 'react';
import { Heading2, Heading3, Bold, List, Pilcrow, Eye, Pencil } from 'lucide-react';
import { RichTextBody } from '@/components/ui/RichTextBody';

interface RichTextFieldProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

// Textarea with a small formatting toolbar. Formatting is stored as simple marks
// ("## " heading, "### " subheading, "- " list item, **bold**, each line = its own paragraph).
export function RichTextField({ value, onChange, rows = 10, placeholder, className }: RichTextFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState(false);

  const apply = (next: string, selStart: number, selEnd: number) => {
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(selStart, selEnd);
    });
  };

  // Puts a mark at the start of every selected line (replacing any other line mark).
  const linePrefix = (prefix: string) => {
    const el = ref.current;
    const text = value || '';
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const nl = text.indexOf('\n', end);
    const lineEnd = nl === -1 ? text.length : nl;
    const lines = text.slice(lineStart, lineEnd).split('\n').map((l) => {
      const bare = l.replace(/^(#{2,3}\s+|[-*]\s+|>\s+)/, '');
      return l.startsWith(prefix) ? bare : prefix + bare;
    });
    const replaced = lines.join('\n');
    apply(text.slice(0, lineStart) + replaced + text.slice(lineEnd), lineStart, lineStart + replaced.length);
  };

  const bold = () => {
    const el = ref.current;
    const text = value || '';
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const selected = text.slice(start, end) || 'bold text';
    const next = `${text.slice(0, start)}**${selected}**${text.slice(end)}`;
    apply(next, start + 2, start + 2 + selected.length);
  };

  const paragraph = () => {
    const el = ref.current;
    const text = value || '';
    const pos = el?.selectionEnd ?? text.length;
    const next = `${text.slice(0, pos).replace(/\s+$/, '')}\n\n${text.slice(pos).replace(/^\s+/, '')}`;
    const caret = text.slice(0, pos).replace(/\s+$/, '').length + 2;
    apply(next, caret, caret);
  };

  const btn =
    'inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-950 border border-gold-500/25 text-[11px] text-ivory-200 hover:border-gold-400 hover:text-gold-200 transition-colors disabled:opacity-40';

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" className={btn} disabled={preview} onClick={() => linePrefix('## ')} title="Heading">
          <Heading2 className="w-3.5 h-3.5" /> Heading
        </button>
        <button type="button" className={btn} disabled={preview} onClick={() => linePrefix('### ')} title="Small gold subheading">
          <Heading3 className="w-3.5 h-3.5" /> Subheading
        </button>
        <button type="button" className={btn} disabled={preview} onClick={bold} title="Bold">
          <Bold className="w-3.5 h-3.5" /> Bold
        </button>
        <button type="button" className={btn} disabled={preview} onClick={() => linePrefix('- ')} title="Bullet list">
          <List className="w-3.5 h-3.5" /> List
        </button>
        <button type="button" className={btn} disabled={preview} onClick={paragraph} title="Start a new paragraph">
          <Pilcrow className="w-3.5 h-3.5" /> New paragraph
        </button>
        <button type="button" className={`${btn} ml-auto`} onClick={() => setPreview((p) => !p)}>
          {preview ? <Pencil className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {preview ? (
        <div className="min-h-[8rem] p-4 rounded-xl bg-[#07261F]/70 border border-gold-500/25">
          <RichTextBody content={value} />
        </div>
      ) : (
        <textarea
          ref={ref}
          rows={rows}
          value={value || ''}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={className || 'w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 leading-relaxed'}
        />
      )}

      <p className="text-[10px] text-stone-subtle/70 leading-relaxed">
        Press Enter for a new paragraph. <code className="text-gold-200">## </code> heading,{' '}
        <code className="text-gold-200">### </code> subheading, <code className="text-gold-200">- </code> list item,{' '}
        <code className="text-gold-200">**text**</code> bold. Use Preview to check before saving.
      </p>
    </div>
  );
}
