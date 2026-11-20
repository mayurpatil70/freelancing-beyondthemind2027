'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { shouldPlayIntro } from '@/components/hero/intro';
import { useLanguage } from '@/contexts/LanguageContext';
import { WhatsAppInquiryModal } from '@/components/layout/WhatsAppInquiryModal';
import styles from './Navbar.module.css';

const leftLinks = [
  { label: 'Retreat', href: '/about' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Programme', href: '/programme' },
];

const rightLinks = [
  { label: 'Rishikesh', href: '/rishikesh' },
  { label: 'Daily Meditation', href: '/daily-meditation' },
];

const moreLinks = [
  { label: 'Participation', href: '/participation', note: 'Rooms, inclusions and what to bring' },
  { label: 'Testimonials', href: '/testimonials', note: 'Reflections from the 2026 circle' },
  { label: 'Gallery', href: '/gallery', note: 'Moments from past retreats' },
  { label: 'How to Reach', href: '/reach', note: 'Air, rail and road to Rishikesh' },
  { label: 'FAQ', href: '/faq', note: 'Answers before you enquire' },
  { label: 'Contact', href: '/contact', note: 'WhatsApp, phone and email' },
];

const sheetLinks = [
  { label: 'Retreat', href: '/about', tag: 'About' },
  { label: 'Experiences', href: '/experiences', tag: '7 sessions' },
  { label: 'Programme', href: '/programme', tag: '4 days' },
  { label: 'Rishikesh', href: '/rishikesh', tag: 'Ganga' },
  { label: 'Daily Meditation', href: '/daily-meditation', tag: '7:30 pm' },
  { label: 'Participation', href: '/participation' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'How to Reach', href: '/reach' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

interface NavbarProps {
  /** Fade the bar in after the home hero's opening animation. */
  syncWithHeroIntro?: boolean;
}

export function Navbar({ syncWithHeroIntro = false }: NavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hidden, setHidden] = useState(syncWithHeroIntro);
  const [introDelay, setIntroDelay] = useState('0s');
  const [topOffset, setTopOffset] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!syncWithHeroIntro) return;
    if (shouldPlayIntro()) setIntroDelay('2.6s');
    const id = requestAnimationFrame(() => setHidden(false));
    return () => cancelAnimationFrame(id);
  }, [syncWithHeroIntro]);

  useEffect(() => {
    const banner = document.querySelector<HTMLElement>('[data-announcement]');
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      setTopOffset(banner ? Math.max(0, banner.getBoundingClientRect().bottom) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setSheetOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMoreOpen(false);
        setSheetOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sheetOpen]);

  const toggleSheet = () => {
    const b = burgerRef.current?.getBoundingClientRect();
    if (b && sheetRef.current) {
      sheetRef.current.style.setProperty('--cx', `${b.left + b.width / 2}px`);
      sheetRef.current.style.setProperty('--cy', `${b.top + b.height / 2}px`);
    }
    setSheetOpen((o) => !o);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const moreActive = moreLinks.some((l) => isActive(l.href));
  const binduAt = hovered ?? [...leftLinks, ...rightLinks].find((l) => isActive(l.href))?.href ?? (moreActive ? 'more' : null);

  const navLink = (l: { label: string; href: string }) => (
    <Link
      key={l.href}
      href={l.href}
      className={cn(styles.link, isActive(l.href) && styles.active)}
      aria-current={isActive(l.href) ? 'page' : undefined}
      onMouseEnter={() => setHovered(l.href)}
      onFocus={() => setHovered(l.href)}
    >
      {l.label}
      {binduAt === l.href && <motion.span layoutId="nav-bindu" className={styles.bindu} transition={{ type: 'spring', stiffness: 380, damping: 26 }} />}
    </Link>
  );

  const { t } = useLanguage();

  return (
    <>
      {/* Desktop Sticky Right Top Corner Action Group: Clean Separate Enquire CTA */}
      <div className={styles.topRightCluster} aria-label="Quick Actions">
        <button
          type="button"
          onClick={() => setIsInquiryModalOpen(true)}
          className={styles.separateCta}
        >
          {t('nav.enquire', 'Enquire')}
        </button>
      </div>

      <header
        className={cn(styles.nav, scrolled && styles.scrolled, hidden && styles.intro)}
        style={{ '--d': introDelay, top: topOffset } as React.CSSProperties}
      >
        <nav className={styles.inner} aria-label="Main" onMouseLeave={() => setHovered(null)}>
          <div className={cn(styles.side, styles.left)}>
            {leftLinks.map(navLink)}
          </div>

          <button
            type="button"
            onClick={() => setLogoModalOpen(true)}
            className={styles.emblem}
            aria-label="Beyond the Mind - Open Sacred Emblem Details"
            title="Beyond the Mind - Click to view sacred emblem"
          >
            <Image src="/images/brand/logo.jpg" alt="Beyond the Mind emblem" fill sizes="64px" priority />
          </button>

          <div className={cn(styles.side, styles.right)}>
            {rightLinks.map(navLink)}
            <div className={styles.more} ref={moreRef}>
              <button
                type="button"
                className={cn(styles.link, moreActive && styles.active)}
                aria-expanded={moreOpen}
                aria-controls="nav-more"
                onClick={() => setMoreOpen((o) => !o)}
                onMouseEnter={() => setHovered('more')}
                onFocus={() => setHovered('more')}
              >
                More
                <svg className={styles.chev} viewBox="0 0 10 6" fill="none" aria-hidden="true">
                  <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.2" />
                </svg>
                {binduAt === 'more' && <motion.span layoutId="nav-bindu" className={styles.bindu} transition={{ type: 'spring', stiffness: 380, damping: 26 }} />}
              </button>
              <div id="nav-more" className={cn(styles.panel, moreOpen && styles.panelOpen)}>
                {moreLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    target="_self"
                    onClick={() => setMoreOpen(false)}
                    tabIndex={moreOpen ? 0 : -1}
                  >
                    <b>{l.label}</b>
                    <span>{l.note}</span>
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsInquiryModalOpen(true)}
              className={styles.cta}
            >
              Enquire
            </button>
            <button
              ref={burgerRef}
              type="button"
              className={styles.burger}
              aria-label={sheetOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={sheetOpen}
              aria-controls="nav-sheet"
              onClick={toggleSheet}
            >
              <i />
              <i />
            </button>
          </div>
        </nav>
      </header>

      <div id="nav-sheet" ref={sheetRef} className={cn(styles.sheet, sheetOpen && styles.sheetOpen)} aria-hidden={!sheetOpen}>
        <div className={styles.sheetScroll}>
          <ol>
            {sheetLinks.map((l, i) => (
              <li key={l.href} style={{ transitionDelay: sheetOpen ? `${0.25 + i * 0.05}s` : '0s' }}>
                <Link
                  href={l.href}
                  target="_self"
                  onClick={() => setSheetOpen(false)}
                  className={cn(isActive(l.href) && styles.active)}
                  tabIndex={sheetOpen ? 0 : -1}
                >
                  {l.label}
                  {l.tag && <small>{l.tag}</small>}
                </Link>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={() => {
              setSheetOpen(false);
              setIsInquiryModalOpen(true);
            }}
            className={cn(styles.cta, styles.sheetCta)}
            tabIndex={sheetOpen ? 0 : -1}
          >
            Begin your journey — Enquire
          </button>
        </div>
      </div>

      <WhatsAppInquiryModal
        isOpen={isInquiryModalOpen}
        onClose={() => setIsInquiryModalOpen(false)}
        defaultProgram="The Divine Retreat 2027"
      />

      {/* Center Logo Popup Card Modal */}
      {logoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setLogoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#07261F] via-[#041d17] to-[#02100d] border-2 border-gold-400/60 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(212,175,55,0.25)] text-center space-y-6 overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle Gold Ambient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-radial opacity-30 pointer-events-none" />

            {/* Top Right Close 'X' Button */}
            <button
              type="button"
              onClick={() => setLogoModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-emerald-950/90 border border-gold-500/40 text-gold-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-md"
              aria-label="Close"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Circular Logo Image with Gold Glowing Ring */}
            <div className="relative mx-auto w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-gold-400/80 shadow-[0_0_35px_rgba(212,175,55,0.4)]">
              <Image
                src="/images/brand/logo.jpg"
                alt="Beyond the Mind Sacred Emblem"
                fill
                sizes="144px"
                className="object-contain"
                priority
              />
            </div>

            {/* Brand Title & Spiritual Taglines */}
            <div className="space-y-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-ivory-50 font-normal tracking-wide">
                Beyond the Mind 2027
              </h3>
              <p className="text-xs sm:text-sm tracking-[0.25em] text-gold-400 uppercase font-semibold">
                The Divine Retreat • Rishikesh
              </p>
              <p className="font-serif italic text-sm text-gold-300/90 pt-1">
                &ldquo;A journey into the Infinite within.&rdquo;
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-subtle/85 font-light leading-relaxed max-w-sm mx-auto">
              An experiential spiritual sanctuary guided by Pradeep Muthukulam along the holy waters of the sacred Ganges in the Himalayan foothills of Rishikesh.
            </p>

            {/* Modal CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/about"
                onClick={() => setLogoModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-emerald-950 border border-gold-500/40 text-gold-300 hover:text-white text-xs uppercase tracking-wider font-semibold transition-all hover:scale-105"
              >
                About Retreat
              </Link>
              <button
                type="button"
                onClick={() => {
                  setLogoModalOpen(false);
                  setIsInquiryModalOpen(true);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-emerald-950 text-xs font-bold uppercase tracking-wider shadow-gold-sm hover:scale-105 transition-all"
              >
                <span>Enquire Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
