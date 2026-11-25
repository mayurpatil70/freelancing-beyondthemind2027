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
  language_preference: 'English' | 'Hindi' | 'Malayalam' | 'English & Hindi' | 'English, Hindi & Malayalam' | 'English & Malayalam (Hindi on request)';
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
  keywords?: string;
  /** CSS object-position for the card photo, e.g. "80% center" to keep a subject on the right in view. */
  image_position?: string;
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
  /** Comma-separated SEO keywords. Used only in page meta tags / structured data, never shown on the card. */
  keywords?: string;
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
  media_type?: 'image' | 'video';
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
    | 'Accommodations'
    | 'Daily Guided Meditation'
    | 'Registration & Payment';
  /** Comma-separated SEO keywords. Used only in page meta tags / structured data, never shown on the card. */
  keywords?: string;
}

/** One participation / accommodation option on /participation. Also becomes an Offer in the retreat Event schema. */
export interface ParticipationTier {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  inclusions: string[];
  status_note: string;
  /** Optional price in INR (digits, e.g. "45000"). Shown on the card and sent to Google when set. */
  price?: string;
  /** Comma-separated SEO keywords. Used only in page meta tags / structured data, never shown on the card. */
  keywords?: string;
}

export interface RishikeshAttraction {
  id: string;
  title: string;
  category: 'Adrenaline & Adventure' | 'Sacred Heritage' | 'Nature & Scenic' | 'Wellness & Peace';
  description: string;
  highlights: string[];
  image_url: string;
  location_tip: string;
  duration: string;
}

export interface WeatherClothingGuide {
  season: string;
  month: string;
  day_temp: string;
  night_temp: string;
  summary: string;
  clothing_tips: string[];
  recommended_items: string[];
}

export interface CustomContactLink {
  id: string;
  label: string;
  type: 'phone' | 'email' | 'link';
  value: string;
}

export interface SiteSettings {
  hero_title: string;
  hero_subtitle: string;
  hero_tagline: string;
  arrival_date: string; // e.g. "October 5, 2027"
  arrival_time: string; // e.g. "October 5"
  retreat_dates: string; // e.g. "October 6–9, 2027 (Wednesday – Saturday)"
  retreat_days: string; // e.g. "4 Days (Oct 6–9) • Arrival Oct 5"
  retreat_location: string;
  retreat_state: string;
  retreat_modes: string; // e.g. "Offline (Rishikesh) & Online Live"
  retreat_languages: string; // e.g. "English (Hindi translation available)"
  video_url: string;
  poster_url: string;
  whatsapp_number: string;
  whatsapp_display: string;
  primary_phone?: string;
  email: string;
  primary_email?: string;
  instagram_url: string;
  facebook_url: string;
  guide_name?: string;
  guide_headline?: string;
  guide_bio?: string;
  daily_meditation_headline: string;
  daily_meditation_tagline: string;
  daily_meditation_time: string;
  daily_meditation_days: string;
  daily_meditation_platform: string;
  daily_meditation_fee: string;
  daily_meditation_description: string;
  registration_google_form_url: string;
  registration_google_form_enabled: boolean;
  payment_proof_upload_enabled: boolean;
  meta_keywords?: Record<string, string>;
  google_search_console_token?: string;
  google_analytics_id?: string;
  youtube_url?: string;
  twitter_url?: string;
  secondary_phone?: string;
  secondary_email?: string;
  custom_contacts?: CustomContactLink[];
  hero_notice_card?: {
    enabled: boolean;
    badge?: string;
    title: string;
    description: string;
    discount_text?: string;
    cta_text?: string;
    cta_link?: string;
  };
  announcement_banner?: {
    enabled: boolean;
    text: string;
    badge?: string;
    link?: string;
  };
}


export interface MediaAsset {
  id: string;
  key: string;
  url: string;
  kind: 'image' | 'video';
  mime_type: string;
  size_bytes: number;
  original_name: string;
  created_at: string;
}

// ----------------------------------------------------------------------------
// Blog: "Wisdom Beyond the Mind" (/blog). Edited in the admin Blog tab.
// ----------------------------------------------------------------------------

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  /** One or two sentence summary, used on cards and as the meta description. */
  excerpt: string;
  /** Article body. Empty line = new paragraph, "## " heading, "### " subheading, "- " list item, "> " quote, **bold**. */
  content: string;
  author: string;
  /** YYYY-MM-DD */
  published_at: string;
  /** YYYY-MM-DD, optional */
  updated_at?: string;
  image?: string;
  image_alt?: string;
  image_position?: string;
  /** The one article shown large at the top of /blog. */
  featured?: boolean;
  /** Shown under "Popular Articles". */
  popular?: boolean;
  /** Draft articles are hidden from the site. */
  published: boolean;
  /** Comma separated SEO keywords. Never shown on the page. */
  keywords?: string;
  /** Short questions and answers shown at the end and given to search engines as FAQ structured data. */
  faqs?: BlogFAQ[];
}
