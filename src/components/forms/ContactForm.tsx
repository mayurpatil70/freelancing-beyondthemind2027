'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validation/registration';
import { Send, CheckCircle, MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl, openWhatsApp } from '@/lib/utils';

const RETREAT_WHATSAPP = '+91 8075572018';

export function ContactForm() {
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSubmitting(true);

    const messageText = [
      'Namaste Beyond the Mind Team,',
      '',
      'I am reaching out via the website enquiry desk:',
      `• *Name:* ${data.name}`,
      `• *Email:* ${data.email}`,
      `• *Phone/WhatsApp:* ${data.phone}`,
      `• *Subject:* ${data.subject}`,
      `• *Message:* ${data.message}`,
      '',
      'Kindly assist and respond at your earliest convenience. Thank you!',
    ].join('\n');

    const whatsappUrl = formatWhatsAppUrl(RETREAT_WHATSAPP, messageText);
    setSubmittedUrl(whatsappUrl);

    // Asynchronously log enquiry into backend CRM
    try {
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          programme: `Contact Desk: ${data.subject}`,
          message: data.message,
          privacy_consent: true,
        }),
      }).catch((err) => console.error('Contact log error:', err));
    } catch (err) {
      console.error('Contact form error:', err);
    }

    // Direct redirect to WhatsApp
    openWhatsApp(whatsappUrl);
    setSubmitting(false);
    reset();
  };

  if (submittedUrl) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-950/80 border border-gold-400/40 text-center space-y-4 animate-in fade-in duration-200">
        <CheckCircle className="w-10 h-10 text-gold-400 mx-auto" />
        <h4 className="font-serif text-xl text-ivory-50 font-medium">Enquiry Forwarded to WhatsApp</h4>
        <p className="text-xs text-stone-subtle/80 leading-relaxed font-light max-w-md mx-auto">
          Thank you for reaching out to the Beyond the Mind Concierge. Your inquiry details have been forwarded to our coordinators on WhatsApp.
        </p>
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
            Send Another Note
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
            Your Name *
          </label>
          <input
            type="text"
            {...register('name')}
            placeholder="Full Name"
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
          />
          {errors.name && <p className="text-[11px] text-red-400">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
            Email Address *
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="email@domain.com"
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
          />
          {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
            Phone / WhatsApp *
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="+91 9876543210"
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
          />
          {errors.phone && <p className="text-[11px] text-red-400">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
            Subject *
          </label>
          <input
            type="text"
            {...register('subject')}
            placeholder="e.g. Travel Inquiry, Daily Meditation..."
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
          />
          {errors.subject && <p className="text-[11px] text-red-400">{errors.subject.message}</p>}
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
          Message *
        </label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="How may our retreat concierge assist your spiritual journey?"
          className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-none"
        />
        {errors.message && <p className="text-[11px] text-red-400">{errors.message.message}</p>}
      </div>

      <p className="text-[11px] text-stone-subtle/70">
        Your enquiry details are safely registered and forwarded directly to WhatsApp (+91 80755 72018).
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-gold-sm hover:shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{submitting ? 'Transmitting to WhatsApp...' : 'Send Message to Concierge & Open WhatsApp'}</span>
      </button>
    </form>
  );
}
