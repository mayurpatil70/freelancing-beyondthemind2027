'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeroVideoPlayerProps {
  videoUrl?: string;
  posterUrl: string;
  fallbackImageUrl?: string;
  className?: string;
  overlayOpacity?: string;
}

export function HeroVideoPlayer({
  videoUrl,
  posterUrl = '/images/rishikesh/meditation-ganges.jpg',
  fallbackImageUrl = '/images/rishikesh/meditation-ganges.jpg',
  className,
  overlayOpacity = 'bg-emerald-950/65',
}: HeroVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [hasPlaybackError, setHasPlaybackError] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState<boolean>(false);

  // Check reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Safe play helper
  const attemptPlay = useCallback(async () => {
    if (!videoRef.current || prefersReducedMotion || hasPlaybackError) return;
    try {
      videoRef.current.muted = isMuted;
      await videoRef.current.play();
      setIsPlaying(true);
      setAutoplayBlocked(false);
    } catch {
      // Autoplay blocked by browser policy
      setAutoplayBlocked(true);
      setIsPlaying(false);
    }
  }, [isMuted, prefersReducedMotion, hasPlaybackError]);

  const pauseVideo = useCallback(() => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
  }, []);

  // IntersectionObserver for viewport tracking
  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
          attemptPlay();
        } else {
          pauseVideo();
        }
      },
      { threshold: [0.1, 0.25, 0.5] }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [attemptPlay, pauseVideo, prefersReducedMotion]);

  // Pause on tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        pauseVideo();
      } else if (containerRef.current) {
        attemptPlay();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [attemptPlay, pauseVideo]);

  // Audio Toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  // Play / Pause Toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      pauseVideo();
    } else {
      attemptPlay();
    }
  };

  // Check if a usable video source is configured
  // Note: Google Drive editing links require user Google login, so we guard against raw Google Drive doc URLs
  const isUsableVideoUrl =
    Boolean(videoUrl) &&
    !videoUrl?.includes('docs.google.com/videos') &&
    !videoUrl?.includes('drive.google.com/file');

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full h-full min-h-[500px] overflow-hidden bg-[#031713] select-none',
        className
      )}
    >
      {/* 1. Cinematic Poster Base Layer (always renders first to prevent layout shifts & black screens) */}
      <div className="absolute inset-0 z-0">
        <Image
          src={posterUrl || fallbackImageUrl}
          alt="Beyond the Mind Rishikesh Himalayan Sanctuary"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
        />
      </div>

      {/* 2. HTML5 Video Layer (Muted, playsInline, lazy-loaded) */}
      {isUsableVideoUrl && !prefersReducedMotion && !hasPlaybackError && (
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          muted={isMuted}
          loop
          preload="none"
          onLoadedData={() => setIsVideoLoaded(true)}
          onError={() => setHasPlaybackError(true)}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 z-10',
            isVideoLoaded && isPlaying ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* 3. Deep Emerald & Charcoal Cinematic Vignette Gradient Overlays */}
      <div
        className={cn(
          'absolute inset-0 z-20 pointer-events-none transition-colors duration-700',
          overlayOpacity
        )}
      />
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-[#031713] via-transparent to-[#031713]/80" />
      <div className="absolute inset-0 z-20 pointer-events-none bg-radial-gradient from-transparent via-[#031713]/40 to-[#031713]" />

      {/* 4. Elegant Interactive Controls Pill (Unmute & Play / Pause) */}
      {isUsableVideoUrl && !hasPlaybackError && isVideoLoaded && (
        <div className="absolute bottom-8 right-8 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#031713]/80 hover:bg-[#07261F] text-gold-300 border border-gold-500/30 backdrop-blur-md text-xs font-medium transition-all hover:scale-105 focus:outline-none focus:ring-1 focus:ring-gold-400"
            aria-label={isPlaying ? 'Pause retreat video' : 'Play retreat video'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#031713]/80 hover:bg-[#07261F] text-gold-300 border border-gold-500/30 backdrop-blur-md text-xs font-medium transition-all hover:scale-105 focus:outline-none focus:ring-1 focus:ring-gold-400"
            aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isMuted ? 'Sound Off' : 'Sound On'}</span>
          </button>
        </div>
      )}

      {/* Manual play if autoplay was blocked */}
      {autoplayBlocked && isUsableVideoUrl && (
        <div className="absolute bottom-8 right-8 z-30">
          <button
            type="button"
            onClick={attemptPlay}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/90 hover:bg-gold-400 text-emerald-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-gold-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Experience</span>
          </button>
        </div>
      )}
    </div>
  );
}

