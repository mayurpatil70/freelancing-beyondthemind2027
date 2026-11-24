// Google Analytics 4 helpers. The tag loads only when a real measurement ID is set
// (admin SEO tab "Google Analytics ID", or NEXT_PUBLIC_GA_ID which wins).

const PLACEHOLDER_IDS = new Set(['G-BTM2027RETREAT']);

/** Returns a usable GA4 measurement ID (G-XXXXXXXXXX), or undefined for blanks and placeholders. */
export function gaMeasurementId(adminValue?: string | null): string | undefined {
  const raw = (process.env.NEXT_PUBLIC_GA_ID || adminValue || '').trim().toUpperCase();
  if (!/^G-[A-Z0-9]{6,12}$/.test(raw) || PLACEHOLDER_IDS.has(raw)) return undefined;
  return raw;
}

type Gtag = (command: 'event', name: string, params?: Record<string, unknown>) => void;

/**
 * Sends a GA4 "generate_lead" event so enquiries show up by source (Google, Instagram,
 * WhatsApp link, directory...) in GA4. Does nothing when GA is not installed.
 */
export function trackLead(form: string, programme?: string): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return;
  try {
    gtag('event', 'generate_lead', { form_name: form, programme: programme || '' });
  } catch {
    // Analytics must never break a form.
  }
}
