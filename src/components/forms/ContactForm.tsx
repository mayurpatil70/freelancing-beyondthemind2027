'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validation/registration';
import { Send, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { formatWhatsAppUrl } from '@/lib/utils';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
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
    // Simulate brief network delay
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    reset();
  };

  if (submitted) {
    return (
      <div className="p-8 rounded-2xl bg-emerald-950/80 border border-gold-400/40 text-center space-y-4">
        <CheckCircle className="w-10 h-10 text-gold-400 mx-auto" />
        <h4 className="font-serif text-xl text-ivory-50 font-medium">Message Received</h4>
        <p className="text-xs text-stone-subtle/80 leading-relaxed font-light max-w-md mx-auto">
          Thank you for reaching out to the Beyond the Mind Concierge. Our retreat coordinators will respond
          to your query promptly.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-xs uppercase tracking-wider text-gold-300 underline underline-offset-4 hover:text-gold-200"
        >
          Send Another Note
        </button>
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

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-gold-sm hover:shadow-gold-md flex items-center justify-center gap-2"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{submitting ? 'Transmitting Note...' : 'Send Message to Concierge'}</span>
      </button>
    </form>
  );
}

