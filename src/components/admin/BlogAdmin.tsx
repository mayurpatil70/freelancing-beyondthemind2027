'use client';

import React from 'react';
import Link from 'next/link';
import { BlogFAQ, BlogPost } from '@/types';
import { IMAGE_ACCEPT } from '@/lib/media/rules';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Save,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  X,
} from 'lucide-react';

const inputClass =
  'w-full px-3 py-2 rounded-xl bg-emerald-950 border border-gold-500/25 text-xs text-ivory-100 focus:outline-none focus:border-gold-400';
const labelClass = 'text-[10px] uppercase tracking-wider text-gold-400 font-semibold';
const smallBtn =
  'p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 disabled:opacity-30';

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const today = () => new Date().toISOString().slice(0, 10);

interface BlogAdminProps {
  posts: BlogPost[];
  setPosts: (posts: BlogPost[]) => void;
  saving: boolean;
  saveContent: (type: string, payload: unknown, successMsg: string) => Promise<void>;
  handleUploadMedia: (file: File, onDone: (url: string) => void, uploadId: string) => Promise<void>;
  uploading: string | null;
  uploadProgress: number | null;
}

function checkSlugs(items: { slug: string }[], what: string): boolean {
  const slugs = items.map((s) => s.slug.trim());
  if (slugs.some((s) => !s)) {
    alert(`Every ${what} needs a page URL (slug).`);
    return false;
  }
  if (new Set(slugs).size !== slugs.length) {
    alert(`Two ${what}s have the same page URL (slug). Please make each one different.`);
    return false;
  }
  return true;
}

// Admin editor for the "Wisdom Beyond the Mind" blog at /blog.
export function BlogAdmin({
  posts,
  setPosts,
  saving,
  saveContent,
  handleUploadMedia,
  uploading,
  uploadProgress,
}: BlogAdminProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [newIds, setNewIds] = React.useState<Set<string>>(new Set());


  // ---------------------------------------------------------------- articles
  const updatePost = (id: string, changes: Partial<BlogPost>) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  };

  const setFeatured = (id: string) => {
    setPosts(posts.map((p) => ({ ...p, featured: p.id === id ? !p.featured : false })));
  };

  const addPost = () => {
    const id = `post-${Date.now().toString(36)}`;
    const used = new Set(posts.map((p) => p.slug));
    let slug = 'new-article';
    while (used.has(slug)) slug = `${slug}-1`;
    setNewIds((prev) => new Set(prev).add(id));
    setPosts([
      {
        id,
        slug,
        title: 'New Article',
        excerpt: '',
        content: '',
        author: 'Beyond the Mind Team',
        published_at: today(),
        updated_at: '',
        image: '',
        image_alt: '',
        image_position: 'center',
        featured: false,
        popular: false,
        // New articles go live on Save, like every other tab. Switch to Draft to keep one hidden.
        published: true,
        keywords: '',
        faqs: [],
      },
      ...posts,
    ]);
    setOpenId(id);
  };

  const savePosts = () => {
    if (!checkSlugs(posts, 'article')) return;
    if (posts.some((p) => !p.title.trim())) {
      alert('Every article needs a title.');
      return;
    }
    const drafts = posts.filter((p) => !p.published).length;
    saveContent(
      'blogPosts',
      posts,
      drafts
        ? `Blog articles saved! ${drafts} draft article${drafts === 1 ? ' is' : 's are'} hidden from the website until switched to Published.`
        : 'Blog articles saved and published! The website updates within a few seconds.'
    );
  };

  const updateFaq = (post: BlogPost, index: number, changes: Partial<BlogFAQ>) => {
    const faqs = [...(post.faqs || [])];
    faqs[index] = { ...faqs[index], ...changes };
    updatePost(post.id, { faqs });
  };

  const saveButton = (onClick: () => void, label: string) => (
    <button
      type="button"
      onClick={onClick}
      disabled={saving}
      className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 font-bold text-xs uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all disabled:opacity-50"
    >
      <Save className="w-3.5 h-3.5" />
      <span>{saving ? 'Saving...' : label}</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#07261F]/70 border border-gold-500/20">
        <div>
          <h3 className="font-serif text-2xl text-ivory-50 font-light">Blog: Wisdom Beyond the Mind</h3>
          <p className="text-xs text-stone-subtle/80 mt-1">
            Write and manage the articles shown on{' '}
            <Link href="/blog" target="_blank" className="text-gold-300 underline">
              /blog
            </Link>
            . Only articles marked Published appear on the site. Click Save to publish your changes.
          </p>
        </div>
      </div>

      {/* ================================================================ ARTICLES */}
      <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={addPost}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:bg-emerald-900 text-xs font-semibold uppercase tracking-wider"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Article</span>
            </button>
            {saveButton(savePosts, 'Save Articles')}
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/50 border border-gold-500/20 text-[11px] text-stone-subtle/80 leading-relaxed">
            <span className="text-gold-300 font-semibold">Writing tips:</span> leave an empty line to start a new paragraph.
            Start a line with <code className="text-gold-200">## </code> for a heading, <code className="text-gold-200">### </code>{' '}
            for a smaller heading, <code className="text-gold-200">- </code> for a list item and{' '}
            <code className="text-gold-200">&gt; </code> for a highlighted quote. Wrap words in{' '}
            <code className="text-gold-200">**double stars**</code> to make them bold.
          </div>

          {posts.length === 0 && (
            <p className="text-xs text-stone-subtle/70 text-center py-10">No articles yet. Click New Article.</p>
          )}

          {posts.map((p) => {
            const open = openId === p.id;
            return (
              <div key={p.id} className="rounded-2xl bg-[#07261F]/60 border border-gold-500/25 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-4">
                  <button type="button" onClick={() => setOpenId(open ? null : p.id)} className="flex-1 min-w-0 text-left">
                    <span className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          p.published ? 'border-emerald-400/50 text-emerald-300' : 'border-stone-400/40 text-stone-300'
                        }`}
                      >
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                      {p.featured && <span className="text-[10px] uppercase tracking-wider text-gold-300">★ Featured</span>}
                      {p.popular && <span className="text-[10px] uppercase tracking-wider text-gold-300">Popular</span>}
                      <span className="text-[10px] uppercase tracking-wider text-stone-subtle/60">
                        {p.published_at}
                      </span>
                    </span>
                    <span className="block font-serif text-lg text-ivory-50 font-medium truncate mt-1">{p.title || 'Untitled article'}</span>
                  </button>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {p.published && (
                      <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className={smallBtn} title="View on site">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button type="button" onClick={() => setOpenId(open ? null : p.id)} className={smallBtn} title={open ? 'Close' : 'Edit'}>
                      {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${p.title}"? Click Save Articles afterwards to publish the change.`)) {
                          setPosts(posts.filter((x) => x.id !== p.id));
                        }
                      }}
                      className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-red-300 ml-1"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-5 pt-2 border-t border-gold-500/15">
                    <div className="sm:col-span-12 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => updatePost(p.id, { published: !p.published })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] ${
                          p.published ? 'bg-emerald-800/50 border-emerald-400/60 text-emerald-200' : 'bg-emerald-950 border-gold-500/25 text-ivory-200/80'
                        }`}
                      >
                        {p.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {p.published ? 'Published (shown on site)' : 'Draft (hidden)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeatured(p.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] ${
                          p.featured ? 'bg-gold-500/30 border-gold-400 text-gold-200' : 'bg-emerald-950 border-gold-500/25 text-ivory-200/80'
                        }`}
                        title="The featured article is shown large at the top of /blog. Only one article can be featured."
                      >
                        <Star className="w-3.5 h-3.5" />
                        {p.featured ? 'Featured article' : 'Make featured'}
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePost(p.id, { popular: !p.popular })}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] ${
                          p.popular ? 'bg-gold-500/30 border-gold-400 text-gold-200' : 'bg-emerald-950 border-gold-500/25 text-ivory-200/80'
                        }`}
                        title="Shown under Popular Articles on /blog"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                        {p.popular ? 'In Popular Articles' : 'Add to Popular Articles'}
                      </button>
                    </div>

                    <div className="sm:col-span-12 space-y-1">
                      <label className={labelClass}>Article Title</label>
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const autoSlug = newIds.has(p.id) && (/^new-article(-1)*$/.test(p.slug) || p.slug === slugify(p.title));
                          updatePost(p.id, { title, ...(autoSlug && slugify(title) ? { slug: slugify(title) } : {}) });
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-12 space-y-1">
                      <label className={labelClass}>Page URL (slug)</label>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-stone-subtle/60 whitespace-nowrap">/blog/</span>
                        <input
                          type="text"
                          value={p.slug}
                          onChange={(e) => updatePost(p.id, { slug: slugify(e.target.value) || e.target.value.toLowerCase() })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-4 space-y-1">
                      <label className={labelClass}>Author</label>
                      <input type="text" value={p.author} onChange={(e) => updatePost(p.id, { author: e.target.value })} className={inputClass} />
                    </div>
                    <div className="sm:col-span-4 space-y-1">
                      <label className={labelClass}>Published Date</label>
                      <input type="date" value={p.published_at} onChange={(e) => updatePost(p.id, { published_at: e.target.value })} className={inputClass} />
                    </div>
                    <div className="sm:col-span-4 space-y-1">
                      <label className={labelClass}>Last Updated (optional)</label>
                      <input type="date" value={p.updated_at || ''} onChange={(e) => updatePost(p.id, { updated_at: e.target.value })} className={inputClass} />
                    </div>

                    <div className="sm:col-span-12 space-y-1">
                      <label className={labelClass}>Summary (shown on cards and in Google results, 1–2 sentences)</label>
                      <textarea rows={2} value={p.excerpt} onChange={(e) => updatePost(p.id, { excerpt: e.target.value })} className={inputClass} />
                      <p className="text-[10px] text-stone-subtle/60">{p.excerpt.length} characters (around 150–160 works best for Google)</p>
                    </div>

                    <div className="sm:col-span-12 space-y-2">
                      <label className={labelClass}>Cover Photo (optional, landscape 16:9 works best)</label>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 border border-gold-500/30 text-gold-300 hover:text-white cursor-pointer text-xs whitespace-nowrap">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploading === `blog-${p.id}` ? `Uploading ${uploadProgress ?? 0}%` : 'Upload Image'}</span>
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
                                  // Like the other tabs, a new photo is saved and published straight away.
                                  const updated = posts.map((x) => (x.id === p.id ? { ...x, image: url } : x));
                                  setPosts(updated);
                                  saveContent('blogPosts', updated, `Photo for "${p.title}" uploaded & saved!`);
                                },
                                `blog-${p.id}`
                              );
                            }}
                          />
                        </label>
                        {p.image && (
                          <button
                            type="button"
                            onClick={() => updatePost(p.id, { image: '' })}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Remove photo</span>
                          </button>
                        )}
                      </div>
                      {p.image ? (
                        <div className="flex flex-wrap items-end gap-4">
                          <div className="relative w-56 aspect-[16/9] rounded-xl overflow-hidden border border-gold-500/35 bg-black/60">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.image_alt || p.title} className="w-full h-full object-cover" style={{ objectPosition: p.image_position || 'center' }} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] text-stone-subtle/70">Photo focus:</span>
                            {[
                              ['Top', 'center 20%'],
                              ['Centre', 'center'],
                              ['Bottom', 'center 80%'],
                            ].map(([label, value]) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => updatePost(p.id, { image_position: value })}
                                className={`px-3 py-1 rounded-lg border text-[11px] ${
                                  (p.image_position || 'center') === value
                                    ? 'bg-gold-500/30 border-gold-400 text-gold-200'
                                    : 'bg-emerald-950 border-gold-500/25 text-ivory-200/80'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-subtle/60">No photo: cards show a gold book icon on a green panel instead.</p>
                      )}
                      {p.image && (
                        <input
                          type="text"
                          value={p.image_alt || ''}
                          onChange={(e) => updatePost(p.id, { image_alt: e.target.value })}
                          placeholder="Describe the photo for screen readers and Google (alt text)"
                          className={inputClass}
                        />
                      )}
                    </div>

                    <div className="sm:col-span-12 space-y-1">
                      <label className={labelClass}>Article Text</label>
                      <textarea rows={16} value={p.content} onChange={(e) => updatePost(p.id, { content: e.target.value })} className={`${inputClass} font-mono leading-relaxed`} />
                    </div>

                    <div className="sm:col-span-12 space-y-3 p-4 rounded-xl bg-emerald-950/60 border border-gold-500/25">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-gold-300 font-bold block">Questions &amp; Answers (optional)</span>
                          <span className="text-[10px] text-stone-subtle/70 font-light">
                            Shown at the end of the article and given to Google and AI assistants as FAQ data. Keep answers short and direct.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => updatePost(p.id, { faqs: [...(p.faqs || []), { question: '', answer: '' }] })}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-900/60 border border-gold-500/30 text-gold-300 text-[11px] shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          Add Q&amp;A
                        </button>
                      </div>
                      {(p.faqs || []).map((f, i) => (
                        <div key={i} className="grid grid-cols-1 gap-2 p-3 rounded-lg bg-[#031713]/60 border border-gold-500/15">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={f.question}
                              onChange={(e) => updateFaq(p, i, { question: e.target.value })}
                              placeholder="Question"
                              className={inputClass}
                            />
                            <button
                              type="button"
                              onClick={() => updatePost(p.id, { faqs: (p.faqs || []).filter((_, j) => j !== i) })}
                              className="p-1.5 rounded-lg bg-red-950/60 border border-red-500/30 text-red-300 shrink-0"
                              title="Remove"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <textarea rows={2} value={f.answer} onChange={(e) => updateFaq(p, i, { answer: e.target.value })} placeholder="Answer" className={inputClass} />
                        </div>
                      ))}
                    </div>

                    <div className="sm:col-span-12 space-y-1 p-4 rounded-xl bg-emerald-950/60 border border-gold-500/25">
                      <label className="text-[11px] uppercase tracking-wider text-gold-300 font-bold flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-gold-400" />
                        <span>SEO Keywords for this article (comma separated)</span>
                      </label>
                      <p className="text-[10px] text-stone-subtle/70 font-light">Not shown on the website. Used only in this article&apos;s meta tags and structured data.</p>
                      <textarea
                        rows={2}
                        value={p.keywords || ''}
                        onChange={(e) => updatePost(p.id, { keywords: e.target.value })}
                        placeholder="keyword 1, keyword 2, keyword 3..."
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {posts.length > 0 && <div className="flex justify-end">{saveButton(savePosts, 'Save Articles')}</div>}
      </>
    </div>
  );
}
