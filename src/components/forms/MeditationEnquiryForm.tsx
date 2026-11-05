'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

const NUMBER = '918075572018';

const field =
  'w-full rounded-xl bg-[#031713]/70 border border-gold-500/25 px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-200/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-colors';

export function MeditationEnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', start: 'This week', message: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      'Namaste Beyond the Mind Team,',
      '',
      'I would like to join the Daily Guided Meditation sessions (Online on Zoom, Monday to Friday, 7:30 PM IST).',
      '',
      `Name: ${form.name}`,
      `WhatsApp: ${form.phone}`,
      form.city && `City / time zone: ${form.city}`,
      `Would like to start: ${form.start}`,
      form.message && `Note: ${form.message}`,
      '',
      'Kindly share the session fee and joining details.',
    ].filter((l): l is string => typeof l === 'string');
    window.open(`https://wa.me/${NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400">Full name</span>
        <input id="dm-name" required value={form.name} onChange={set('name')} className={field} placeholder="Your name" autoComplete="name" />
      </label>
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400">WhatsApp number</span>
        <input id="dm-phone" required type="tel" value={form.phone} onChange={set('phone')} className={field} placeholder="+91 98765 43210" autoComplete="tel" />
      </label>
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400">City / time zone</span>
        <input id="dm-city" value={form.city} onChange={set('city')} className={field} placeholder="e.g. Bengaluru, IST" />
      </label>
      <label className="space-y-1.5">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400">Start</span>
        <select id="dm-start" value={form.start} onChange={set('start')} className={field}>
          <option>This week</option>
          <option>Next week</option>
          <option>Next month</option>
          <option>Just exploring</option>
        </select>
      </label>
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-[10px] tracking-[0.25em] uppercase text-gold-400">Anything we should know? (optional)</span>
        <textarea id="dm-message" rows={3} value={form.message} onChange={set('message')} className={field} placeholder="Experience with meditation, questions about the sessions…" />
      </label>
      <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-ivory-200/60 max-w-sm">
          Your enquiry opens in WhatsApp, addressed to +91 80755 72018. The session fee and Zoom link are shared there.
        </p>
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-[1.03] transition-transform"
        >
          <Send className="w-3.5 h-3.5" />
          Send enquiry
        </button>
      </div>
    </form>
  );
}
