CREATE TABLE IF NOT EXISTS cms_content (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  programme TEXT NOT NULL,
  language_preference TEXT NOT NULL DEFAULT 'English',
  dietary_requirements TEXT,
  message TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'New',
  payment_proof_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'None',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS registrations_created_at_idx ON registrations (created_at DESC);

CREATE TABLE IF NOT EXISTS admin_notes (
  id TEXT PRIMARY KEY,
  registration_id TEXT NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin Concierge',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS admin_notes_registration_idx ON admin_notes (registration_id);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('image', 'video')),
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  original_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS media_assets_created_at_idx ON media_assets (created_at DESC);

CREATE TABLE IF NOT EXISTS cms_patches (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
