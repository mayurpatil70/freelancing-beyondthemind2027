'use client';

import React from 'react';
import Link from 'next/link';
import { SacredExperience } from '@/types';
import { IMAGE_ACCEPT } from '@/lib/media/rules';
import { ChevronUp, ChevronDown, ExternalLink, Plus, Save, Tag, Trash2, Upload, X } from 'lucide-react';

const ICON_OPTIONS = ['Sun', 'Heart', 'Feather', 'Flower2', 'Compass', 'Flame', 'CircleDot'];

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400';
const labelClass = 'text-[10px] uppercase tracking-wider text-gold-400 font-semibold';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface HealingSessionsAdminProps {
  sessions: SacredExperience[];
  setSessions: (sessions: SacredExperience[]) => void;
  saving: boolean;
  saveContent: (type: string, payload: unknown, successMsg: string) => Promise<void>;
  handleUploadMedia: (file: File, onDone: (url: string) => void, uploadId: string) => Promise<void>;
  uploading: string | null;
  uploadProgress: number | null;
}

// Admin editor for the /healing-sessions page. Each card here is one session on that page and gets its own
// page at /healing-sessions/<url-slug>.
export function HealingSessionsAdmin({
  sessions,
  setSessions,
  saving,
  saveContent,
  handleUploadMedia,
  uploading,
  uploadProgress,
}: HealingSessionsAdminProps) {
  // Sessions added in this visit follow their title for the page URL; saved ones keep their URL.
  const [newIds, setNewIds] = React.useState<Set<string>>(new Set());

  const renumber = (list: SacredExperience[]) => list.map((s, i) => ({ ...s, order: i + 1 }));

  const update = (index: number, changes: Partial<SacredExperience>) => {
    setSessions(sessions.map((s, i) => (i === index ? { ...s, ...changes } : s)));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= sessions.length) return;
    const list = [...sessions];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    const reordered = renumber(list);
    setSessions(reordered);
    saveContent('healingSessions', reordered, 'Healing session order saved!');
  };

  const addSession = () => {
    const n = sessions.length + 1;
    const used = new Set(sessions.map((s) => s.slug));
    let slug = `healing-session-${n}`;
    while (used.has(slug)) slug = `${slug}-new`;
    const id = `heal-${Date.now().toString(36)}`;
    setNewIds((prev) => new Set(prev).add(id));
    setSessions([
      ...sessions,
      {
        id,
        slug,
        title: `New Session ${n}`,
        subtitle: '',
        short_desc: '',
        full_desc: '',
        image: '',
        icon_name: 'CircleDot',
        order: n,
        spiritual_dimension: '',
        highlights: [],
        keywords: '',
      },
    ]);
  };

  const save = () => {
    const slugs = sessions.map((s) => s.slug.trim());
    if (slugs.some((s) => !s)) {
      alert('Every session needs a page URL (slug).');
      return;
    }
    if (new Set(slugs).size !== slugs.length) {
      alert('Two sessions have the same page URL (slug). Please make each one different.');
      return;
    }
    saveContent('healingSessions', renumber(sessions), 'Healing sessions saved and published!');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
        <div>
          <h3 className="font-serif text-2xl text-ivory-50 font-light">Transformative Healing Sessions</h3>
          <p className="text-xs text-stone-subtle/80 mt-1">
            Add, edit, reorder or remove the sessions shown on{' '}
            <Link href="/healing-sessions" target="_blank" className="text-gold-300 underline">
              /healing-sessions
            </Link>
            . In the description, leave an empty line to start a new paragraph. Click Save to publish.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={addSession}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Session</span>
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Healing Sessions'}</span>
          </button>
        </div>
      </div>

      {sessions.length === 0 && (
        <p className="text-xs text-stone-subtle/70 text-center py-10">No healing sessions yet. Click Add Session.</p>
      )}

      {sessions.map((s, index) => (
        <div key={s.id} className="p-6 rounded-2xl bg-[#07261F]/60 border border-gold-500/25 space-y-4 shadow-xl">
          <div className="flex items-center justify-between gap-3 border-b border-gold-500/15 pb-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-8 h-8 shrink-0 rounded-full bg-gold-500/20 text-gold-300 flex items-center justify-center font-serif text-sm font-bold">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h4 className="font-serif text-lg text-ivory-50 font-medium truncate">{s.title || 'Untitled session'}</h4>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30"
                title="Move up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === sessions.length - 1}
                onClick={() => move(index, index + 1)}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30"
                title="Move down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove "${s.title}"? Click Save afterwards to publish the change.`)) {
                    setSessions(renumber(sessions.filter((x) => x.id !== s.id)));
                  }
                }}
                className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 ml-1"
                title="Delete session"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-6 space-y-1">
              <label className={labelClass}>Session Title</label>
              <input
                type="text"
                value={s.title}
                onChange={(e) => {
                  const title = e.target.value;
                  // A newly added session's URL follows its title until the URL is edited by hand.
                  const autoSlug =
                    newIds.has(s.id) && (/^healing-session-\d+(-new)*$/.test(s.slug) || s.slug === slugify(s.title));
                  update(index, { title, ...(autoSlug && slugify(title) ? { slug: slugify(title) } : {}) });
                }}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-6 space-y-1">
              <label className={labelClass}>Page URL (slug)</label>
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-stone-subtle/60 whitespace-nowrap">/healing-sessions/</span>
                <input
                  type="text"
                  value={s.slug}
                  onChange={(e) => update(index, { slug: slugify(e.target.value) || e.target.value.toLowerCase() })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Tagline (shown under the title)</label>
              <input
                type="text"
                value={s.subtitle}
                onChange={(e) => update(index, { subtitle: e.target.value, short_desc: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-8 space-y-1">
              <label className={labelClass}>Healing Dimension Tag</label>
              <input
                type="text"
                value={s.spiritual_dimension}
                onChange={(e) => update(index, { spiritual_dimension: e.target.value })}
                placeholder="e.g. Relationship Healing"
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-4 space-y-1">
              <label className={labelClass}>Icon</label>
              <select
                value={s.icon_name}
                onChange={(e) => update(index, { icon_name: e.target.value })}
                className={inputClass}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-12 space-y-2">
              <label className={labelClass}>Session Photo (optional, portrait 4:5 works best)</label>
              <div className="flex flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs whitespace-nowrap">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading === `heal-${s.id}` ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT}
                    className="hidden"
                    disabled={uploading !== null}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      handleUploadMedia(
                        file,
                        (url) => {
                          const updated = sessions.map((x, i) => (i === index ? { ...x, image: url } : x));
                          setSessions(updated);
                          saveContent('healingSessions', updated, `Photo for "${s.title}" uploaded & saved!`);
                        },
                        `heal-${s.id}`
                      );
                    }}
                  />
                </label>
                {s.image && (
                  <button
                    type="button"
                    onClick={() => update(index, { image: '' })}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove photo</span>
                  </button>
                )}
              </div>
              {s.image ? (
                <div className="relative w-40 aspect-[4/5] rounded-xl overflow-hidden border border-gold-500/35 bg-black/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover" style={{ objectPosition: s.image_position || 'center' }} />
                  <a
                    href={s.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-1.5 right-1.5 p-1 rounded bg-black/75 text-gold-300"
                    title="Open full photo"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-[11px] text-stone-subtle/60">No photo: the page shows a gold icon panel instead.</p>
              )}
              {s.image && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-stone-subtle/70">Photo focus (which part stays in view):</span>
                  {[
                    ['Left', '20% center'],
                    ['Centre', 'center'],
                    ['Right', '80% center'],
                  ].map(([label, value]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => update(index, { image_position: value })}
                      className={`px-3 py-1 rounded-lg border text-[11px] ${
                        (s.image_position || 'center') === value
                          ? 'bg-gold-500/30 border-gold-400 text-gold-200'
                          : 'bg-emerald-950 border-gold-500/25 text-ivory-200/80'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="sm:col-span-12 space-y-1">
              <label className={labelClass}>Description (empty line = new paragraph)</label>
              <textarea
                rows={8}
                value={s.full_desc}
                onChange={(e) => update(index, { full_desc: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-12 space-y-1 p-4 rounded-xl bg-emerald-950/60 border border-gold-500/25">
              <label className="text-[11px] uppercase tracking-wider text-gold-300 font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gold-400" />
                <span>SEO Keywords for this session (comma separated)</span>
              </label>
              <p className="text-[10px] text-stone-subtle/70 font-light">
                Not shown on the website. Used only in this session&apos;s own page meta tags and Google structured data.
              </p>
              <textarea
                rows={2}
                value={s.keywords || ''}
                onChange={(e) => update(index, { keywords: e.target.value })}
                placeholder="keyword 1, keyword 2, keyword 3..."
                className={inputClass}
              />
            </div>
          </div>
        </div>
      ))}

      {sessions.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Healing Sessions'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
