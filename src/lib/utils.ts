import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRegistrationId(): string {
  const chars = '0123456789';
  let randomNum = '';
  for (let i = 0; i < 4; i++) {
    randomNum += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BTM27-${randomNum}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

export function formatWhatsAppUrl(number: string, message: string): string {
  const cleaned = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

// Opens a wa.me link in WhatsApp. It never falls back to email: both retreat numbers are on WhatsApp, and the
// old "popup returned null → open mail" check misfired every time because window.open with `noopener`
// always returns null, so phones opened WhatsApp and the mail app together.
// The subject/body arguments are kept so existing callers still compile.
export function openWhatsApp(
  url: string,
  _emailSubject?: string,
  _emailBody?: string
) {
  if (typeof window === 'undefined') return;
  const isMobile =
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isMobile) {
    // Same-tab navigation hands wa.me straight to the WhatsApp app.
    window.location.href = url;
    return;
  }
  const win = window.open(url, '_blank');
  if (win) {
    win.opener = null;
  } else {
    // Popup blocked: go there in this tab instead.
    window.location.href = url;
  }
}

export function handleWhatsAppClick(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  url: string,
  subject: string = 'Retreat Enquiry - Beyond the Mind 2027',
  body: string = 'Namaste Beyond the Mind Team,\n\nI would like to enquire about Beyond the Mind 2027.'
) {
  e.preventDefault();
  openWhatsApp(url, subject, body);
}

