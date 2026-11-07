import fs from 'fs';
import path from 'path';
import {
  Registration,
  RegistrationStatus,
  PaymentVerificationStatus,
  SacredExperience,
  ProgrammeDay,
  Testimonial,
  GalleryItem,
  FAQItem,
  SiteSettings,
  RishikeshAttraction,
  WeatherClothingGuide,
} from '@/types';
import {
  initialSiteSettings,
  initialExperiences,
  initialProgramme,
  initialTestimonials,
  initialGallery,
  initialFAQs,
  initialAttractions,
  initialWeatherClothing,
} from '@/lib/data/initialData';
import { getAdminSupabase, isServerSupabaseConfigured } from '@/lib/supabase/server';

interface LocalDatabase {
  settings: SiteSettings;
  experiences: SacredExperience[];
  programme: ProgrammeDay[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: FAQItem[];
  attractions?: RishikeshAttraction[];
  weatherClothing?: WeatherClothingGuide;
  registrations: Registration[];
}

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

function ensureLocalDb(): LocalDatabase {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_PATH)) {
    const initialDb: LocalDatabase = {
      settings: initialSiteSettings,
      experiences: initialExperiences,
      programme: initialProgramme,
      testimonials: initialTestimonials,
      gallery: initialGallery,
      faqs: initialFAQs,
      attractions: initialAttractions,
      weatherClothing: initialWeatherClothing,
      registrations: [
        {
          id: 'BTM27-1001',
          full_name: 'Dr. Evelyn Vance',
          email: 'evelyn.vance@wellnessarchive.org',
          country_code: '+1',
          phone: '4155552671',
          country: 'United States',
          city: 'San Francisco',
          programme: '4-Day Divine Retreat Rishikesh',
          language_preference: 'English',
          dietary_requirements: 'Sattvic vegan, gluten-free',
          message: 'Seeking deep inner stillness and guidance on Kundalini energetic integration.',
          privacy_consent: true,
          status: 'Confirmed',
          payment_status: 'Verified',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          admin_notes: [
            {
              id: 'note-1',
              text: 'Verified bank transfer. Single room reserved by the quiet garden wing.',
              author: 'Admin Concierge',
              created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
            },
          ],
        },
        {
          id: 'BTM27-1002',
          full_name: 'Rajesh Nair',
          email: 'rajesh.nair@keralaheritage.in',
          country_code: '+91',
          phone: '9847012345',
          country: 'India',
          city: 'Kochi',
          programme: '4-Day Divine Retreat Rishikesh',
          language_preference: 'English & Hindi',
          dietary_requirements: 'Traditional vegetarian',
          message: 'Attended BTM 2026 Kanyakumari. Keen to experience the sacred Ganga energy and Shiva Mandala.',
          privacy_consent: true,
          status: 'Payment Verification',
          payment_status: 'Pending Verification',
          payment_proof_url: '/images/posters/btm2026-testimonial.jpg',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          admin_notes: [
            {
              id: 'note-2',
              text: 'Uploaded transaction receipt. Awaiting bank clearance check.',
              author: 'Admin Concierge',
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
          ],
        },
      ],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2), 'utf-8');
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as LocalDatabase;
    let mutated = false;
    if (!parsed.attractions || parsed.attractions.length === 0) {
      parsed.attractions = initialAttractions;
      mutated = true;
    }
    if (!parsed.weatherClothing) {
      parsed.weatherClothing = initialWeatherClothing;
      mutated = true;
    }
    if (!parsed.experiences || parsed.experiences.length < 7) {
      parsed.experiences = initialExperiences;
      mutated = true;
    }
    if (!parsed.programme || parsed.programme.length < 5 || parsed.programme[0].day_number !== 0) {
      parsed.programme = initialProgramme;
      mutated = true;
    }
    if (!parsed.settings || !parsed.settings.arrival_date || !parsed.settings.daily_meditation_headline) {
      parsed.settings = { ...initialSiteSettings, ...(parsed.settings || {}) };
      mutated = true;
    }
    if (mutated) {
      fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch {
    return {
      settings: initialSiteSettings,
      experiences: initialExperiences,
      programme: initialProgramme,
      testimonials: initialTestimonials,
      gallery: initialGallery,
      faqs: initialFAQs,
      attractions: initialAttractions,
      weatherClothing: initialWeatherClothing,
      registrations: [],
    };
  }
}

function writeLocalDb(data: LocalDatabase) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// ============================================================================
// DATA ACCESS FUNCTIONS
// ============================================================================

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('site_settings').select('data').eq('id', 1).single();
      if (!error && data?.data) {
        return { ...initialSiteSettings, ...data.data };
      }
    } catch (e) {
      console.warn('Supabase getSiteSettings error, falling back to local storage:', e);
    }
  }
  const db = ensureLocalDb();
  return db.settings || initialSiteSettings;
}

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const merged: SiteSettings = { ...current, ...updates };

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      await supabase.from('site_settings').upsert({ id: 1, data: merged, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn('Supabase updateSiteSettings error:', e);
    }
  }

  const db = ensureLocalDb();
  db.settings = merged;
  writeLocalDb(db);
  return merged;
}

export async function getExperiences(): Promise<SacredExperience[]> {
  const db = ensureLocalDb();
  return db.experiences || initialExperiences;
}

export async function getProgramme(): Promise<ProgrammeDay[]> {
  const db = ensureLocalDb();
  return db.programme || initialProgramme;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const db = ensureLocalDb();
  return db.testimonials || initialTestimonials;
}

export async function getGallery(): Promise<GalleryItem[]> {
  const db = ensureLocalDb();
  return db.gallery || initialGallery;
}

export async function getFAQs(): Promise<FAQItem[]> {
  const db = ensureLocalDb();
  return db.faqs || initialFAQs;
}

// ----------------------------------------------------------------------------
// Registrations
// ----------------------------------------------------------------------------

export async function getRegistrations(): Promise<Registration[]> {
  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*, admin_notes(*)')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Registration[];
      }
    } catch (e) {
      console.warn('Supabase getRegistrations error, using local fallback:', e);
    }
  }

  const db = ensureLocalDb();
  return db.registrations.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function saveRegistration(
  regData: Omit<Registration, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status'> & {
    id?: string;
  }
): Promise<Registration> {
  const id = regData.id || `BTM27-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const newReg: Registration = {
    ...regData,
    id,
    status: 'New',
    payment_status: regData.payment_proof_url ? 'Pending Verification' : 'None',
    created_at: now,
    updated_at: now,
    admin_notes: [],
  };

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      await supabase.from('registrations').insert([
        {
          id: newReg.id,
          full_name: newReg.full_name,
          email: newReg.email,
          country_code: newReg.country_code,
          phone: newReg.phone,
          country: newReg.country,
          city: newReg.city,
          programme: newReg.programme,
          language_preference: newReg.language_preference,
          dietary_requirements: newReg.dietary_requirements || null,
          message: newReg.message || null,
          privacy_consent: newReg.privacy_consent,
          status: newReg.status,
          payment_proof_url: newReg.payment_proof_url || null,
          payment_status: newReg.payment_status,
          created_at: now,
          updated_at: now,
        },
      ]);
    } catch (e) {
      console.warn('Supabase saveRegistration error, continuing with local store:', e);
    }
  }

  const db = ensureLocalDb();
  db.registrations.unshift(newReg);
  writeLocalDb(db);

  return newReg;
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  paymentStatus?: PaymentVerificationStatus
): Promise<Registration | null> {
  const db = ensureLocalDb();
  const index = db.registrations.findIndex((r) => r.id === id);
  if (index === -1) return null;

  db.registrations[index].status = status;
  if (paymentStatus) {
    db.registrations[index].payment_status = paymentStatus;
  }
  db.registrations[index].updated_at = new Date().toISOString();

  writeLocalDb(db);

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      const updatePayload: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (paymentStatus) updatePayload.payment_status = paymentStatus;
      await supabase.from('registrations').update(updatePayload).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateRegistrationStatus error:', e);
    }
  }

  return db.registrations[index];
}

export async function addAdminNote(
  registrationId: string,
  noteText: string,
  author: string = 'Admin Concierge'
) {
  const db = ensureLocalDb();
  const index = db.registrations.findIndex((r) => r.id === registrationId);
  if (index === -1) return null;

  const note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    text: noteText,
    author,
    created_at: new Date().toISOString(),
  };

  if (!db.registrations[index].admin_notes) {
    db.registrations[index].admin_notes = [];
  }
  db.registrations[index].admin_notes!.push(note);
  writeLocalDb(db);

  const supabase = getAdminSupabase();
  if (supabase) {
    try {
      await supabase.from('admin_notes').insert([
        {
          registration_id: registrationId,
          note_text: noteText,
          author,
        },
      ]);
    } catch (e) {
      console.warn('Supabase addAdminNote error:', e);
    }
  }

  return note;
}

export async function updateExperiencesData(experiences: SacredExperience[]) {
  const db = ensureLocalDb();
  db.experiences = experiences;
  writeLocalDb(db);
  return db.experiences;
}

export async function updateProgrammeData(programme: ProgrammeDay[]) {
  const db = ensureLocalDb();
  db.programme = programme;
  writeLocalDb(db);
  return db.programme;
}

export async function updateFAQsData(faqs: FAQItem[]) {
  const db = ensureLocalDb();
  db.faqs = faqs;
  writeLocalDb(db);
  return db.faqs;
}

export async function getAttractions(): Promise<RishikeshAttraction[]> {
  const db = ensureLocalDb();
  return db.attractions || initialAttractions;
}

export async function updateAttractionsData(attractions: RishikeshAttraction[]) {
  const db = ensureLocalDb();
  db.attractions = attractions;
  writeLocalDb(db);
  return db.attractions;
}

export async function getWeatherClothing(): Promise<WeatherClothingGuide> {
  const db = ensureLocalDb();
  return db.weatherClothing || initialWeatherClothing;
}

export async function updateWeatherClothingData(data: WeatherClothingGuide) {
  const db = ensureLocalDb();
  db.weatherClothing = data;
  writeLocalDb(db);
  return db.weatherClothing;
}

export async function updateGalleryData(gallery: GalleryItem[]) {
  const db = ensureLocalDb();
  db.gallery = gallery;
  writeLocalDb(db);
  return db.gallery;
}

