export type RegistrationStatus =
  | 'New'
  | 'Contacted'
  | 'Awaiting Payment'
  | 'Payment Verification'
  | 'Confirmed'
  | 'Waitlisted'
  | 'Cancelled';

export type PaymentVerificationStatus =
  | 'None'
  | 'Pending Verification'
  | 'Verified'
  | 'Rejected';

export interface Registration {
  id: string; // e.g. BTM27-1042
  full_name: string;
  email: string;
  country_code: string;
  phone: string;
  country: string;
  city: string;
  programme: string;
  language_preference: 'English' | 'Hindi' | 'English & Hindi';
  dietary_requirements?: string;
  message?: string;
  privacy_consent: boolean;
  status: RegistrationStatus;
  payment_proof_url?: string;
  payment_status: PaymentVerificationStatus;
  admin_notes?: Array<{
    id: string;
    text: string;
    author: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface SacredExperience {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  short_desc: string;
  full_desc: string;
  image: string;
  icon_name: string;
  order: number;
  spiritual_dimension: string;
  highlights: string[];
}

export interface ProgrammeDay {
  day_number: number;
  date: string;
  formatted_date: string;
  day_name: string;
  theme: string;
  subtitle: string;
  summary: string;
  sessions: Array<{
    phase: string;
    title: string;
    description: string;
  }>;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  edition: string;
  highlight_quote: string;
  full_testimonial: string;
  poster_url?: string;
  is_featured: boolean;
  date?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | 'Retreat Experience'
    | 'Participants'
    | 'Meditation'
    | 'Kundalini Awakening'
    | 'Nature & Mountains'
    | 'Rishikesh'
    | 'Sacred Moments';
  image_url: string;
  caption: string;
  location?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category:
    | 'General & Dates'
    | 'Retreat Experience'
    | 'Location & Travel'
    | 'Accommodations & Meals'
    | 'Daily Guided Meditation'
    | 'Registration & Payment';
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  retreat_dates: string;
  retreat_days: string;
  retreat_location: string;
  retreat_state: string;
  video_url: string;
  poster_url: string;
  whatsapp_number: string;
  whatsapp_display: string;
  email: string;
  instagram_url: string;
  facebook_url: string;
  daily_meditation_time: string;
  daily_meditation_days: string;
  daily_meditation_platform: string;
  payment_proof_upload_enabled: boolean;
  announcement_banner?: {
    enabled: boolean;
    text: string;
    badge?: string;
    link?: string;
  };
}

