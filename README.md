# BEYOND THE MIND 2027 — THE DIVINE RETREAT
### Premium Next.js Website & Administration CMS

> **"A journey into the Infinite within."**  
> **October 6–9, 2027 • Rishikesh, Uttarakhand, India**  
> Guided by **Pradeep Muthukulam** under the spiritual canopy of **Moola Brahman**.

---

## 1. Executive Overview

**Beyond the Mind 2027** is an immersive digital sanctuary designed to communicate spirituality, inner discovery, Himalayan serenity, exclusivity, personal guidance, and premium hospitality.

The visual language marries:
- **Deep Emerald Green** backgrounds (`#031713`, `#07261F`, `#0B3830`)
- **Antique Gold** borders, typography accents & radiant gradients (`#D4AF37`, `#F5E5A4`, `#C5A059`)
- **Warm Ivory** editorial magazine sections (`#FAF8F5`, `#F2EDE4`)
- **Frosted glass** macOS-inspired surfaces with restrained gold border glow
- **Authentic official client brand assets** (untouched official logo and archival retreat posters)
- **Cinematic Himalayan & Ganges photography**

---

## 2. Complete 15 Routes Architecture

Every route is fully implemented, responsive, and SEO-optimized:

| Route | Name | Purpose & Features |
|---|---|---|
| `/` | **Grand Sanctuary (Home)** | Full-screen cinematic hero with `HeroVideoPlayer`, editorial introduction, Eight Sacred Experiences, 4-day timetable preview, Rishikesh destination showcase, daily online meditation, seeker testimonials, archival poster gallery, registration CTA, and footer. |
| `/about` | **About the Retreat** | Editorial magazine layout covering the philosophy of Beyond the Mind, meaning of transcending mental narratives, guidance by Pradeep Muthukulam, and community reflections. |
| `/experiences` | **Eight Sacred Experiences** | Stress Buster Session, Soul Retrieval, Kundalini Awakening, Soul Liberation, Merkaba Activation, Inner Child Healing, Guided Meditation, and Money, Entities & Consciousness with anchors, highlights, and guidance ethics. |
| `/daily-meditation` | **Daily Guided Meditation** | Dedicated page for Monday–Friday 7:30 PM IST paid online Zoom sessions with purpose, session flow, WhatsApp inquiry, and registration. |
| `/programme` | **Four-Day Divine Programme** | Wednesday Oct 6 to Saturday Oct 9, 2027 expandable day timeline with language support (English with Hindi translation assistance). |
| `/rishikesh` | **Rishikesh Destination** | High-resolution storytelling of Mother Ganga, Garhwal Himalayan foothills, evening aarti, and venue sanctity notice. |
| `/reach` | **How to Reach** | Detailed travel guide: Air (Jolly Grant Dehradun DED, 21km), Train (Yog Nagari Rishikesh YNRK & Haridwar HW), and Road (Delhi-Meerut-Rishikesh expressway), with WhatsApp concierge. |
| `/participation` | **Participation & Inclusions** | Configurable options: Single Sanctuary Room, Shared Twin Room, Non-Residential Seeker, Sattvic dining, retreat journals, and inquiry-only transparent booking notes. |
| `/testimonials` | **Guest Testimonials** | Authentic reflections from BTM 2026 participants on Maha Theerthas, Shiva Lingams, and the Shiva Mandala, plus full-size poster lightboxes. |
| `/gallery` | **Visual Sanctuary Gallery** | Admin-managed (Gallery tab), 7-category filtering (Retreat Experience, Participants, Meditation, Kundalini, Nature & Mountains, Rishikesh, Sacred Moments) with full-screen keyboard-accessible lightbox. |
| `/faq` | **Frequently Asked Questions** | Searchable iOS-style accordion with category tabs and direct WhatsApp routing for custom inquiries. |
| `/register` | **Enquiry & Registration** | Frictionless booking (no account/password required), Zod client/server validation, unique reference ID generator (e.g. `BTM27-xxxx`), confirmation card, WhatsApp fast-track, and optional payment receipt upload. |
| `/contact` | **Contact & Concierge** | Official WhatsApp/Phone (`+91 8075572018`), Email (`moolabrahman@gmail.com`), Instagram, Facebook, one-click pre-filled inquiry shortcuts, and contact message form. |
| `/privacy-policy` | **Privacy Policy** | Comprehensive data discretion policy covering registration encryption, payment receipt protection, no commercial advertising, and data erasure rights. |
| `/admin` | **Administration CMS** | Protected portal with secure session authorization, metrics overview, participant CRM table, status management, private admin notes, receipt inspection modal, CSV export, and live content editor. |

---

## 3. Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) App Router (`src/app`)
- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS with custom design tokens for Deep Emerald, Antique Gold, and Warm Ivory
- **Typography**: `Cormorant Garamond` (editorial display serif) & `Inter` (refined modern sans-serif) via `next/font/google`
- **Icons**: Lucide React
- **Validation**: Zod schema validation on client and server
- **Forms**: React Hook Form with `@hookform/resolvers/zod`
- **Database & Storage**: Dual-layer architecture:
  - **Neon Postgres** (`@neondatabase/serverless`) for CMS content, registrations and admin notes
  - **Neon Object Storage** (S3-compatible) for CMS images (`btm-media`, public read) and payment receipts (`btm-private`)
  - Local JSON persistence (`src/data/db.json`) and `public/uploads` when the Neon variables are not set
- **SEO & Social**: Dynamic Metadata, Open Graph, Twitter Cards, `robots.ts`, `sitemap.ts`, and Schema.org `Event` JSON-LD structured data.

---

## 4. Environment Variables

Create `.env.local` in the project root:

```env
# Admin CMS access (all required, there are no built-in defaults).
# ADMIN_EMAIL is optional and lets the admin also sign in with an email address.
ADMIN_USERNAME=""
ADMIN_PASSWORD=""
ADMIN_EMAIL=""

# Signs the admin session cookie. Required. Use a long random value:
#   openssl rand -hex 32
ADMIN_SESSION_SECRET=""

# Neon Postgres (pooled connection string)
DATABASE_URL=""

# Neon Object Storage (branch endpoint + storage:read/write credential)
NEON_STORAGE_ENDPOINT=""
NEON_STORAGE_REGION="ap-southeast-1"
NEON_STORAGE_ACCESS_KEY_ID=""
NEON_STORAGE_SECRET_ACCESS_KEY=""
NEON_MEDIA_BUCKET="btm-media"
NEON_PRIVATE_BUCKET="btm-private"

# Public Domain
NEXT_PUBLIC_SITE_URL="https://beyondthemindretreat.org"
```

> **Important**: Ensure passwords containing `#` or special characters are wrapped in double quotes in `.env` files to prevent dotenv from interpreting `#` as a comment delimiter.

---

## 5. Development & Production Run

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
# Starts dev server on http://localhost:3000
```

### Production Build & Launch
```bash
npm run build
npm run start
# Or on custom port:
# npx next start -p 3001
```

---

## 6. Admin Portal & Participant CRM

- **URL**: Navigate to `/admin`
- **Credentials**: the values of `ADMIN_USERNAME` (or `ADMIN_EMAIL`) and `ADMIN_PASSWORD`. There are no default credentials. If `ADMIN_USERNAME`/`ADMIN_EMAIL`, `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` is missing, the login endpoint returns HTTP 503 and names the missing variables.
- **Changing the username or password**: admin tab "Username & Password". Both changes need the current password.
  - Password: new password at least 8 characters, stored as a scrypt hash in Neon (`admin_credentials`); it replaces `ADMIN_PASSWORD` from then on.
  - Username: 3 to 100 characters (letters, numbers, `. _ @ + -`), not case sensitive at login. It is stored in Neon (`admin_credentials.username`) and replaces both `ADMIN_USERNAME` and `ADMIN_EMAIL` for login, so the old username stops working.
  - Forgotten login: run `DELETE FROM admin_credentials;` in the Neon SQL editor and the environment values (`ADMIN_USERNAME`/`ADMIN_EMAIL`, `ADMIN_PASSWORD`) work again. To reset only the username: `UPDATE admin_credentials SET username = NULL;`.
- **No public link**: the site has no Admin button or link; open `/admin` directly.
- **Login rate limiting**: 5 failed attempts per IP or device within 15 minutes triggers a 15 minute lockout. Counters are stored in Neon (`admin_login_attempts`, `admin_security_events`) so they hold across serverless instances; without `DATABASE_URL` they are kept in memory.

### Key Admin Features:
1. **Metrics Overview**: Live counters for Total Enquiries, New Leads, Payment Verification, Confirmed Guests, and Waitlisted.
2. **Participant CRM**:
   - Filter by status: `New`, `Contacted`, `Awaiting Payment`, `Payment Verification`, `Confirmed`, `Waitlisted`, `Cancelled`
   - Real-time search across participant names, emails, phone numbers, and reference IDs
   - Update participant status inline
   - Inspect uploaded transaction receipts (JPG, PNG, PDF)
   - Add private coordinator notes with timestamps and author tagging
   - **Export to CSV**: One-click download of all participant records
3. **Website CMS Manager**:
   - Live updates to hero title, subtitle, tagline, retreat dates, and location
   - Master video streaming URL and poster configuration
   - WhatsApp number & display settings
   - Daily meditation timings and platform details
   - Toggle optional payment proof uploads
   - Instant live publish without redeployment

---

## 7. How to Upload & Stream the Original Retreat Video

The client provided a master video editing link:
`https://docs.google.com/videos/d/1ITwHC5afOPO5BwxcxFefOUfF1D2tyR6RPovooR_YHb8/edit?usp=sharing`

### Production Video Integration Guidelines:
1. **Obtain the original video file**: Download the full-resolution master `.mp4` / `.mov` from the Google Drive folder.
2. **Preserve master quality**: Do not downscale or excessively recompress the master file.
3. **Host with an Adaptive Streaming Provider**:
   - Upload to **Mux**, **Cloudflare Stream**, or **AWS CloudFront**.
   - These services generate adaptive HLS renditions (`.m3u8`) optimized for mobile, tablet, and high-speed desktop connections.
4. **Connect the Video URL in CMS**:
   - Log into `/admin` → **Website CMS**.
   - Paste the public streaming URL or direct MP4 link into **Master Video Stream URL**.
   - Click **Publish Content Updates**.
5. **Hero Player Performance Features**:
   - When no video URL is provided, `HeroVideoPlayer` automatically displays the high-resolution Himalayan Ganges sanctuary poster with zero layout shifts or black screens.
   - Autoplays muted when scrolled into viewport.
   - User audio toggle button (`Sound On / Sound Off`).
   - Pauses automatically when out of viewport or when browser tab is switched.
   - Respects user's `prefers-reduced-motion` settings.

---

## 8. Database & Media Storage (Neon)

The schema lives in `db/schema.sql` (tables: `cms_content`, `registrations`, `admin_notes`, `media_assets`).

```bash
npm run db:setup
```

This applies the schema, seeds any missing CMS content from `src/data/db.json`, and sets CORS on the media bucket. It is safe to re-run.

**Where site content lives.** When `DATABASE_URL` is set, the `cms_content` table in Neon is the only source of truth for site content (settings, sessions, programme, FAQs, testimonials, gallery, attractions, weather guide). Admin saves write there and revalidate the pages. `src/data/db.json` is only a seed: it fills a key that Neon does not have yet and is never written to in production. Editing `db.json` in git does **not** change the live site once that key exists in Neon; change it in the admin panel instead. Without `DATABASE_URL` (local dev), `db.json` is read and written directly.

Admin uploads go straight from the browser to Neon Object Storage through a short-lived presigned URL, so files never pass through the Vercel function (4.5 MB body limit). Only images are accepted (JPG, PNG, WEBP, GIF, AVIF, up to 15 MB); image fields have no URL input, only upload. Every upload is listed in the admin **Media Library** tab.

---

## 9. Outstanding Client Information Required Before Launch

Before public domain deployment, confirm the following with the retreat team:
1. **Exact Venue Address**: The specific ashram or sanctuary location in Rishikesh to enable precise venue directions.
2. **Final Participation Inclusions & Pricing**: Confirmed single and shared accommodation fees, non-residential pricing, and cancellation policy.
3. **Hour-by-Hour Daily Timetable**: Specific daily start/end times and satsang schedule to publish in the four-day programme.
4. **Video Hosting Account**: Finalizing the CDN streaming endpoint (Mux / Cloudflare) for the master video.

