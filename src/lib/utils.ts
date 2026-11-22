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

export function openWhatsApp(
  url: string,
  emailSubject: string = 'Retreat Enquiry - Beyond the Mind 2027',
  emailBody: string = 'Namaste Beyond the Mind Team,\n\nI would like to enquire about Beyond the Mind 2027.'
) {
  if (typeof window === 'undefined') return;
  const mailtoUrl = `mailto:moolabrahman@gmail.com?subject=${encodeURIComponent(
    emailSubject
  )}&body=${encodeURIComponent(emailBody)}`;

  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = mailtoUrl;
    }
  } catch {
    window.location.href = mailtoUrl;
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

