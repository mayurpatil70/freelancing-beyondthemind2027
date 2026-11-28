'use client';

import React from 'react';
import Link from 'next/link';
import { GalleryItem, ProgrammeDay } from '@/types';
import { RichTextField } from '@/components/admin/RichTextField';
import { IMAGE_ACCEPT, isVideoUrl } from '@/lib/media/rules';
import { ChevronDown, ChevronUp, Plus, Save, Trash2, Upload } from 'lucide-react';

// Admin editors for the Gallery (/gallery) and the four-day Programme (/programme and the home page timeline).
// Long text fields use RichTextField: headings, subheadings, bold, lists and paragraphs.

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400';
const labelClass = 'text-[10px] uppercase tracking-wider text-gold-400 font-semibold';
const iconBtn =
  'p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30';

type SaveContent = (type: string, payload: unknown, successMsg: string) => Promise<void>;

const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
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

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
    >
      <Plus className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
}

function MoveDelete({
  index,
  count,
  onMove,
  onDelete,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button type="button" disabled={index === 0} onClick={() => onMove(index - 1)} className={iconBtn} title="Move up">
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        disabled={index === count - 1}
        onClick={() => onMove(index + 1)}
        className={iconBtn}
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
  );
}

// ---------------------------------------------------------------------------------------------------------
// Gallery (/gallery)
// ---------------------------------------------------------------------------------------------------------

export const GALLERY_CATEGORIES: GalleryItem['category'][] = [
  'Retreat Experience',
  'Participants',
  'Meditation',
  'Kundalini Awakening',
  'Nature & Mountains',
  'Rishikesh',
  'Sacred Moments',
];

interface GalleryAdminProps {
  items: GalleryItem[];
  setItems: (items: GalleryItem[]) => void;
  saving: boolean;
  saveContent: SaveContent;
  handleUploadMedia: (file: File, onDone: (url: string) => void, uploadId: string) => Promise<void>;
  uploading: string | null;
  uploadProgress: number | null;
}

export function GalleryAdmin({
  items,
  setItems,
  saving,
  saveContent,
  handleUploadMedia,
  uploading,
  uploadProgress,
}: GalleryAdminProps) {
  const update = (index: number, changes: Partial<GalleryItem>) =>
    setItems(items.map((g, i) => (i === index ? { ...g, ...changes } : g)));

  const save = async () => {
    if (items.some((g) => !g.title.trim() || !g.image_url.trim())) {
      alert('Every gallery item needs a title and a photo (upload one or paste a link).');
      return;
    }
    const cleaned = items.map((g) => ({
      ...g,
      title: g.title.trim(),
      image_url: g.image_url.trim(),
      media_type: (isVideoUrl(g.image_url) ? 'video' : 'image') as GalleryItem['media_type'],
    }));
    setItems(cleaned);
    await saveContent('gallery', cleaned, 'Gallery saved and published!');
  };

  const add = () =>
    setItems([
      {
        id: newId('gal'),
        title: '',
        category: 'Retreat Experience',
        image_url: '',
        media_type: 'image',
        caption: '',
        location: '',
      },
      ...items,
    ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
        <div>
          <h3 className="font-serif text-2xl text-ivory-50 font-light">Photo Gallery</h3>
          <p className="text-xs text-stone-subtle/80 mt-1">
            Photos shown on{' '}
            <Link href="/gallery" target="_blank" className="text-gold-300 underline">
              /gallery
            </Link>
            . New items appear at the top. Upload a photo or paste a photo / video (.mp4) link, then click Save.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AddButton onClick={add} label="Add Photo" />
          <SaveButton onSave={save} saving={saving} label="Save Gallery" />
        </div>
      </div>

      {items.length === 0 && (
        <p className="text-xs text-stone-subtle/70 text-center py-10">No gallery items yet. Click “Add Photo”.</p>
      )}

      {items.map((g, index) => (
        <div key={g.id} className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-gold-500/15 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 shrink-0 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-sm font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4 className="font-serif text-lg text-ivory-50 font-medium truncate">{g.title || 'New photo'}</h4>
            </div>
            <MoveDelete
              index={index}
              count={items.length}
              onMove={(to) => setItems(moveItem(items, index, to))}
              onDelete={() => {
                if (confirm(`Remove "${g.title || 'this photo'}" from the gallery? Click Save afterwards to publish.`)) {
                  setItems(items.filter((x) => x.id !== g.id));
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-3">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-gold-500/35 bg-black/60 flex items-center justify-center">
                {g.image_url ? (
                  isVideoUrl(g.image_url) ? (
                    <video src={`${g.image_url}#t=0.1`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                  )
                ) : (
                  <span className="text-[11px] text-stone-subtle/60">No photo yet</span>
                )}
              </div>
            </div>

            <div className="sm:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Title</label>
                <input type="text" value={g.title} onChange={(e) => update(index, { title: e.target.value })} className={inputClass} />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Category</label>
                <select
                  value={g.category}
                  onChange={(e) => update(index, { category: e.target.value as GalleryItem['category'] })}
                  className={inputClass}
                >
                  {GALLERY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Location (optional)</label>
                <input
                  type="text"
                  value={g.location || ''}
                  onChange={(e) => update(index, { location: e.target.value })}
                  placeholder="e.g. Rishikesh, Uttarakhand"
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Photo</label>
                <div className="flex items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs whitespace-nowrap">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading === `gal-${g.id}` ? `Uploading ${uploadProgress ?? 0}%` : 'Upload'}</span>
                    <input
                      type="file"
                      accept={IMAGE_ACCEPT}
                      className="hidden"
                      disabled={uploading !== null}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = '';
                        if (!file) return;
                        handleUploadMedia(
                          file,
                          (url) => update(index, { image_url: url, media_type: 'image' }),
                          `gal-${g.id}`
                        );
                      }}
                    />
                  </label>
                  <input
                    type="text"
                    value={g.image_url}
                    onChange={(e) => update(index, { image_url: e.target.value })}
                    placeholder="or paste a link"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Caption</label>
              <RichTextField rows={3} value={g.caption} onChange={(v) => update(index, { caption: v })} />
            </div>
          </div>
        </div>
      ))}

      {items.length > 0 && (
        <div className="flex justify-end">
          <SaveButton onSave={save} saving={saving} label="Save Gallery" />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------------------------------------
// Programme (/programme and the home page timeline)
// ---------------------------------------------------------------------------------------------------------

interface ProgrammeAdminProps {
  days: ProgrammeDay[];
  setDays: (days: ProgrammeDay[]) => void;
  saving: boolean;
  saveContent: SaveContent;
}

type Session = ProgrammeDay['sessions'][number];

export function ProgrammeAdmin({ days, setDays, saving, saveContent }: ProgrammeAdminProps) {
  const updateDay = (index: number, changes: Partial<ProgrammeDay>) =>
    setDays(days.map((d, i) => (i === index ? { ...d, ...changes } : d)));

  const updateSession = (dayIndex: number, sessionIndex: number, changes: Partial<Session>) =>
    updateDay(dayIndex, {
      sessions: days[dayIndex].sessions.map((s, i) => (i === sessionIndex ? { ...s, ...changes } : s)),
    });

  const save = async () => {
    if (days.some((d) => !d.theme.trim() || d.sessions.some((s) => !s.title.trim()))) {
      alert('Every day needs a theme, and every session needs a title.');
      return;
    }
    await saveContent('programme', days, 'Programme saved and published!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
        <div>
          <h3 className="font-serif text-2xl text-ivory-50 font-light">Divine Retreat Programme</h3>
          <p className="text-xs text-stone-subtle/80 mt-1">
            The day-by-day schedule on{' '}
            <Link href="/programme" target="_blank" className="text-gold-300 underline">
              /programme
            </Link>{' '}
            and the home page.
          </p>
        </div>
        <SaveButton onSave={save} saving={saving} label="Save Programme" />
      </div>

      {days.map((d, dayIndex) => (
        <div key={`${d.day_number}-${dayIndex}`} className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gold-500/15 pb-3">
            <span className="px-3 h-8 shrink-0 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-sm font-bold">
              {d.day_name || `Day ${d.day_number}`}
            </span>
            <h4 className="font-serif text-lg text-ivory-50 font-medium truncate">{d.theme}</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-3 space-y-1">
              <label className={labelClass}>Day label</label>
              <input
                type="text"
                value={d.day_name}
                onChange={(e) => updateDay(dayIndex, { day_name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Date shown</label>
              <input
                type="text"
                value={d.formatted_date}
                onChange={(e) => updateDay(dayIndex, { formatted_date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-5 space-y-1">
              <label className={labelClass}>Theme (day title)</label>
              <input
                type="text"
                value={d.theme}
                onChange={(e) => updateDay(dayIndex, { theme: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Subtitle (optional)</label>
              <input
                type="text"
                value={d.subtitle}
                onChange={(e) => updateDay(dayIndex, { subtitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Day summary</label>
              <RichTextField rows={4} value={d.summary} onChange={(v) => updateDay(dayIndex, { summary: v })} />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-gold-300 font-bold">Sessions</span>
              <AddButton
                label="Add Session"
                onClick={() =>
                  updateDay(dayIndex, { sessions: [...d.sessions, { phase: '', title: '', description: '' }] })
                }
              />
            </div>
            {d.sessions.map((s, sIndex) => (
              <div key={sIndex} className="p-4 rounded-xl bg-emerald-950/60 border border-gold-500/20 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 flex-1">
                    <div className="sm:col-span-4 space-y-1">
                      <label className={labelClass}>Time</label>
                      <input
                        type="text"
                        value={s.phase}
                        onChange={(e) => updateSession(dayIndex, sIndex, { phase: e.target.value })}
                        placeholder="e.g. Afternoon 2:30 PM"
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-8 space-y-1">
                      <label className={labelClass}>Session title</label>
                      <input
                        type="text"
                        value={s.title}
                        onChange={(e) => updateSession(dayIndex, sIndex, { title: e.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <MoveDelete
                    index={sIndex}
                    count={d.sessions.length}
                    onMove={(to) => updateDay(dayIndex, { sessions: moveItem(d.sessions, sIndex, to) })}
                    onDelete={() => {
                      if (confirm(`Remove "${s.title || 'this session'}"? Click Save afterwards to publish.`)) {
                        updateDay(dayIndex, { sessions: d.sessions.filter((_, i) => i !== sIndex) });
                      }
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClass}>Description</label>
                  <RichTextField
                    rows={3}
                    value={s.description}
                    onChange={(v) => updateSession(dayIndex, sIndex, { description: v })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {days.length > 0 && (
        <div className="flex justify-end">
          <SaveButton onSave={save} saving={saving} label="Save Programme" />
        </div>
      )}
    </div>
  );
}
