'use client';

import React from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  MapPin,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { useCMS } from '@/contexts/CMSContext';
import { formatWhatsAppUrl } from '@/lib/utils';
import { ContactForm } from '@/components/forms/ContactForm';

export function ContactDetailsSection() {
  const { settings, customContacts } = useCMS();

  const phone = settings?.primary_phone || settings?.whatsapp_display || settings?.whatsapp_number || '+91 8075572018';
  const secondaryPhone = settings?.secondary_phone;
  const email = settings?.primary_email || settings?.email || 'moolabrahman@gmail.com';
  const secondaryEmail = settings?.secondary_email;

  const instagram = settings?.instagram_url || 'https://www.instagram.com/thedivineretreat?exln=Y3RrM2FxcngxOWtm';
  const facebook = settings?.facebook_url || 'https://www.facebook.com/profile.php?id=61595374757132';
  const youtube = settings?.youtube_url || 'https://www.youtube.com/@BeyondTheMindRetreat';
  const twitter = settings?.twitter_url || 'https://twitter.com/beyondthemind';

  const quickInquiries = [
    {
      label: 'Retreat Participation Enquiry',
      desc: 'Ask about dates, rooms, and itinerary in Rishikesh',
      msg: 'Namaste Beyond the Mind Team,\n\nI would like to enquire about participation in Beyond the Mind 2027 in Rishikesh.',
    },
    {
      label: 'Daily Guided Meditation Enquiry',
      desc: 'Join Monday to Friday 7:30 PM Zoom sessions',
      msg: 'Namaste Beyond the Mind Team,\n\nI would like to join the Monday–Friday 7:30 PM Zoom Daily Guided Meditation sessions.',
    },
    {
      label: 'Travel Concierge & Logistics',
      desc: 'Guidance on flights, trains, and taxi arrivals',
      msg: 'Namaste Beyond the Mind Concierge,\n\nI have questions regarding travel arrangements and connectivity to Rishikesh for the retreat.',
    },
    {
      label: 'Registration Follow-Up',
      desc: 'Check status of an existing registration reference',
      msg: 'Namaste Beyond the Mind Team,\n\nI am writing to follow up on my retreat registration reference ID.',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Direct Official Channels Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 space-y-6 shadow-xl">
            <h3 className="font-serif text-2xl text-ivory-50 font-medium">Official Contact Details</h3>

            <ul className="space-y-4 text-xs sm:text-sm">
              <li>
                <a
                  href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 hover:border-gold-400/40 transition-colors"
                >
                  <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                      Primary Phone & WhatsApp
                    </span>
                    <span className="text-ivory-100 font-medium">{phone}</span>
                    <span className="text-[11px] text-stone-subtle/70 block mt-0.5">
                      Tap to chat directly on WhatsApp
                    </span>
                  </div>
                </a>
              </li>

              {secondaryPhone && (
                <li>
                  <a
                    href={`https://wa.me/${secondaryPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 hover:border-gold-400/40 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gold-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                        Alternate Phone
                      </span>
                      <span className="text-ivory-100 font-medium">{secondaryPhone}</span>
                    </div>
                  </a>
                </li>
              )}

              <li>
                <a
                  href={`mailto:${email}`}
                  className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 hover:border-gold-400/40 transition-colors"
                >
                  <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                      Official Email
                    </span>
                    <span className="text-ivory-100 font-medium break-all">{email}</span>
                    <span className="text-[11px] text-stone-subtle/70 block mt-0.5">
                      Typically answered within 24 hours
                    </span>
                  </div>
                </a>
              </li>

              {secondaryEmail && (
                <li>
                  <a
                    href={`mailto:${secondaryEmail}`}
                    className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 hover:border-gold-400/40 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-gold-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                        Secondary / Support Email
                      </span>
                      <span className="text-ivory-100 font-medium break-all">{secondaryEmail}</span>
                    </div>
                  </a>
                </li>
              )}

              {/* Dynamic Custom Contacts & Additional Links added by Admin */}
              {customContacts && customContacts.length > 0 && (
                <>
                  {customContacts.map((c) => {
                    const isPhone = c.type === 'phone';
                    const isMail = c.type === 'email';
                    const href = isPhone
                      ? `tel:${c.value.replace(/[^0-9+]/g, '')}`
                      : isMail
                      ? `mailto:${c.value}`
                      : c.value;
                    const Icon = isPhone ? Phone : isMail ? Mail : ExternalLink;

                    return (
                      <li key={c.id}>
                        <a
                          href={href}
                          target={c.type === 'link' ? '_blank' : undefined}
                          rel={c.type === 'link' ? 'noopener noreferrer' : undefined}
                          className="group flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-950/60 border border-gold-500/15 hover:border-gold-400/40 transition-colors"
                        >
                          <Icon className="w-5 h-5 text-gold-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                              {c.label || 'Additional Contact'}
                            </span>
                            <span className="text-ivory-100 font-medium break-all">{c.value}</span>
                          </div>
                        </a>
                      </li>
                    );
                  })}
                </>
              )}

              <li>
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-950/60 border border-gold-500/15">
                  <MapPin className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block">
                      Retreat Destination
                    </span>
                    <span className="text-ivory-100 font-medium">{settings?.retreat_location || 'Rishikesh, Uttarakhand, India'}</span>
                    <span className="text-[11px] text-stone-subtle/70 block mt-0.5">
                      Sanctuary address disclosed upon confirmation
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            {/* Social Channels */}
            <div className="pt-2 border-t border-gold-500/20">
              <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold block mb-3">
                Follow Our Spiritual Journey
              </span>
              <div className="flex flex-wrap items-center gap-3">
                {instagram && (
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/30 text-xs text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Instagram className="w-4 h-4 text-gold-400" />
                    <span>Instagram</span>
                  </a>
                )}

                {facebook && (
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/30 text-xs text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Facebook className="w-4 h-4 text-gold-400" />
                    <span>Facebook</span>
                  </a>
                )}

                {youtube && (
                  <a
                    href={youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/30 text-xs text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Youtube className="w-4 h-4 text-gold-400" />
                    <span>YouTube</span>
                  </a>
                )}

                {twitter && (
                  <a
                    href={twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950 border border-gold-500/30 text-xs text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Twitter className="w-4 h-4 text-gold-400" />
                    <span>Twitter / X</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Note Form */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#07261F]/70 border border-gold-500/25 shadow-xl space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">
                Direct Inquiry
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-light mt-0.5">
                Send a Note to Our Coordinators
              </h3>
              <p className="text-xs sm:text-sm text-stone-subtle/80 font-light mt-1">
                Have questions about retreat preparation, arrival schedules, or dietary requirements?
              </p>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>

      {/* Pre-filled WhatsApp Shortcuts */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#07261F]/40 border border-gold-500/20 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold">
            Instant Chat Shortcuts
          </span>
          <h3 className="font-serif text-2xl text-ivory-50 font-light">
            One-Click WhatsApp Enquiries
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickInquiries.map((inq, idx) => (
            <a
              key={idx}
              href={formatWhatsAppUrl(phone, inq.msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl bg-emerald-950/70 border border-gold-500/15 hover:border-gold-400/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-1.5">
                <span className="font-serif text-base text-ivory-50 group-hover:text-gold-300 transition-colors font-medium block">
                  {inq.label}
                </span>
                <p className="text-xs text-stone-subtle/80 font-light leading-relaxed">
                  {inq.desc}
                </p>
              </div>
              <div className="pt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gold-400 font-medium">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Start Chat</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
