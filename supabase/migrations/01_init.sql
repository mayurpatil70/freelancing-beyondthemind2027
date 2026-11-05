-- ==============================================================================
-- BEYOND THE MIND 2027: THE DIVINE RETREAT
-- Complete PostgreSQL Database Schema & Row Level Security Policies
-- ==============================================================================

-- 1. Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id TEXT PRIMARY KEY, -- e.g. 'BTM27-1042'
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country_code TEXT NOT NULL,
  phone TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  programme TEXT NOT NULL DEFAULT '4-Day Divine Retreat Rishikesh',
  language_preference TEXT NOT NULL DEFAULT 'English',
  dietary_requirements TEXT,
  message TEXT,
  privacy_consent BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Awaiting Payment', 'Payment Verification', 'Confirmed', 'Waitlisted', 'Cancelled')),
  payment_proof_url TEXT,
  payment_status TEXT NOT NULL DEFAULT 'None' CHECK (payment_status IN ('None', 'Pending Verification', 'Verified', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Payment Proofs (Protected references)
CREATE TABLE IF NOT EXISTS payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id TEXT REFERENCES registrations(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  verified_by TEXT,
  verified_at TIMESTAMPTZ
);

-- 3. Admin Notes (Private participant notes)
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id TEXT REFERENCES registrations(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Sacred Experiences (CMS content)
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  image TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  spiritual_dimension TEXT NOT NULL,
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Retreat Programme
CREATE TABLE IF NOT EXISTS retreat_programme (
  id INT PRIMARY KEY,
  date DATE NOT NULL,
  formatted_date TEXT NOT NULL,
  day_name TEXT NOT NULL,
  theme TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  summary TEXT NOT NULL,
  sessions JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  edition TEXT NOT NULL,
  highlight_quote TEXT NOT NULL,
  full_testimonial TEXT NOT NULL,
  poster_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Gallery Images
CREATE TABLE IF NOT EXISTS gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  location TEXT,
  display_order INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 1,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Site Settings (Single row config)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Admin Activity Logs
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE retreat_programme ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- Public can insert registrations
CREATE POLICY "Public registrations insert" ON registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can view and update registrations
CREATE POLICY "Admin full access registrations" ON registrations
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public can read content tables
CREATE POLICY "Public read experiences" ON experiences FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read programme" ON retreat_programme FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read gallery" ON gallery_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read settings" ON site_settings FOR SELECT TO anon, authenticated USING (true);

-- Admins can modify content
CREATE POLICY "Admin update experiences" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin update programme" ON retreat_programme FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin update testimonials" ON testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin update gallery" ON gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin update faqs" ON faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin update settings" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access notes" ON admin_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full access logs" ON admin_activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

