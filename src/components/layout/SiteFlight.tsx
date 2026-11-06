'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type Nav = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };

const REVEAL = [
  'main section h2',
  'main section article',
  'main section [class*="grid"] > *',
  'main section .rounded-3xl',
  'main section form',
  'footer > div > *',
].join(',');

function isLowEnd() {
  const n = navigator as Nav;
  return (n.hardwareConcurrency || 8) <= 4 || (n.deviceMemory || 8) <= 3 || !!n.connection?.saveData;
}

export function SiteFlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || pathname.startsWith('/admin')) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || isLowEnd()) return;

    const COUNT = innerWidth < 640 ? 70 : 140;
    const stars = Array.from({ length: COUNT }, () => spawn(Math.random()));
    let w = 0, h = 0, raf = 0, lastY = scrollY, boost = 0, running = true;

    function spawn(z = 1) {
      return { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z, pz: z, gold: Math.random() < 0.45 };
    }
    function resize() {
      w = canvas!.width = innerWidth;
      h = canvas!.height = innerHeight;
    }
    function frame() {
      if (!running) return;
      const dy = scrollY - lastY;
      lastY = scrollY;
      boost += (Math.max(-0.012, Math.min(0.03, dy * 0.0006)) - boost) * 0.08;
      const speed = 0.0025 + boost;

      ctx!.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h * 0.42, f = Math.max(w, h) * 0.5;
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0.02 || s.z > 1) { Object.assign(s, spawn(s.z <= 0.02 ? 1 : 0.03)); continue; }
        const sx = cx + (s.x / s.z) * f, sy = cy + (s.y / s.z) * f;
        if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) { Object.assign(s, spawn()); continue; }
        const px = cx + (s.x / s.pz) * f, py = cy + (s.y / s.pz) * f;
        const a = Math.min(1, (1 - s.z) * 1.4) * 0.75;
        ctx!.strokeStyle = s.gold ? `rgba(245,229,164,${a})` : `rgba(250,248,245,${a * 0.8})`;
        ctx!.lineWidth = (1 - s.z) * 2.2 + 0.3;
        ctx!.beginPath();
        ctx!.moveTo(px, py);
        ctx!.lineTo(sx + 0.1, sy + 0.1);
        ctx!.stroke();
      }
      raf = requestAnimationFrame(frame);
    }
    function onVisibility() {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) { lastY = scrollY; raf = requestAnimationFrame(frame); }
    }

    resize();
    canvas.style.opacity = '1';
    raf = requestAnimationFrame(frame);
    addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      canvas.style.opacity = '0';
      removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith('/admin') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(REVEAL)).filter((el) => !el.closest('[data-hero]'));
    const set = new Set(els);
    const roots = els.filter((el) => {
      for (let p = el.parentElement; p; p = p.parentElement) if (set.has(p)) return false;
      return true;
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.dataset.fly = 'in';
          io.unobserve(el);
          setTimeout(() => { if (el.dataset.fly === 'in') el.dataset.fly = 'done'; }, 1500 + (parseInt(el.style.getPropertyValue('--fly-delay')) || 0));
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    roots.forEach((el) => {
      if (el.dataset.fly) return;
      const idx = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--fly-delay', `${Math.min(idx, 5) * 90}ms`);
      if (el.getBoundingClientRect().top < innerHeight * 0.9) return;
      el.dataset.fly = 'out';
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  return <canvas ref={canvasRef} aria-hidden="true" className="site-flight" />;
}
