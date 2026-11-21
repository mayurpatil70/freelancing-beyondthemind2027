'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxImage {
  src: string;
  isVideo?: boolean;
  alt: string;
  title?: string;
  caption?: string;
  location?: string;
}

interface ImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: LightboxImage[];
  currentIndex: number;
  onNavigate?: (index: number) => void;
}

export function ImageLightbox({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}: ImageLightboxProps) {
  const current = images[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNavigate && currentIndex < images.length - 1) {
        onNavigate(currentIndex + 1);
      }
      if (e.key === 'ArrowLeft' && onNavigate && currentIndex > 0) {
        onNavigate(currentIndex - 1);
      }
    },
    [isOpen, onClose, onNavigate, currentIndex, images.length]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !current) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 backdrop-blur-md p-4 sm:p-6 md:p-8 animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image Preview"
    >
      {/* Viewport Top-Right Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] p-2.5 rounded-full bg-emerald-950/85 hover:bg-gold-500 border border-gold-400/50 text-gold-300 hover:text-emerald-950 transition-all hover:scale-110 shadow-2xl flex items-center justify-center group"
        aria-label="Close Lightbox"
        title="Close (Esc)"
      >
        <X className="w-5 h-5 transition-transform group-hover:rotate-90" />
      </button>

      {/* Prev button */}
      {images.length > 1 && currentIndex > 0 && onNavigate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="fixed left-3 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-emerald-950/85 hover:bg-gold-500 border border-gold-400/50 text-gold-300 hover:text-emerald-950 transition-all hover:scale-110 shadow-2xl"
          aria-label="Previous Image"
          title="Previous Image"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && currentIndex < images.length - 1 && onNavigate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex + 1);
          }}
          className="fixed right-3 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-emerald-950/85 hover:bg-gold-500 border border-gold-400/50 text-gold-300 hover:text-emerald-950 transition-all hover:scale-110 shadow-2xl"
          aria-label="Next Image"
          title="Next Image"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}

      {/* Modal Card with Equal Margins & Prominent "X" Cut Button */}
      <div
        className="relative max-w-4xl w-full my-auto flex flex-col items-center justify-center p-1 sm:p-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Photo Container with Rounded Borders and Gold Framing */}
        <div className="relative w-full max-h-[66vh] sm:max-h-[70vh] flex items-center justify-center rounded-2xl sm:rounded-3xl overflow-hidden border border-gold-500/40 bg-[#07261F]/80 backdrop-blur-md shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(212,175,55,0.2)] p-2 sm:p-3">
          {/* Card-Top-Right Dedicated "X" Cut Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 p-2 sm:p-2.5 rounded-full bg-emerald-950/90 hover:bg-gold-500 border border-gold-400 text-gold-300 hover:text-emerald-950 transition-all hover:scale-110 shadow-2xl flex items-center justify-center group cursor-pointer"
            aria-label="Close and return to page"
            title="Close (Esc)"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:rotate-90" />
          </button>

          {current.isVideo ? (
            <video
              key={current.src}
              src={current.src}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[60vh] sm:max-h-[65vh] rounded-xl sm:rounded-2xl"
            />
          ) : (
            <div className="relative w-full h-[52vh] sm:h-[62vh] max-h-[65vh] rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center">
              <Image
                src={current.src}
                alt={current.alt || 'Beyond the Mind Visual'}
                fill
                sizes="(max-width: 1024px) 90vw, 800px"
                className="object-contain rounded-xl sm:rounded-2xl"
                priority
              />
            </div>
          )}
        </div>

        {/* Caption bar */}
        {(current.title || current.caption) && (
          <div className="mt-3.5 sm:mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-[#07261F]/95 to-emerald-950/95 border border-gold-500/30 text-center max-w-2xl shadow-xl backdrop-blur-md">
            {current.title && (
              <h4 className="font-serif text-base sm:text-lg text-gold-300 font-medium">
                {current.title}
              </h4>
            )}
            {current.caption && (
              <p className="text-xs text-ivory-200/90 mt-1 leading-relaxed font-light">
                {current.caption}
              </p>
            )}
            {current.location && (
              <span className="text-[10px] uppercase tracking-widest text-gold-400/80 mt-1 block font-medium">
                {current.location}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
