'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registrationSchema, RegistrationFormData } from '@/lib/validation/registration';
import {
  CheckCircle,
  AlertCircle,
  Upload,
  MessageCircle,
  FileText,
  Calendar,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface RegistrationFormProps {
  allowPaymentProof?: boolean;
  defaultProgramme?: string;
}

export function RegistrationForm({
  allowPaymentProof = true,
  defaultProgramme = '4-Day Divine Retreat Rishikesh (Oct 6–9, 2027)',
}: RegistrationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    full_name: string;
    email: string;
    programme: string;
    whatsappUrl: string;
  } | null>(null);

  // Optional payment proof upload state
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [proofError, setProofError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      programme: defaultProgramme,
      country_code: '+91',
      language_preference: 'English',
      privacy_consent: true,
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setSubmitting(true);
    setServerError(null);

    try {
      let uploadedFileUrl: string | undefined = undefined;

      // Handle optional proof file if user attached one before submitting
      if (proofFile) {
        setUploadingProof(true);
        const formPayload = new FormData();
        formPayload.append('file', proofFile);
        const uploadRes = await fetch('/api/upload-payment-proof', {
          method: 'POST',
          body: formPayload,
        });
        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.success) {
          uploadedFileUrl = uploadJson.fileUrl;
          setProofUploaded(true);
        } else {
          setProofError(uploadJson.message || 'Payment proof upload failed.');
        }
        setUploadingProof(false);
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          payment_proof_url: uploadedFileUrl,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit registration. Please verify your details.');
      }

      setSubmittedData({
        id: json.data.id,
        full_name: json.data.full_name,
        email: json.data.email,
        programme: json.data.programme,
        whatsappUrl: json.whatsappUrl,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError('An unexpected error occurred. Please try again or message our concierge on WhatsApp.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // If already successfully submitted, show the confirmation screen
  if (submittedData) {
    return (
      <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#07261F] to-[#041a15] border border-gold-400/50 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-900/60 border-2 border-gold-400 flex items-center justify-center mx-auto text-gold-300 shadow-gold-sm">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-gold-400 font-semibold block">
            Enquiry Received
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-ivory-50 font-light mt-1">
            Namaste, {submittedData.full_name}
          </h3>
          <p className="text-sm text-stone-subtle/85 mt-2 leading-relaxed font-light">
            Your retreat enquiry has been securely registered in our system. A retreat coordinator will review
            your details and connect with you shortly.
          </p>
        </div>

        {/* Reference ID Pill */}
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-gold-500/30 max-w-sm mx-auto">
          <span className="text-[11px] uppercase tracking-wider text-stone-subtle/70 block">
            Official Registration Reference
          </span>
          <span className="font-mono text-2xl font-bold tracking-widest text-gold-300">
            {submittedData.id}
          </span>
          <p className="text-[11px] text-stone-subtle/60 mt-1">
            Please preserve this reference ID for all retreat communications.
          </p>
        </div>

        {/* WhatsApp Fast-Track Action */}
        <div className="space-y-3 pt-2">
          <a
            href={submittedData.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 font-semibold text-xs tracking-widest uppercase shadow-gold-md hover:scale-105 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Connect on WhatsApp with Reference ID</span>
          </a>

          <p className="text-[11px] text-stone-subtle/70">
            A confirmation summary has also been logged for your email address: {submittedData.email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto rounded-3xl bg-[#07261F]/80 backdrop-blur-xl border border-gold-500/25 p-6 sm:p-10 shadow-2xl">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/30 text-[10px] tracking-widest uppercase text-gold-300 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
          Frictionless Participation Enquiry
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light">
          Reserve Your Sanctuary Presence
        </h3>
        <p className="text-xs sm:text-sm text-stone-subtle/80 max-w-xl mx-auto font-light">
          No account or password is required. Fill in your details below and our concierge team will reach out directly.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Full Name *
            </label>
            <input
              type="text"
              {...register('full_name')}
              placeholder="e.g. Arjun Sharma"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            {errors.full_name && (
              <p className="text-[11px] text-red-400">{errors.full_name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Email Address *
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="e.g. seeker@example.com"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone & Country Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Country Code *
            </label>
            <input
              type="text"
              {...register('country_code')}
              placeholder="+91"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            {errors.country_code && (
              <p className="text-[11px] text-red-400">{errors.country_code.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              WhatsApp / Phone Number *
            </label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            {errors.phone && <p className="text-[11px] text-red-400">{errors.phone.message}</p>}
          </div>
        </div>

        {/* Country & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Country *
            </label>
            <input
              type="text"
              {...register('country')}
              placeholder="e.g. India / United States"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            {errors.country && (
              <p className="text-[11px] text-red-400">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              City *
            </label>
            <input
              type="text"
              {...register('city')}
              placeholder="e.g. Bangalore / New York"
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            />
            {errors.city && <p className="text-[11px] text-red-400">{errors.city.message}</p>}
          </div>
        </div>

        {/* Interested Programme & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Interested Programme *
            </label>
            <select
              {...register('programme')}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            >
              <option value="The Divine Retreat Rishikesh (Offline: Oct 5–9, 2027)">
                The Divine Retreat Rishikesh (Offline: Oct 5–9, 2027 • Arrival Oct 5 at 2:45 PM)
              </option>
              <option value="The Divine Retreat 2027 (Online Live Stream)">
                The Divine Retreat 2027 (Online Live Stream)
              </option>
              <option value="Daily Guided Meditation (Online Zoom Mon–Fri 7:30 PM)">
                Daily Guided Meditation (Online Zoom Mon–Fri 7:30 PM)
              </option>
              <option value="Both Retreat & Daily Meditation">
                Both Retreat & Daily Meditation
              </option>
              <option value="General Spiritual Inquiry / Custom">
                General Spiritual Inquiry / Custom
              </option>
            </select>
            {errors.programme && (
              <p className="text-[11px] text-red-400">{errors.programme.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
              Language Preference *
            </label>
            <select
              {...register('language_preference')}
              className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi (Translation Needed)</option>
              <option value="English & Hindi">English & Hindi Comfortable</option>
            </select>
            {errors.language_preference && (
              <p className="text-[11px] text-red-400">{errors.language_preference.message}</p>
            )}
          </div>
        </div>

        {/* Dietary requirements & message */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
            Dietary Preferences or Special Needs (Optional)
          </label>
          <input
            type="text"
            {...register('dietary_requirements')}
            placeholder="e.g. Sattvic vegan, gluten-free, no onion/garlic..."
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-ivory-200/90 font-medium">
            Personal Reflection or Inquiry Message (Optional)
          </label>
          <textarea
            {...register('message')}
            rows={3}
            placeholder="Share what calls you to this retreat or any questions regarding guidance..."
            className="w-full px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-gold-500/20 text-ivory-100 placeholder-stone-subtle/40 text-xs focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 resize-none"
          />
        </div>

        {/* Configurable Optional Payment-Proof Upload Section */}
        {allowPaymentProof && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-gold-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-gold-300 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-gold-400" />
                <span>Optional Payment Transaction Receipt</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-subtle/70">
                Pending Verification Status
              </span>
            </div>
            <p className="text-[11px] text-stone-subtle/80 leading-relaxed font-light">
              If you have already received official transfer instructions from our team and completed a UPI or bank transfer,
              you may attach the receipt screenshot here. (Max 5MB • JPG, PNG, PDF)
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProofFile(e.target.files[0]);
                }
              }}
              className="text-xs text-stone-subtle file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border file:border-gold-500/30 file:text-[11px] file:font-medium file:bg-emerald-900 file:text-gold-300 hover:file:bg-emerald-800"
            />
            {proofError && <p className="text-[11px] text-red-400">{proofError}</p>}
          </div>
        )}

        {/* Privacy Consent Checkbox */}
        <div className="space-y-1 pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('privacy_consent')}
              className="mt-0.5 rounded border-gold-500/40 bg-emerald-950 text-gold-500 focus:ring-gold-400"
            />
            <span className="text-xs text-stone-subtle/85 font-light leading-relaxed">
              I agree to the Beyond the Mind{' '}
              <a href="/privacy-policy" target="_blank" className="text-gold-300 underline underline-offset-2">
                Privacy Policy
              </a>
              . I understand my contact details will be used solely by the retreat concierge to share participation details.
            </span>
          </label>
          {errors.privacy_consent && (
            <p className="text-[11px] text-red-400">{errors.privacy_consent.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || uploadingProof}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:via-gold-300 hover:to-gold-500 text-emerald-950 font-semibold text-xs tracking-widest uppercase transition-all shadow-gold-sm hover:shadow-gold-md flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting || uploadingProof ? (
            <span>Processing Sanctuary Registration...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Retreat Enquiry</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-center text-stone-subtle/60 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-gold-400/70" />
          <span>Encrypted Submission • No Account Creation Needed</span>
        </p>
      </form>
    </div>
  );
}

