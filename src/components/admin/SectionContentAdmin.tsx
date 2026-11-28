'use client';

import React from 'react';
import Link from 'next/link';
import { FAQItem, ParticipationTier, Testimonial } from '@/types';
import { ChevronDown, ChevronUp, Plus, Save, Tag, Trash2 } from 'lucide-react';
import { RichTextField } from '@/components/admin/RichTextField';

// Admin editors for the Participation, Testimonials and FAQ sections. Every item and every section has an
// SEO keywords field: those keywords go into meta tags / structured data only and are never shown on cards.

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400';
const labelClass = 'text-[10px] uppercase tracking-wider text-gold-400 font-semibold';

type SaveContent = (type: string, payload: unknown, successMsg: string) => Promise<void>;

interface SectionProps<T> {
  items: T[];
  setItems: (items: T[]) => void;
  saving: boolean;
  saveContent: SaveContent;
  sectionKeywords: string;
  setSectionKeywords: (value: string) => void;
  // Saves the section keywords into settings.meta_keywords (shared with the SEO tab).
  saveSectionKeywords: () => Promise<void>;
}

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function KeywordsField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1 p-4 rounded-xl bg-emerald-950/60 border border-gold-500/25">
      <label className="text-[11px] uppercase tracking-wider text-gold-300 font-bold flex items-center gap-1.5">
        <Tag className="w-3.5 h-3.5 text-gold-400" />
        <span>{label}</span>
      </label>
      <p className="text-[10px] text-stone-subtle/70 font-light">{hint}</p>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="keyword 1, keyword 2, keyword 3..."
        className={inputClass}
      />
    </div>
  );
}

function SectionHeader({
  title,
  description,
  addLabel,
  onAdd,
  onSave,
  saving,
  saveLabel,
}: {
  title: string;
  description: React.ReactNode;
  addLabel: string;
  onAdd: () => void;
  onSave: () => void;
  saving: boolean;
  saveLabel: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
      <div>
        <h3 className="font-serif text-2xl text-ivory-50 font-light">{title}</h3>
        <p className="text-xs text-stone-subtle/80 mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{addLabel}</span>
        </button>
        <SaveButton onSave={onSave} saving={saving} label={saveLabel} />
      </div>
    </div>
  );
}

function SaveButton({ onSave, saving, label }: { onSave: () => void; saving: boolean; label: string }) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
    >
      <Save className="w-3.5 h-3.5" />
      <span>{saving ? 'Saving...' : label}</span>
    </button>
  );
}

function CardShell({
  index,
  count,
  title,
  onMove,
  onDelete,
  children,
}: {
  index: number;
  count: number;
  title: string;
  onMove: (to: number) => void;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  const btn =
    'p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30';
  return (
    <div className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4 shadow-xl">
      <div className="flex items-center justify-between gap-3 border-b border-gold-500/15 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 shrink-0 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-sm font-bold">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h4 className="font-serif text-lg text-ivory-50 font-medium truncate">{title}</h4>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button type="button" disabled={index === 0} onClick={() => onMove(index - 1)} className={btn} title="Move up">
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={index === count - 1}
            onClick={() => onMove(index + 1)}
            className={btn}
            title="Move down"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 ml-1"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

const ITEM_KEYWORDS_HINT =
  'Not shown on the card. Added to this page’s meta keywords and Google structured data only.';
const SECTION_KEYWORDS_HINT =
  'Not shown on the website. Used for this page’s meta keywords and structured data (also editable in the SEO tab).';

// ---------------------------------------------------------------------------------------------------------
// Participation (/participation)
// ---------------------------------------------------------------------------------------------------------

export function ParticipationAdmin(props: SectionProps<ParticipationTier>) {
  const { items, setItems, saving, saveContent, sectionKeywords, setSectionKeywords, saveSectionKeywords } = props;
  const update = (index: number, changes: Partial<ParticipationTier>) =>
    setItems(items.map((t, i) => (i === index ? { ...t, ...changes } : t)));

  const save = async () => {
    if (items.some((t) => !t.title.trim())) {
      alert('Every participation option needs a title.');
      return;
    }
    const cleaned = items.map((t) => ({
      ...t,
      price: (t.price || '').replace(/[^\d.]/g, ''),
      inclusions: (t.inclusions || []).map((x) => x.trim()).filter(Boolean),
    }));
    setItems(cleaned);
    await saveContent('participation', cleaned, 'Participation options saved and published!');
    await saveSectionKeywords();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Participation & Accommodations"
        description={
          <>
            Edit the option cards on{' '}
            <Link href="/participation" target="_blank" className="text-gold-300 underline">
              /participation
            </Link>
            . A price (INR) is optional: when set it shows on the card and is sent to Google as the event&apos;s ticket
            price.
          </>
        }
        addLabel="Add Option"
        onAdd={() =>
          setItems([
            ...items,
            {
              id: newId('tier'),
              title: 'New Option',
              subtitle: '',
              description: '',
              inclusions: [],
              status_note: '',
              price: '',
              keywords: '',
            },
          ])
        }
        onSave={save}
        saving={saving}
        saveLabel="Save Participation"
      />

      <KeywordsField
        label="Participation page SEO keywords (comma separated)"
        hint={SECTION_KEYWORDS_HINT}
        value={sectionKeywords}
        onChange={setSectionKeywords}
      />

      {items.map((t, index) => (
        <CardShell
          key={t.id}
          index={index}
          count={items.length}
          title={t.title || 'Untitled option'}
          onMove={(to) => setItems(moveItem(items, index, to))}
          onDelete={() => {
            if (confirm(`Remove "${t.title}"? Click Save afterwards to publish the change.`)) {
              setItems(items.filter((x) => x.id !== t.id));
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1">
              <label className={labelClass}>Title</label>
              <input type="text" value={t.title} onChange={(e) => update(index, { title: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-6 space-y-1">
              <label className={labelClass}>Small heading above the title</label>
              <input
                type="text"
                value={t.subtitle}
                onChange={(e) => update(index, { subtitle: e.target.value })}
                placeholder="e.g. Single Occupancy Accommodation"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Description</label>
              <RichTextField rows={4} value={t.description} onChange={(v) => update(index, { description: v })} />
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Included items (one per line)</label>
              <textarea
                rows={4}
                value={(t.inclusions || []).join('\n')}
                onChange={(e) => update(index, { inclusions: e.target.value.split('\n') })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-8 space-y-1">
              <label className={labelClass}>Availability note (bottom of card)</label>
              <input
                type="text"
                value={t.status_note}
                onChange={(e) => update(index, { status_note: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Price in ₹ (optional)</label>
              <input
                type="text"
                inputMode="numeric"
                value={t.price || ''}
                onChange={(e) => update(index, { price: e.target.value })}
                placeholder="e.g. 45000"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-12">
              <KeywordsField
                label="SEO keywords for this option (comma separated)"
                hint={ITEM_KEYWORDS_HINT}
                value={t.keywords || ''}
                onChange={(v) => update(index, { keywords: v })}
              />
            </div>
          </div>
        </CardShell>
      ))}

      {items.length > 0 && (
        <div className="flex justify-end">
          <SaveButton onSave={save} saving={saving} label="Save Participation" />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------
// Testimonials (home page carousel + /testimonials)
// ---------------------------------------------------------------------------------------------------------

export function TestimonialsAdmin(props: SectionProps<Testimonial>) {
  const { items, setItems, saving, saveContent, sectionKeywords, setSectionKeywords, saveSectionKeywords } = props;
  const update = (index: number, changes: Partial<Testimonial>) =>
    setItems(items.map((t, i) => (i === index ? { ...t, ...changes } : t)));

  const save = async () => {
    if (items.some((t) => !t.name.trim() || !t.full_testimonial.trim())) {
      alert('Every testimonial needs a name and the testimonial text.');
      return;
    }
    await saveContent('testimonials', items, 'Testimonials saved and published!');
    await saveSectionKeywords();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Seeker Testimonials"
        description={
          <>
            Edit the testimonials shown on the home page and{' '}
            <Link href="/testimonials" target="_blank" className="text-gold-300 underline">
              /testimonials
            </Link>
            .
          </>
        }
        addLabel="Add Testimonial"
        onAdd={() =>
          setItems([
            ...items,
            {
              id: newId('t'),
              name: '',
              location: '',
              edition: '',
              heading: '',
              full_testimonial: '',
              is_featured: true,
              keywords: '',
            },
          ])
        }
        onSave={save}
        saving={saving}
        saveLabel="Save Testimonials"
      />

      <KeywordsField
        label="Testimonials page SEO keywords (comma separated)"
        hint={SECTION_KEYWORDS_HINT}
        value={sectionKeywords}
        onChange={setSectionKeywords}
      />

      {items.map((t, index) => (
        <CardShell
          key={t.id}
          index={index}
          count={items.length}
          title={t.name || 'New testimonial'}
          onMove={(to) => setItems(moveItem(items, index, to))}
          onDelete={() => {
            if (confirm(`Remove the testimonial from "${t.name || 'this seeker'}"? Click Save afterwards to publish.`)) {
              setItems(items.filter((x) => x.id !== t.id));
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Name</label>
              <input type="text" value={t.name} onChange={(e) => update(index, { name: e.target.value })} className={inputClass} />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={t.location}
                onChange={(e) => update(index, { location: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Edition / programme</label>
              <input
                type="text"
                value={t.edition}
                onChange={(e) => update(index, { edition: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Heading (optional, shown at the top of the card)</label>
              <input
                type="text"
                value={t.heading || ''}
                onChange={(e) => update(index, { heading: e.target.value })}
                placeholder="e.g. A Second Birth"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Full testimonial</label>
              <RichTextField
                rows={8}
                value={t.full_testimonial}
                onChange={(v) => update(index, { full_testimonial: v })}
              />
            </div>
            <div className="sm:col-span-12">
              <label className="inline-flex items-center gap-2 text-xs text-ivory-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!t.is_featured}
                  onChange={(e) => update(index, { is_featured: e.target.checked })}
                  className="accent-gold-500"
                />
                <span>Show on the home page</span>
              </label>
              <p className="text-[10px] text-stone-subtle/70 mt-1">
                The /testimonials page always shows every testimonial. If none is ticked, the home page shows all of them too.
              </p>
            </div>
            <div className="sm:col-span-12">
              <KeywordsField
                label="SEO keywords for this testimonial (comma separated)"
                hint={ITEM_KEYWORDS_HINT}
                value={t.keywords || ''}
                onChange={(v) => update(index, { keywords: v })}
              />
            </div>
          </div>
        </CardShell>
      ))}

      {items.length > 0 && (
        <div className="flex justify-end">
          <SaveButton onSave={save} saving={saving} label="Save Testimonials" />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------
// FAQ (/faq)
// ---------------------------------------------------------------------------------------------------------

const FAQ_CATEGORIES: FAQItem['category'][] = [
  'General & Dates',
  'Retreat Experience',
  'Location & Travel',
  'Accommodations',
  'Daily Guided Meditation',
  'Registration & Payment',
];

export function FAQAdmin(props: SectionProps<FAQItem>) {
  const { items, setItems, saving, saveContent, sectionKeywords, setSectionKeywords, saveSectionKeywords } = props;
  const update = (index: number, changes: Partial<FAQItem>) =>
    setItems(items.map((f, i) => (i === index ? { ...f, ...changes } : f)));

  const save = async () => {
    if (items.some((f) => !f.question.trim() || !f.answer.trim())) {
      alert('Every FAQ needs a question and an answer.');
      return;
    }
    await saveContent('faqs', items, 'FAQs saved and published!');
    await saveSectionKeywords();
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Frequently Asked Questions"
        description={
          <>
            Edit the questions on{' '}
            <Link href="/faq" target="_blank" className="text-gold-300 underline">
              /faq
            </Link>
            . They are also sent to Google as FAQ structured data.
          </>
        }
        addLabel="Add FAQ"
        onAdd={() =>
          setItems([
            ...items,
            { id: newId('faq'), question: '', answer: '', category: 'General & Dates', keywords: '' },
          ])
        }
        onSave={save}
        saving={saving}
        saveLabel="Save FAQs"
      />

      <KeywordsField
        label="FAQ page SEO keywords (comma separated)"
        hint={SECTION_KEYWORDS_HINT}
        value={sectionKeywords}
        onChange={setSectionKeywords}
      />

      {items.map((f, index) => (
        <CardShell
          key={f.id}
          index={index}
          count={items.length}
          title={f.question || 'New question'}
          onMove={(to) => setItems(moveItem(items, index, to))}
          onDelete={() => {
            if (confirm('Remove this FAQ? Click Save afterwards to publish the change.')) {
              setItems(items.filter((x) => x.id !== f.id));
            }
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8 space-y-1">
              <label className={labelClass}>Question</label>
              <input
                type="text"
                value={f.question}
                onChange={(e) => update(index, { question: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Category</label>
              <select
                value={f.category}
                onChange={(e) => update(index, { category: e.target.value as FAQItem['category'] })}
                className={inputClass}
              >
                {FAQ_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Answer</label>
              <RichTextField rows={5} value={f.answer} onChange={(v) => update(index, { answer: v })} />
            </div>
            <div className="sm:col-span-12">
              <KeywordsField
                label="SEO keywords for this question (comma separated)"
                hint={ITEM_KEYWORDS_HINT}
                value={f.keywords || ''}
                onChange={(v) => update(index, { keywords: v })}
              />
            </div>
          </div>
        </CardShell>
      ))}

      {items.length > 0 && (
        <div className="flex justify-end">
          <SaveButton onSave={save} saving={saving} label="Save FAQs" />
        </div>
      )}
    </div>
  );
}
