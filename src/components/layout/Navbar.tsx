'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'About', href: '/about' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Programme', href: '/programme' },
  { label: 'Rishikesh', href: '/rishikesh' },
  { label: 'Daily Meditation', href: '/daily-meditation' },
  { label: 'Participation', href: '/participation' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Reach', href: '/reach' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'py-2.5 bg-[#031713]/85 backdrop-blur-md border-b border-gold-500/20 shadow-emerald-deep'
            : 'py-4 bg-gradient-to-b from-[#031713]/90 via-[#031713]/50 to-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Official Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-gold-400 rounded-lg p-1"
              aria-label="Beyond the Mind 2027 Home"
            >
              <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full overflow-hidden border border-gold-400/40 shadow-gold-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/brand/logo.jpg"
                  alt="Beyond the Mind 2027 Official Logo"
                  fill
                  sizes="52px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-sm sm:text-base font-semibold text-ivory-50 group-hover:text-gold-300 transition-colors">
                  BEYOND THE MIND
                </span>
                <span className="text-[10px] sm:text-[11px] tracking-[0.25em] text-gold-400 uppercase font-light">
                  The Divine Retreat 2027
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1">
              {navLinks.slice(0, 7).map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs tracking-wider uppercase transition-all duration-200 font-medium',
                      isActive
                        ? 'text-gold-300 bg-emerald-800/60 border border-gold-500/30 shadow-sm'
                        : 'text-ivory-200/90 hover:text-gold-200 hover:bg-emerald-900/40'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <div className="relative group">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full text-xs tracking-wider uppercase text-ivory-200/80 hover:text-gold-200 hover:bg-emerald-900/40 transition-colors font-medium flex items-center gap-1"
                >
                  More
                  <ChevronRight className="w-3 h-3 rotate-90 opacity-70 group-hover:opacity-100" />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
                  <div className="w-48 py-2 rounded-xl bg-[#07261F]/95 backdrop-blur-xl border border-gold-500/25 shadow-2xl flex flex-col">
                    {navLinks.slice(7).map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="px-4 py-2 text-xs tracking-wider uppercase text-ivory-100 hover:text-gold-300 hover:bg-emerald-800/40 transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                    <Link
                      href="/faq"
                      className="px-4 py-2 text-xs tracking-wider uppercase text-ivory-100 hover:text-gold-300 hover:bg-emerald-800/40 transition-colors"
                    >
                      FAQs
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Enquire Now CTA */}
            <div className="hidden md:flex items-center space-x-3">
              <Link
                href="/register"
                className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase overflow-hidden transition-all duration-300 group border border-gold-400/70 bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 hover:from-gold-500 hover:via-gold-400 hover:to-gold-600 hover:text-emerald-950 text-gold-300 shadow-gold-sm hover:shadow-gold-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300 group-hover:text-emerald-950 transition-colors" />
                <span>Enquire Now</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-2">
              <Link
                href="/register"
                className="px-3 py-1.5 text-[11px] font-semibold tracking-wider uppercase rounded-full border border-gold-400/60 bg-gold-500/20 text-gold-300"
              >
                Enquire
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-ivory-100 hover:text-gold-300 hover:bg-emerald-900/60 transition-colors focus:outline-none focus:ring-1 focus:ring-gold-400"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#031713]/98 backdrop-blur-2xl flex flex-col pt-24 px-6 pb-8 overflow-y-auto animate-in fade-in duration-200">
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-gold-400/60 shadow-gold-md">
              <Image
                src="/images/brand/logo.jpg"
                alt="Beyond the Mind Logo"
                fill
                sizes="64px"
                className="object-contain"
              />
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="font-serif text-lg tracking-widest text-ivory-50">BEYOND THE MIND 2027</h2>
            <p className="text-xs tracking-[0.2em] text-gold-400 uppercase mt-0.5">The Divine Retreat</p>
          </div>

          <div className="flex flex-col space-y-1 divide-y divide-emerald-900/60">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'py-3 text-sm tracking-widest uppercase transition-colors flex items-center justify-between',
                  pathname === link.href ? 'text-gold-300 font-semibold' : 'text-ivory-200 hover:text-gold-300'
                )}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            ))}
            <Link
              href="/faq"
              className={cn(
                'py-3 text-sm tracking-widest uppercase transition-colors flex items-center justify-between',
                pathname === '/faq' ? 'text-gold-300 font-semibold' : 'text-ivory-200 hover:text-gold-300'
              )}
            >
              <span>FAQs</span>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gold-500/20 flex flex-col gap-3">
            <Link
              href="/register"
              className="w-full py-3.5 text-center text-xs tracking-widest uppercase font-semibold rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-emerald-950 shadow-gold-md"
            >
              Begin Your Journey — Enquire Now
            </Link>
            <p className="text-center text-[11px] text-stone-subtle/70 mt-2">
              October 6–9, 2027 • Rishikesh, Uttarakhand
            </p>
          </div>
        </div>
      )}
    </>
  );
}

