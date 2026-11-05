let cached: boolean | null = null;

export function shouldPlayIntro() {
  if (cached !== null) return cached;
  if (typeof window === 'undefined') return false;
  let seen = false;
  try {
    seen = sessionStorage.getItem('btm-intro') === '1';
    sessionStorage.setItem('btm-intro', '1');
  } catch {}
  cached = !seen && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return cached;
}
