'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { shouldPlayIntro } from '@/components/hero/intro';
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
  { label: 'Experiences', href: '/experiences', tag: 'Six' },
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

  return (
    <>
      <header
        className={cn(styles.nav, scrolled && styles.scrolled, hidden && styles.intro)}
        style={{ '--d': introDelay, top: topOffset } as React.CSSProperties}
      >
        <nav className={styles.inner} aria-label="Main" onMouseLeave={() => setHovered(null)}>
          <div className={cn(styles.side, styles.left)}>
            <Link href="/" className={styles.wordmark}>
              <b>BEYOND THE MIND</b>
              <span>The Divine Retreat</span>
            </Link>
            {leftLinks.map(navLink)}
          </div>

          <Link href="/" className={styles.emblem} aria-label="Beyond the Mind home">
            <Image src="/images/brand/logo.jpg" alt="Beyond the Mind emblem" fill sizes="64px" priority />
          </Link>

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
                  <Link key={l.href} href={l.href} tabIndex={moreOpen ? 0 : -1}>
                    <b>{l.label}</b>
                    <span>{l.note}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/register" className={styles.cta}>
              Enquire
            </Link>
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
              <Link href={l.href} className={cn(isActive(l.href) && styles.active)} tabIndex={sheetOpen ? 0 : -1}>
                {l.label}
                {l.tag && <small>{l.tag}</small>}
              </Link>
            </li>
          ))}
        </ol>
        <Link href="/register" className={cn(styles.cta, styles.sheetCta)} tabIndex={sheetOpen ? 0 : -1}>
          Begin your journey
        </Link>
        </div>
      </div>
    </>
  );
}
