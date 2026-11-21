'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Instagram, Facebook, Youtube, Twitter, MapPin, Calendar, Heart, Lock, Globe, ExternalLink } from 'lucide-react';
import { useCMS } from '@/contexts/CMSContext';

export function Footer() {
  const { settings, customContacts } = useCMS();
  const phone = settings.whatsapp_number || '+91 8075572018';
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const email = settings.email || 'moolabrahman@gmail.com';
  return (
    <footer className="relative bg-[#02100d] border-t border-gold-500/20 text-ivory-200 overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gold-radial opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Identity */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gold-400/50 shadow-gold-sm">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="Beyond the Mind Logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-serif text-lg tracking-widest text-ivory-50 font-semibold group-hover:text-gold-300 transition-colors">
                  BEYOND THE MIND 2027
                </h3>
                <p className="text-xs tracking-[0.25em] text-gold-400 uppercase">The Divine Retreat</p>
              </div>
            </Link>

            <p className="text-sm text-stone-subtle/80 leading-relaxed max-w-md font-light">
              An immersive 4-day spiritual sanctuary into the Infinite within. Reconnect with your True Self,
              release deep-seated blocks, and awaken the vastness of being amidst the serenity of Rishikesh.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gold-400/90 font-light pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                Arrival: Oct 5, 2027 • Sessions: Oct 6–9
              </span>
              <span className="text-gold-500/40 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                Rishikesh, Uttarakhand
              </span>
            </div>
          </div>

          {/* Retreat Navigation */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-300 mb-4 font-semibold">
              The Sanctuary
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider uppercase">
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors">
                  About the Retreat
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="hover:text-gold-300 transition-colors">
                  Six Sacred Experiences
                </Link>
              </li>
              <li>
                <Link href="/programme" className="hover:text-gold-300 transition-colors">
                  4-Day Programme
                </Link>
              </li>
              <li>
                <Link href="/rishikesh" className="hover:text-gold-300 transition-colors">
                  Rishikesh Destination
                </Link>
              </li>
              <li>
                <Link href="/daily-meditation" className="hover:text-gold-300 transition-colors">
                  Daily Guided Meditation
                </Link>
              </li>
              <li>
                <Link href="/participation" className="hover:text-gold-300 transition-colors">
                  Participation Details
                </Link>
              </li>
            </ul>
          </div>

          {/* Seeker Information */}
          <div>
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-300 mb-4 font-semibold">
              Guest Services
            </h4>
            <ul className="space-y-2.5 text-xs tracking-wider uppercase">
              <li>
                <Link href="/testimonials" className="hover:text-gold-300 transition-colors">
                  Guest Testimonials
                </Link>
              </li>
              <li>
                <Link href="/reach" className="hover:text-gold-300 transition-colors">
                  How to Reach
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold-300 transition-colors">
                  Frequently Asked
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-gold-300 transition-colors">
                  Enquiry & Registration
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors">
                  Contact & Concierge
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Contact & Socials */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-gold-300 mb-4 font-semibold">
              Retreat Concierge
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={`https://wa.me/${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-gold-300 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{phone}</span>
                </a>
              </li>
              {settings.secondary_phone && (
                <li>
                  <a
                    href={`tel:${settings.secondary_phone.replace(/[^0-9+]/g, '')}`}
                    className="flex items-center gap-2 hover:text-gold-300 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gold-400/80 shrink-0" />
                    <span>{settings.secondary_phone}</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 hover:text-gold-300 transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              {settings.secondary_email && (
                <li>
                  <a
                    href={`mailto:${settings.secondary_email}`}
                    className="flex items-center gap-2 hover:text-gold-300 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gold-400/80 shrink-0" />
                    <span className="break-all">{settings.secondary_email}</span>
                  </a>
                </li>
              )}

              {/* Dynamic Customizable Contacts & Links */}
              {customContacts.map((c) => (
                <li key={c.id}>
                  <a
                    href={
                      c.type === 'phone'
                        ? `tel:${c.value}`
                        : c.type === 'email'
                        ? `mailto:${c.value}`
                        : c.value
                    }
                    target={c.type === 'link' ? '_blank' : undefined}
                    rel={c.type === 'link' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-2 hover:text-gold-300 transition-colors"
                  >
                    {c.type === 'phone' ? (
                      <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                    ) : c.type === 'email' ? (
                      <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-gold-400 shrink-0" />
                    )}
                    <span className="break-all">
                      <strong className="font-medium text-gold-300/90">{c.label}:</strong> {c.value}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <span className="text-[11px] tracking-widest uppercase text-gold-400/80 block mb-2 font-medium">
                Official Channels
              </span>
              <div className="flex items-center gap-3">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram @thedivineretreat"
                    className="w-9 h-9 rounded-full bg-emerald-900/60 border border-gold-500/30 flex items-center justify-center text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook Page"
                    className="w-9 h-9 rounded-full bg-emerald-900/60 border border-gold-500/30 flex items-center justify-center text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Channel"
                    className="w-9 h-9 rounded-full bg-emerald-900/60 border border-gold-500/30 flex items-center justify-center text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.twitter_url && (
                  <a
                    href={settings.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X @beyondthemind27"
                    className="w-9 h-9 rounded-full bg-emerald-900/60 border border-gold-500/30 flex items-center justify-center text-ivory-100 hover:text-gold-300 hover:border-gold-400 transition-all hover:scale-105"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-subtle/70 gap-4">
          <p>© 2027 Beyond the Mind. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-gold-300 transition-colors">
              Privacy Policy
            </Link>
            <span className="opacity-30">•</span>
            <Link href="/contact" className="hover:text-gold-300 transition-colors">
              Concierge
            </Link>
            <span className="opacity-30">•</span>
            <Link
              href="/admin"
              className="text-gold-400 hover:text-gold-300 font-medium transition-colors flex items-center gap-1.5 underline underline-offset-4 decoration-gold-400/60"
            >
              <Lock className="w-3 h-3 text-gold-400" />
              <span>/admin Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dedicated Developer Bar */}
      <div className="bg-[#010907] border-t border-gold-500/15 py-3.5 px-4 text-center">
        <a
          href="https://linktr.ee/hackerfromhills"
          target="_blank"
          rel="noopener noreferrer"
          title="Team Hackerfromhills"
          className="text-xs text-stone-subtle/85 hover:text-gold-300 inline-flex items-center justify-center gap-1.5 transition-colors group cursor-pointer"
        >
          <span>Made with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline shrink-0 group-hover:scale-125 transition-transform" />
          <span>by</span>
          <span className="text-gold-400 group-hover:text-gold-200 font-medium underline underline-offset-4 decoration-gold-400/80">
            Team Hackerfromhills
          </span>
        </a>
      </div>
    </footer>
  );
}

