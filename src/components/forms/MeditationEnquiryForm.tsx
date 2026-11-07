'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, MessageCircle } from 'lucide-react';
import { ThemeSelect } from '@/components/ui/ThemeSelect';
import { openWhatsApp } from '@/lib/utils';

const NUMBER = '918075572018';

const field =
  'w-full rounded-xl bg-[#031713]/70 border border-gold-500/25 px-4 py-3 text-sm text-ivory-50 placeholder:text-ivory-200/40 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition-colors';

const START_OPTIONS = [
  { value: 'This week', label: 'This week' },
  { value: 'Next week', label: 'Next week' },
  { value: 'Next month', label: 'Next month' },
  { value: 'Just exploring', label: 'Just exploring' },
];

export function MeditationEnquiryForm() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', start: 'This week', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const lines = [
      'Namaste Beyond the Mind Team,',
      '',
      'I would like to join the Daily Guided Meditation sessions (Online on Zoom, Monday to Friday, 7:30 PM IST).',
      '',
      `• *Name:* ${form.name}`,
      `• *WhatsApp:* ${form.phone}`,
      form.city ? `• *City / Time Zone:* ${form.city}` : null,
      `• *Preferred Start:* ${form.start}`,
      form.message ? `• *Note / Query:* ${form.message}` : null,
      '',
      'Kindly share the session fee and Zoom joining link. Thank you!',
    ].filter((l): l is string => typeof l === 'string');

    const messageText = lines.join('\n');
    const whatsappUrl = `https://wa.me/${NUMBER}?text=${encodeURIComponent(messageText)}`;
    setSubmittedUrl(whatsappUrl);

    // Also persist into backend CRM / Registrations DB asynchronously
    try {
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.name,
          phone: form.phone,
          city: form.city || 'Online Practice',
          programme: 'Daily Guided Meditation (Online Zoom Mon–Fri 7:30 PM)',
          message: `${form.message ? `${form.message}\n` : ''}[Preferred Start: ${form.start}]`,
          privacy_consent: true,
        }),
      }).catch((err) => console.error('Enquiry log error:', err));
    } catch (err) {
      console.error('Enquiry logging failed:', err);
    }

    // Direct redirect to WhatsApp
    openWhatsApp(whatsappUrl);
    setSubmitting(false);
  };

  if (submittedUrl) {
    return (
      <div className="p-6 sm:p-8 rounded-2xl bg-[#041a15] border border-gold-400/40 text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-12 h-12 rounded-full bg-emerald-900/60 border border-gold-400 flex items-center justify-center mx-auto text-gold-300">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-serif text-xl text-ivory-50">Enquiry Forwarded to WhatsApp</h4>
          <p className="text-xs text-stone-subtle/80 max-w-md mx-auto">
            Your inquiry for Daily Guided Meditation has been initiated. If WhatsApp didn’t open automatically, tap below:
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={submittedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold text-xs tracking-wider uppercase shadow-md hover:scale-105 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setSubmittedUrl(null)}
            className="text-xs uppercase tracking-wider text-stone-subtle/70 hover:text-gold-300 transition-colors"
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <label htmlFor="dm-name" className="text-[10px] tracking-[0.25em] uppercase text-gold-400 block font-semibold">
          Full name
        </label>
        <input
          id="dm-name"
          required
          value={form.name}
          onChange={set('name')}
          className={field}
          placeholder="Your name"
          autoComplete="name"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="dm-phone" className="text-[10px] tracking-[0.25em] uppercase text-gold-400 block font-semibold">
          WhatsApp number
        </label>
        <input
          id="dm-phone"
          required
          type="tel"
          value={form.phone}
          onChange={set('phone')}
          className={field}
          placeholder="+91 98765 43210"
          autoComplete="tel"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="dm-city" className="text-[10px] tracking-[0.25em] uppercase text-gold-400 block font-semibold">
          City / time zone
        </label>
        <input
          id="dm-city"
          value={form.city}
          onChange={set('city')}
          className={field}
          placeholder="e.g. Bengaluru, IST"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="dm-start" className="text-[10px] tracking-[0.25em] uppercase text-gold-400 block font-semibold">
          Start
        </label>
        <ThemeSelect
          id="dm-start"
          value={form.start}
          onChange={(val) => setForm((f) => ({ ...f, start: val }))}
          options={START_OPTIONS}
          placeholder="Select starting preference"
          className={field}
        />
      </div>

      <div className="space-y-1.5 sm:col-span-2">
        <label htmlFor="dm-message" className="text-[10px] tracking-[0.25em] uppercase text-gold-400 block font-semibold">
          Anything we should know? (optional)
        </label>
        <textarea
          id="dm-message"
          rows={3}
          value={form.message}
          onChange={set('message')}
          className={field}
          placeholder="Experience with meditation, questions about the sessions…"
        />
      </div>

      <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-ivory-200/60 max-w-sm">
          Your enquiry opens in WhatsApp, addressed to +91 80755 72018. The session fee and Zoom link are shared there.
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-[1.03] transition-transform disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{submitting ? 'Connecting...' : 'Send enquiry'}</span>
        </button>
      </div>
    </form>
  );
}
