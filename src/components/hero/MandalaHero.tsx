'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { VERTEX_SHADER, fragmentShader, breathAt, BREATH_CYCLE, BREATH_IN } from './mandalaShader';
import { shouldPlayIntro } from './intro';
import styles from './MandalaHero.module.css';

type Mode = 'live' | 'video';

interface MandalaHeroProps {
  title: string;
  subtitle: string;
  tagline: string;
  dates: string;
  location: string;
  /** ISO start of the retreat, used for the "days away" counter. */
  startsAt?: string;
  /** Overrides the built-in mandala loop for video mode. */
  videoUrl?: string;
}

const VIDEOS = {
  landscape: { src: '/videos/hero/chakras-landscape.mp4', poster: '/videos/hero/chakras-landscape.jpg' },
  portrait: { src: '/videos/hero/chakras-portrait.mp4', poster: '/videos/hero/chakras-portrait.jpg' },
};

function splitTitle(raw: string) {
  const clean = raw.replace(/\s+\d{4}\s*$/, '').trim();
  const text = clean === clean.toUpperCase() ? clean.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) : clean;
  return text.split(/\s+/).map((w) => (w.toLowerCase() === 'the' ? { word: 'the', accent: true } : { word: w, accent: false }));
}

function isSlowNetwork() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return !!c && (c.saveData === true || c.effectiveType === '2g' || c.effectiveType === 'slow-2g');
}

function isLowEnd() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency || 8) <= 4 || (nav.deviceMemory || 8) <= 3;
}

export function MandalaHero({
  title,
  subtitle,
  tagline,
  dates,
  location,
  startsAt = '2027-10-06T00:00:00+05:30',
  videoUrl,
}: MandalaHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const dustRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<Mode>('live');
  const audioRef = useRef<{ ctx: AudioContext; master: GainNode; on: boolean } | null>(null);

  const [mode, setMode] = useState<Mode>('live');
  const [phase, setPhase] = useState<'intro' | 'ready'>('intro');
  const [animateIntro, setAnimateIntro] = useState(true);
  const [days, setDays] = useState<number | null>(null);
  const [soundOn, setSoundOn] = useState(false);

  const words = useMemo(() => splitTitle(title), [title]);

  const switchMode = (m: Mode) => {
    modeRef.current = m;
    setMode(m);
    const v = videoRef.current;
    const hero = heroRef.current;
    if (!v || !hero) return;
    if (m === 'video') {
      const pick = hero.offsetWidth / hero.offsetHeight < 0.8 ? VIDEOS.portrait : VIDEOS.landscape;
      const src = videoUrl || pick.src;
      if (isSlowNetwork()) {
        v.poster = pick.poster;
        return;
      }
      if (!v.src.endsWith(src)) {
        if (!videoUrl) v.poster = pick.poster;
        v.src = src;
      }
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) v.play().catch(() => {});
    } else {
      v.pause();
    }
  };

  useEffect(() => {
    const ms = new Date(startsAt).getTime() - Date.now();
    if (ms > 0) setDays(Math.ceil(ms / 864e5));
  }, [startsAt]);

  useEffect(() => {
    const hero = heroRef.current!;
    const cv = glRef.current!;
    const dust = dustRef.current!;
    const vid = videoRef.current!;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEnd = isLowEnd();
    const playIntro = shouldPlayIntro();
    const introMs = playIntro ? 3000 : 0;
    const start = performance.now();

    setAnimateIntro(playIntro);
    const revealId = requestAnimationFrame(() => requestAnimationFrame(() => setPhase('ready')));

    const gl = lowEnd ? null : cv.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    let uni: Record<string, WebGLUniformLocation | null> | null = null;
    if (gl) {
      try {
        const compile = (type: number, src: string) => {
          const s = gl.createShader(type)!;
          gl.shaderSource(s, src);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
          return s;
        };
        const pr = gl.createProgram()!;
        gl.attachShader(pr, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
        gl.attachShader(pr, compile(gl.FRAGMENT_SHADER, fragmentShader(lowEnd ? 3 : 5)));
        gl.linkProgram(pr);
        gl.useProgram(pr);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(pr, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        uni = {};
        for (const n of ['uRes', 'uMouse', 'uCenter', 'uTime', 'uBreath', 'uIntro', 'uScroll', 'uSize']) uni[n] = gl.getUniformLocation(pr, n);
      } catch {
        uni = null;
      }
    }

    switchMode('video');
    const onVideoError = () => { if (uni) switchMode('live'); };
    vid.addEventListener('error', onVideoError);

    const dctx = dust.getContext('2d')!;
    let parts: { x: number; y: number; r: number; vx: number; vy: number; a: number; ph: number }[] = [];
    let W = 0, H = 0, dpr = 1;
    let scale = lowEnd ? 0.6 : Math.min(window.devicePixelRatio || 1, 1.5);
    let layout = { cx: 0, cy: 0.1, size: 0.4 };

    const resize = () => {
      const offset = hero.getBoundingClientRect().top + window.scrollY;
      hero.style.height = offset > 0 ? `calc(100svh - ${offset}px)` : '';
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      cv.width = Math.round(W * scale);
      cv.height = Math.round(H * scale);
      if (gl) gl.viewport(0, 0, cv.width, cv.height);
      const asp = W / H;
      layout = asp < 0.8 ? { cx: 0, cy: 0.2, size: Math.min(0.36, asp * 0.62) } : asp < 1.3 ? { cx: 0, cy: 0.12, size: 0.34 } : { cx: 0, cy: 0.1, size: 0.4 };
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      dust.width = W * dpr;
      dust.height = H * dpr;
      const n = lowEnd ? 40 : W < 700 ? 60 : 140;
      parts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(Math.random() * 0.18 + 0.04),
        a: Math.random() * 0.6 + 0.2,
        ph: Math.random() * 6.28,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0, px: -1e4, py: -1e4 };
    const onPointer = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      mouse.px = e.clientX;
      mouse.py = e.clientY;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });

    let scrollP = 0;
    const onScroll = () => {
      scrollP = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.9)));
      if (!reduce && copyRef.current) {
        copyRef.current.style.transform = `translateY(${-scrollP * 120}px) scale(${1 - scrollP * 0.08})`;
        copyRef.current.style.opacity = String(1 - Math.min(1, scrollP * 1.6));
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (!visible) vid.pause();
      else if (modeRef.current === 'video' && !reduce) vid.play().catch(() => {});
    });
    io.observe(hero);

    const drawDust = (t: number, b: number) => {
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const dx = p.x - mouse.px, dy = p.y - (mouse.py + window.scrollY), d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (1 - d2 / 14000) * 0.6, d = Math.sqrt(d2 + 1);
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }
        p.x += p.vx;
        p.y += p.vy * (0.6 + b * 0.8);
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        dctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(t * 1.3 + p.ph));
        dctx.fillStyle = p.r > 1.3 ? '#F5E5A4' : '#D4AF37';
        dctx.beginPath();
        dctx.arc(p.x, p.y, p.r * (0.9 + b * 0.3), 0, 6.283);
        dctx.fill();
      }
    };

    const frames: number[] = [];
    let raf = 0, last = 0, slowSince = 0, lastPhase = '';
    const frame = (now: number) => {
      if (!reduce) raf = requestAnimationFrame(frame);
      if (!reduce && (!visible || document.hidden)) return;
      const live = modeRef.current === 'live';
      if (lowEnd && live && now - last < 30) return;

      frames.push(now - last);
      last = now;
      if (frames.length > 40) frames.shift();
      if (frames.length === 40) {
        const avg = frames.reduce((x, y) => x + y) / 40;
        if (live && avg > 40) {
          if (!slowSince) slowSince = now;
          else if (now - slowSince > 1500) {
            slowSince = 0;
            frames.length = 0;
            if (scale > 0.45) {
              scale = Math.max(0.4, scale * 0.75);
              resize();
            } else {
              switchMode('video');
            }
          }
        } else slowSince = 0;
      }

      const t = reduce ? 0 : live ? (now / 1000) % 40 : vid.currentTime;
      const b = reduce ? 0.5 : breathAt(t);
      const intro = introMs ? Math.min(1, Math.max(0, (now - start - 200) / introMs)) : 1;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      const ph = t % BREATH_CYCLE < BREATH_IN ? 'in' : 'out';
      if (ph !== lastPhase && !reduce && breathRef.current) {
        breathRef.current.classList.toggle(styles.exhale, ph === 'out');
        lastPhase = ph;
      }
      const audio = audioRef.current;
      if (audio?.on) audio.master.gain.setTargetAtTime(0.025 + b * 0.045, audio.ctx.currentTime, 0.3);

      if (!live) {
        vid.style.transform = `scale(${1 + scrollP * 1.6})`;
        vid.style.opacity = String(1 - Math.max(0, scrollP - 0.5) * 2);
      } else if (gl && uni) {
        gl.uniform2f(uni.uRes, cv.width, cv.height);
        gl.uniform2f(uni.uMouse, reduce ? 0 : mouse.x, reduce ? 0 : mouse.y);
        gl.uniform2f(uni.uCenter, layout.cx, layout.cy);
        gl.uniform1f(uni.uTime, t);
        gl.uniform1f(uni.uBreath, b);
        gl.uniform1f(uni.uIntro, 1 - Math.pow(1 - intro, 3));
        gl.uniform1f(uni.uScroll, reduce ? 0 : scrollP);
        gl.uniform1f(uni.uSize, layout.size);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      if (!lowEnd) drawDust(reduce ? 0 : t, b);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(revealId);
      io.disconnect();
      vid.removeEventListener('error', onVideoError);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', onScroll);
      audioRef.current?.ctx.close();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleSound = () => {
    const on = !soundOn;
    setSoundOn(on);
    let audio = audioRef.current;
    if (on && !audio) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = 0;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 900;
      lp.connect(master);
      master.connect(ctx.destination);
      // Om drone: 136.1 Hz with fifth, octave and sub-octave
      for (const [f, g] of [[136.1, 0.5], [204.15, 0.22], [272.2, 0.16], [68.05, 0.35], [136.6, 0.3]]) {
        const o = ctx.createOscillator();
        const og = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = f;
        og.gain.value = g;
        o.connect(og);
        og.connect(lp);
        o.start();
      }
      audio = audioRef.current = { ctx, master, on: true };
    }
    if (audio) {
      audio.on = on;
      audio.ctx.resume();
      if (!on) audio.master.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.4);
    }
  };

  const delay = (s: number) => ({ '--d': animateIntro ? `${s}s` : '0s' }) as React.CSSProperties;
  let ci = 0;

  return (
    <section ref={heroRef} className={cn(styles.hero, styles[phase])} data-mode={mode} data-hero aria-label={title}>
      <canvas ref={glRef} className={cn(styles.layer, styles.gl)} aria-hidden="true" />
      <video ref={videoRef} className={cn(styles.layer, styles.video)} muted loop playsInline preload="none" aria-hidden="true" />
      <canvas ref={dustRef} className={cn(styles.layer, styles.dust)} aria-hidden="true" />

      <div ref={copyRef} className={styles.copy}>
        <div className={cn(styles.pill, styles.fade)} style={delay(1.2)}>
          <span>{dates}</span>
          <i className={styles.dot} />
          <span>{location}</span>
          {days !== null && (
            <>
              <i className={styles.dot} />
              <span className={styles.days}>{days} days away</span>
            </>
          )}
        </div>

        <h1 className={styles.title} aria-label={words.map((w) => w.word).join(' ')}>
          {words.map((w, wi) => (
            <React.Fragment key={wi}>
              <span className={w.accent ? styles.accent : undefined} aria-hidden="true">
                {Array.from(w.word).map((c) => (
                  <span key={ci} className={styles.ch} style={delay(0.9 + ci++ * 0.07)}>
                    {c}
                  </span>
                ))}
              </span>
              {wi < words.length - 1 && ' '}
            </React.Fragment>
          ))}
        </h1>

        <div className={cn(styles.sub, styles.fade)} style={delay(1.9)}>{subtitle}</div>
        <p className={cn(styles.tagline, styles.fade)} style={delay(2.2)}>{tagline}</p>

        <div className={cn(styles.actions, styles.fade)} style={delay(2.5)}>
          <Link href="/register" className={styles.primary}>Begin your journey</Link>
          <Link href="/about" className={styles.ghost}>Explore the retreat</Link>
        </div>

        <div ref={breathRef} className={cn(styles.breath, styles.fade)} style={delay(3)} aria-hidden="true">
          <span className={styles.in}>Breathe in</span>
          <span className={styles.out}>Breathe out</span>
        </div>
      </div>

      <button type="button" className={cn(styles.chip, styles.sound, styles.fade)} style={delay(3)} aria-pressed={soundOn} onClick={toggleSound}>
        <span className={styles.bars}><i /><i /><i /></span>
        <span className={styles.soundLabel}>Breathe with sound</span>
      </button>

    </section>
  );
}
