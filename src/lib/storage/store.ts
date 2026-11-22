import fs from 'fs';
import path from 'path';
import os from 'os';
import { cache } from 'react';
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
  MediaAsset,
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
import { getSql } from '@/lib/db/neon';
import contentSnapshot from '@/data/db.json';

export interface ContentMap {
  settings: SiteSettings;
  experiences: SacredExperience[];
  programme: ProgrammeDay[];
  testimonials: Testimonial[];
  gallery: GalleryItem[];
  faqs: FAQItem[];
  attractions: RishikeshAttraction[];
  weatherClothing: WeatherClothingGuide;
}

export type ContentKey = keyof ContentMap;

export const CONTENT_KEYS: ContentKey[] = [
  'settings',
  'experiences',
  'programme',
  'testimonials',
  'gallery',
  'faqs',
  'attractions',
  'weatherClothing',
];

const defaults: ContentMap = {
  settings: initialSiteSettings,
  experiences: initialExperiences,
  programme: initialProgramme,
  testimonials: initialTestimonials,
  gallery: initialGallery,
  faqs: initialFAQs,
  attractions: initialAttractions,
  weatherClothing: initialWeatherClothing,
};

// Local JSON fallback, used only when DATABASE_URL is not set. Its build-time snapshot also fills keys missing in Neon.
type LocalDb = Partial<ContentMap> & { registrations?: Registration[]; media?: MediaAsset[] };

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');
const TMP_DB_PATH = path.join(os.tmpdir(), 'btm-db.json');
let memoryDb: LocalDb | null = null;

export function readLocalDb(): LocalDb {
  if (memoryDb) return memoryDb;
  const files = [DB_PATH, TMP_DB_PATH]
    .filter((f) => fs.existsSync(f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  for (const file of files) {
    try {
      memoryDb = JSON.parse(fs.readFileSync(file, 'utf-8')) as LocalDb;
      return memoryDb;
    } catch {}
  }
  memoryDb = {};
  return memoryDb;
}

export function writeLocalDb(db: LocalDb) {
  memoryDb = db;
  const json = JSON.stringify(db, null, 2);
  for (const file of [DB_PATH, TMP_DB_PATH]) {
    try {
      fs.writeFileSync(file, json, 'utf-8');
    } catch {}
  }
}

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

// ----------------------------------------------------------------------------
// CMS content
// ----------------------------------------------------------------------------

let memoryContentCache: { data: Partial<ContentMap>; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

const loadContent = cache(async (): Promise<Partial<ContentMap>> => {
  if (memoryContentCache && (Date.now() - memoryContentCache.timestamp < CACHE_TTL_MS)) {
    return memoryContentCache.data;
  }
  const sql = getSql();
  const local = readLocalDb();
  if (!sql) {
    memoryContentCache = { data: local, timestamp: Date.now() };
    return local;
  }
  try {
    const fetchRows = async () => {
      const rows = await sql`SELECT key, data FROM cms_content`;
      return Object.fromEntries(rows.map((r) => [r.key, r.data])) as Partial<ContentMap>;
    };
    const data = await withTimeout(fetchRows(), 8000, local);

    // Code-authored collections (programme, faqs, testimonials) are maintained directly in git / db.json.
    // Purge any stale database snapshot so it never overrides clean code updates, and sync clean data to Neon.
    if (local.programme && local.programme.length > 0) {
      delete data.programme;
      if (sql) {
        sql`
          INSERT INTO cms_content (key, data, updated_at)
          VALUES ('programme', ${JSON.stringify(local.programme)}::jsonb, now())
          ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
        `.catch(() => {});
      }
    }

    if (local.faqs && local.faqs.length > 0) {
      delete data.faqs;
      if (sql) {
        sql`
          INSERT INTO cms_content (key, data, updated_at)
          VALUES ('faqs', ${JSON.stringify(local.faqs)}::jsonb, now())
          ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
        `.catch(() => {});
      }
    }

    if (local.testimonials && local.testimonials.length > 0) {
      delete data.testimonials;
      if (sql) {
        sql`
          INSERT INTO cms_content (key, data, updated_at)
          VALUES ('testimonials', ${JSON.stringify(local.testimonials)}::jsonb, now())
          ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
        `.catch(() => {});
      }
    }

    const merged = { ...local, ...data };
    memoryContentCache = { data: merged, timestamp: Date.now() };
    return merged;
  } catch (e) {
    console.error('Neon loadContent error, serving defaults:', e);
    return local;
  }
});

async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const all = await loadContent();
  const value = all[key];
  const localDb = readLocalDb();
  const seed = (contentSnapshot as unknown as Partial<ContentMap>)[key];
  const fallback = localDb[key] ?? seed ?? defaults[key];

  // Guaranteed authoritative local source of truth for code-driven collections
  if (key === 'programme') {
    return (localDb.programme || seed || defaults.programme) as ContentMap[K];
  }
  if (key === 'faqs') {
    return (localDb.faqs || seed || defaults.faqs) as ContentMap[K];
  }
  if (key === 'testimonials') {
    return (localDb.testimonials || seed || defaults.testimonials) as ContentMap[K];
  }
  if (key === 'settings') {
    return { ...defaults.settings, ...((seed as SiteSettings) || {}), ...((fallback as SiteSettings) || {}), ...((value as SiteSettings) || {}) } as ContentMap[K];
  }
  return (value ?? fallback) as ContentMap[K];
}

export async function setContent<K extends ContentKey>(key: K, data: ContentMap[K]): Promise<ContentMap[K]> {
  memoryContentCache = null;
  const sql = getSql();
  if (sql) {
    await sql`
      INSERT INTO cms_content (key, data, updated_at)
      VALUES (${key}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
  }
  // Also keep local DB synced
  const db = readLocalDb();
  db[key] = data;
  writeLocalDb(db);
  return data;
}

export const getSiteSettings = () => getContent('settings');
export const getExperiences = () => getContent('experiences');
export const getProgramme = () => getContent('programme');
export const getTestimonials = () => getContent('testimonials');
export const getGallery = () => getContent('gallery');
export const getFAQs = () => getContent('faqs');
export const getAttractions = () => getContent('attractions');
export const getWeatherClothing = () => getContent('weatherClothing');

export async function updateSiteSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  return setContent('settings', { ...current, ...updates });
}

export const updateExperiencesData = (data: SacredExperience[]) => setContent('experiences', data);
export const updateProgrammeData = (data: ProgrammeDay[]) => setContent('programme', data);
export const updateFAQsData = (data: FAQItem[]) => setContent('faqs', data);
export const updateAttractionsData = (data: RishikeshAttraction[]) => setContent('attractions', data);
export const updateWeatherClothingData = (data: WeatherClothingGuide) => setContent('weatherClothing', data);
export const updateGalleryData = (data: GalleryItem[]) => setContent('gallery', data);
export const updateTestimonialsData = (data: Testimonial[]) => setContent('testimonials', data);

// ----------------------------------------------------------------------------
// Registrations
// ----------------------------------------------------------------------------

function rowToRegistration(row: Record<string, unknown>): Registration {
  return {
    ...(row as unknown as Registration),
    dietary_requirements: (row.dietary_requirements as string) || undefined,
    message: (row.message as string) || undefined,
    payment_proof_url: (row.payment_proof_url as string) || undefined,
    created_at: iso(row.created_at),
    updated_at: iso(row.updated_at),
    admin_notes: ((row.admin_notes as Registration['admin_notes']) || []).map((n) => ({
      ...n,
      created_at: iso(n.created_at),
    })),
  };
}

export async function getRegistrations(): Promise<Registration[]> {
  const sql = getSql();
  if (sql) {
    const rows = await sql`
      SELECT r.*,
        COALESCE(
          json_agg(json_build_object('id', n.id, 'text', n.text, 'author', n.author, 'created_at', n.created_at)
            ORDER BY n.created_at) FILTER (WHERE n.id IS NOT NULL),
          '[]'
        ) AS admin_notes
      FROM registrations r
      LEFT JOIN admin_notes n ON n.registration_id = r.id
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `;
    return rows.map(rowToRegistration);
  }
  return [...(readLocalDb().registrations || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function saveRegistration(
  regData: Omit<Registration, 'id' | 'created_at' | 'updated_at' | 'status' | 'payment_status'> & {
    id?: string;
  }
): Promise<Registration> {
  const now = new Date().toISOString();
  const reg: Registration = {
    ...regData,
    id: regData.id || `BTM27-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'New',
    payment_status: regData.payment_proof_url ? 'Pending Verification' : 'None',
    created_at: now,
    updated_at: now,
    admin_notes: [],
  };

  const sql = getSql();
  if (sql) {
    await sql`
      INSERT INTO registrations (
        id, full_name, email, country_code, phone, country, city, programme, language_preference,
        dietary_requirements, message, privacy_consent, status, payment_proof_url, payment_status, created_at, updated_at
      ) VALUES (
        ${reg.id}, ${reg.full_name}, ${reg.email}, ${reg.country_code}, ${reg.phone}, ${reg.country}, ${reg.city},
        ${reg.programme}, ${reg.language_preference}, ${reg.dietary_requirements || null}, ${reg.message || null},
        ${reg.privacy_consent}, ${reg.status}, ${reg.payment_proof_url || null}, ${reg.payment_status}, ${now}, ${now}
      )
    `;
    return reg;
  }

  const db = readLocalDb();
  db.registrations = [reg, ...(db.registrations || [])];
  writeLocalDb(db);
  return reg;
}

export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  paymentStatus?: PaymentVerificationStatus,
  paymentProofUrl?: string
): Promise<Registration | null> {
  const sql = getSql();
  if (sql) {
    const rows = await sql`
      UPDATE registrations SET
        status = ${status},
        payment_status = COALESCE(${paymentStatus ?? null}, payment_status),
        payment_proof_url = COALESCE(${paymentProofUrl ?? null}, payment_proof_url),
        updated_at = now()
      WHERE id = ${id}
      RETURNING id
    `;
    if (rows.length === 0) return null;
    return (await getRegistrations()).find((r) => r.id === id) || null;
  }

  const db = readLocalDb();
  const reg = db.registrations?.find((r) => r.id === id);
  if (!reg) return null;
  reg.status = status;
  if (paymentStatus) reg.payment_status = paymentStatus;
  if (paymentProofUrl) reg.payment_proof_url = paymentProofUrl;
  reg.updated_at = new Date().toISOString();
  writeLocalDb(db);
  return reg;
}

export async function addAdminNote(registrationId: string, noteText: string, author: string = 'Admin Concierge') {
  const note = {
    id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    text: noteText,
    author,
    created_at: new Date().toISOString(),
  };

  const sql = getSql();
  if (sql) {
    const rows = await sql`
      INSERT INTO admin_notes (id, registration_id, text, author, created_at)
      SELECT ${note.id}, id, ${note.text}, ${note.author}, ${note.created_at}::timestamptz
      FROM registrations WHERE id = ${registrationId}
      RETURNING id
    `;
    return rows.length ? note : null;
  }

  const db = readLocalDb();
  const reg = db.registrations?.find((r) => r.id === registrationId);
  if (!reg) return null;
  reg.admin_notes = [...(reg.admin_notes || []), note];
  writeLocalDb(db);
  return note;
}

// ----------------------------------------------------------------------------
// Media library
// ----------------------------------------------------------------------------

function rowToMedia(row: Record<string, unknown>): MediaAsset {
  return {
    id: String(row.id),
    key: String(row.key),
    url: String(row.url),
    kind: row.kind as MediaAsset['kind'],
    mime_type: String(row.mime_type),
    size_bytes: Number(row.size_bytes),
    original_name: String(row.original_name),
    created_at: iso(row.created_at),
  };
}

export async function listMedia(): Promise<MediaAsset[]> {
  const sql = getSql();
  if (sql) {
    const rows = await sql`SELECT * FROM media_assets ORDER BY created_at DESC LIMIT 500`;
    return rows.map(rowToMedia);
  }
  return readLocalDb().media || [];
}

export async function addMedia(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
  const record: MediaAsset = {
    ...asset,
    id: `med-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  const sql = getSql();
  if (sql) {
    const rows = await sql`
      INSERT INTO media_assets (id, key, url, kind, mime_type, size_bytes, original_name, created_at)
      VALUES (${record.id}, ${record.key}, ${record.url}, ${record.kind}, ${record.mime_type},
        ${record.size_bytes}, ${record.original_name}, ${record.created_at})
      ON CONFLICT (key) DO UPDATE SET url = EXCLUDED.url
      RETURNING *
    `;
    return rowToMedia(rows[0]);
  }
  const db = readLocalDb();
  db.media = [record, ...(db.media || [])];
  writeLocalDb(db);
  return record;
}

export async function removeMedia(id: string): Promise<MediaAsset | null> {
  const sql = getSql();
  if (sql) {
    const rows = await sql`DELETE FROM media_assets WHERE id = ${id} RETURNING *`;
    return rows.length ? rowToMedia(rows[0]) : null;
  }
  const db = readLocalDb();
  const found = db.media?.find((m) => m.id === id) || null;
  db.media = (db.media || []).filter((m) => m.id !== id);
  writeLocalDb(db);
  return found;
}
