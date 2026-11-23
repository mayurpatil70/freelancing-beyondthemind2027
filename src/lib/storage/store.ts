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
  initialHealingSessions,
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
  healingSessions: SacredExperience[];
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
  'healingSessions',
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
  healingSessions: initialHealingSessions,
  programme: initialProgramme,
  testimonials: initialTestimonials,
  gallery: initialGallery,
  faqs: initialFAQs,
  attractions: initialAttractions,
  weatherClothing: initialWeatherClothing,
};

// Content model:
//   - Neon (cms_content) is the single source of truth whenever DATABASE_URL is set.
//   - src/data/db.json is only a seed: `npm run db:setup` copies it into Neon for keys that are missing,
//     and it fills in a key that Neon does not have yet. It never overrides a row that exists in Neon.
//   - Without DATABASE_URL (local dev), the JSON file itself is read and written.
type LocalDb = Partial<ContentMap> & { registrations?: Registration[]; media?: MediaAsset[] };

const seed = contentSnapshot as unknown as Partial<ContentMap>;

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

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => {
      console.warn(`Neon call took over ${ms}ms, serving local content`);
      resolve(fallback);
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// One-time edits to content that already lives in Neon. Neon wins over db.json, so changing db.json alone
// never reaches the live site. Each patch is merged into its key once, then recorded in cms_patches so a
// later admin edit of the same field is never overwritten. Add new patches to the end; never edit old ones.
// `merge` shallow-merges into an object key; `replace` overwrites the whole key once.
// `fillItems` sets fields on items of an array key (matched by slug) only where the field is still empty,
// so it never overwrites something an admin already set.
type ContentPatch =
  | { id: string; key: ContentKey; merge: Record<string, unknown> }
  | { id: string; key: ContentKey; replace: unknown }
  | { id: string; key: ContentKey; fillItems: Array<{ slug: string; set: Record<string, unknown> }> };

const CONTENT_PATCHES: ContentPatch[] = [
  {
    id: '2026-11-22-contact-and-social-links',
    key: 'settings',
    merge: {
      secondary_phone: '+91 9349472018',
      secondary_email: 'pradeepmuthukulam@gmail.com',
      twitter_url: 'https://x.com/beyondthemind27?s=11',
      youtube_url: 'https://www.youtube.com/@bodymindintellect',
    },
  },
  // Until this change, programme, FAQs and testimonials were always rendered from db.json and Neon's copies
  // were overwritten from it on every read, so admins could not have edited them. Now that Neon wins, copy
  // the current db.json version over once so the switch shows exactly what the site showed before.
  { id: '2026-11-22-neon-takes-over-programme-v2', key: 'programme', replace: seed.programme },
  { id: '2026-11-22-neon-takes-over-faqs-v2', key: 'faqs', replace: seed.faqs },
  { id: '2026-11-22-neon-takes-over-testimonials-v2', key: 'testimonials', replace: seed.testimonials },
  {
    id: '2026-11-23-healing-session-photos',
    key: 'healingSessions',
    fillItems: [
      { slug: 'relationship-transformation', set: { image: '/images/healing/relationship-transformation.jpg', image_position: 'center' } },
      { slug: 'emotional-liberation', set: { image: '/images/healing/emotional-liberation.jpg', image_position: '80% center' } },
    ],
  },
];

type Sql = NonNullable<ReturnType<typeof getSql>>;
let patchesApplied: Promise<void> | null = null;

function applyContentPatches(sql: Sql): Promise<void> {
  // Preview deployments can share the production database. Only production (or local dev) applies patches,
  // so a preview build cannot claim a patch while the old production code is still live.
  if (process.env.VERCEL_ENV === 'preview') return Promise.resolve();
  if (!patchesApplied) {
    patchesApplied = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS cms_patches (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())`;
      for (const patch of CONTENT_PATCHES) {
        if ('fillItems' in patch) {
          const rows = await sql`SELECT data FROM cms_content WHERE key = ${patch.key}`;
          const current = rows[0]?.data;
          if (!Array.isArray(current)) {
            // Neon has no copy yet, so the db.json seed (which already has these values) is served. Nothing to do.
            await sql`INSERT INTO cms_patches (id) VALUES (${patch.id}) ON CONFLICT (id) DO NOTHING`;
            continue;
          }
          const filled = current.map((item: Record<string, unknown>) => {
            const fill = patch.fillItems.find((f) => f.slug === item?.slug);
            if (!fill) return item;
            const next = { ...item };
            for (const [field, value] of Object.entries(fill.set)) if (!next[field]) next[field] = value;
            return next;
          });
          await sql`
            WITH claimed AS (
              INSERT INTO cms_patches (id) VALUES (${patch.id}) ON CONFLICT (id) DO NOTHING RETURNING id
            )
            UPDATE cms_content SET data = ${JSON.stringify(filled)}::jsonb, updated_at = now()
            WHERE key = ${patch.key} AND EXISTS (SELECT 1 FROM claimed)
          `;
          continue;
        }
        // One statement, so the patch is recorded only if the update runs too.
        if ('replace' in patch) {
          if (patch.replace === undefined) continue;
          await sql`
            WITH claimed AS (
              INSERT INTO cms_patches (id) VALUES (${patch.id}) ON CONFLICT (id) DO NOTHING RETURNING id
            )
            UPDATE cms_content SET data = ${JSON.stringify(patch.replace)}::jsonb, updated_at = now()
            WHERE key = ${patch.key} AND EXISTS (SELECT 1 FROM claimed)
          `;
          continue;
        }
        await sql`
          WITH claimed AS (
            INSERT INTO cms_patches (id) VALUES (${patch.id}) ON CONFLICT (id) DO NOTHING RETURNING id
          )
          UPDATE cms_content SET data = data || ${JSON.stringify(patch.merge)}::jsonb, updated_at = now()
          WHERE key = ${patch.key} AND jsonb_typeof(data) = 'object' AND EXISTS (SELECT 1 FROM claimed)
        `;
      }
    })().catch((e) => {
      patchesApplied = null; // retry on the next request
      console.error('Applying CMS content patches failed:', e);
    });
  }
  return patchesApplied;
}

const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

function rejectAfter<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Neon query timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// No cross-request memory cache: on Vercel each instance would keep serving its own stale copy after an
// admin save, and revalidated pages could be rebuilt from it. React cache() dedupes within one render.
const loadContent = cache(async (): Promise<Partial<ContentMap>> => {
  const sql = getSql();
  if (!sql) return readLocalDb();
  try {
    await withTimeout(applyContentPatches(sql), 8000, undefined);
    const rows = await rejectAfter(sql`SELECT key, data FROM cms_content`, 8000);
    return Object.fromEntries(rows.map((r) => [r.key, r.data])) as Partial<ContentMap>;
  } catch (e) {
    // During `next build` fall back to the seed so a database hiccup does not fail the deploy.
    // At runtime rethrow, so ISR keeps serving the last good page instead of caching seed content
    // over the admin's edits.
    if (isBuildPhase()) {
      console.error('Neon loadContent failed during build, rendering from db.json seed:', e);
      return {};
    }
    throw e;
  }
});

async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const stored = (await loadContent())[key];
  if (key === 'settings') {
    // Shallow merge so settings fields added in code later still have a value.
    return {
      ...defaults.settings,
      ...((seed.settings as SiteSettings) || {}),
      ...((stored as SiteSettings) || {}),
    } as ContentMap[K];
  }
  return (stored ?? seed[key] ?? defaults[key]) as ContentMap[K];
}

export async function setContent<K extends ContentKey>(key: K, data: ContentMap[K]): Promise<ContentMap[K]> {
  const sql = getSql();
  if (sql) {
    await sql`
      INSERT INTO cms_content (key, data, updated_at)
      VALUES (${key}, ${JSON.stringify(data)}::jsonb, now())
      ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now()
    `;
    return data;
  }
  const db = readLocalDb();
  db[key] = data;
  writeLocalDb(db);
  return data;
}

export const getSiteSettings = () => getContent('settings');
export const getExperiences = () => getContent('experiences');
export const getHealingSessions = () => getContent('healingSessions');
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
export const updateHealingSessionsData = (data: SacredExperience[]) => setContent('healingSessions', data);
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
