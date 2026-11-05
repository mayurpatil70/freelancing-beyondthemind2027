'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface LightboxImage {
  src: string;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-gold-200 transition-all hover:scale-105"
        aria-label="Close Lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Prev button */}
      {images.length > 1 && currentIndex > 0 && onNavigate && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(currentIndex - 1);
          }}
          className="absolute left-4 sm:left-8 z-50 p-3 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-gold-200 transition-all hover:scale-105"
          aria-label="Previous Image"
        >
          <ChevronLeft className="w-6 h-6" />
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
          className="absolute right-4 sm:right-8 z-50 p-3 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-gold-500/30 text-gold-300 hover:text-gold-200 transition-all hover:scale-105"
          aria-label="Next Image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image and Caption Container */}
      <div
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-h-[75vh] h-[75vh] max-w-[85vw] flex items-center justify-center">
          <Image
            src={current.src}
            alt={current.alt || 'Beyond the Mind Visual'}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption bar */}
        {(current.title || current.caption) && (
          <div className="mt-4 px-6 py-3 rounded-xl bg-emerald-950/90 border border-gold-500/20 text-center max-w-2xl">
            {current.title && (
              <h4 className="font-serif text-lg text-gold-300 font-medium">{current.title}</h4>
            )}
            {current.caption && (
              <p className="text-xs text-ivory-200/90 mt-1 leading-relaxed font-light">
                {current.caption}
              </p>
            )}
            {current.location && (
              <span className="text-[10px] uppercase tracking-widest text-gold-400/80 mt-1 block">
                {current.location}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

