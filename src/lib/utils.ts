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

