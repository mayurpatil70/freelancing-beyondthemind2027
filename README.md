# BEYOND THE MIND 2027 — THE DIVINE RETREAT
### Premium Next.js Website & Administration CMS

> **"A journey into the Infinite within."**  
> **October 6–9, 2027 • Rishikesh, Uttarakhand, India**  
> Guided by **Pradeep Sir** under the spiritual canopy of **Moola Brahman**.

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
| `/` | **Grand Sanctuary (Home)** | Full-screen cinematic hero with `HeroVideoPlayer`, editorial introduction, Six Sacred Experiences, 4-day timetable preview, Rishikesh destination showcase, daily online meditation, seeker testimonials, archival poster gallery, registration CTA, and footer. |
| `/about` | **About the Retreat** | Editorial magazine layout covering the philosophy of Beyond the Mind, meaning of transcending mental narratives, guidance by Pradeep Sir, and community reflections. |
| `/experiences` | **Six Sacred Experiences** | Deep Relaxation, Kundalini Awakening, Activate Your Energy Field, Soul Liberation, Inner Child Healing, and Soul Retrieval with anchors, highlights, and guidance ethics. |
| `/daily-meditation` | **Daily Guided Meditation** | Dedicated page for Monday–Friday 7:30 PM IST paid online Zoom sessions with purpose, session flow, WhatsApp inquiry, and registration. |
| `/programme` | **Four-Day Divine Programme** | Wednesday Oct 6 to Saturday Oct 9, 2027 expandable day timeline with language support (English with Hindi translation assistance). |
| `/rishikesh` | **Rishikesh Destination** | High-resolution storytelling of Mother Ganga, Garhwal Himalayan foothills, evening aarti, and venue sanctity notice. |
| `/reach` | **How to Reach** | Detailed travel guide: Air (Jolly Grant Dehradun DED, 21km), Train (Yog Nagari Rishikesh YNRK & Haridwar HW), and Road (Delhi-Meerut-Rishikesh expressway), with WhatsApp concierge. |
| `/participation` | **Participation & Inclusions** | Configurable options: Single Sanctuary Room, Shared Twin Room, Non-Residential Seeker, Sattvic dining, retreat journals, and inquiry-only transparent booking notes. |
| `/testimonials` | **Guest Testimonials** | Authentic reflections from BTM 2026, featuring Arjun Pradeep (Bangalore) on Maha Theerthas, Shiva Lingams, and the Shiva Mandala, plus full-size poster lightboxes. |
| `/gallery` | **Visual Sanctuary Gallery** | 7-category filtering (Retreat Experience, Participants, Meditation, Kundalini, Nature & Mountains, Rishikesh, Sacred Moments) with full-screen keyboard-accessible lightbox. |
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
  - Direct integration with **Supabase PostgreSQL & Storage** via environment variables
  - Local resilient JSON persistence (`src/data/db.json`) for zero-config offline or development execution
- **SEO & Social**: Dynamic Metadata, Open Graph, Twitter Cards, `robots.ts`, `sitemap.ts`, and Schema.org `Event` JSON-LD structured data.

---

## 4. Environment Variables

Create `.env.local` in the project root:

```env
# Admin CMS Access Credentials
ADMIN_PASSWORD="MoolaRetreat@2027#Rishikesh"
ADMIN_EMAIL="admin@beyondthemindretreat.org"

# Supabase (Optional - Local resilient JSON fallback is enabled)
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

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
- **Default Email**: `admin@beyondthemindretreat.org`
- **Default Secret Key**: `MoolaRetreat@2027#Rishikesh`

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

## 8. Database Migrations (Supabase PostgreSQL)

The complete SQL schema and Row Level Security (RLS) policies are provided in:
`supabase/migrations/01_init.sql`

To apply to your Supabase project:
1. Open your Supabase Dashboard → **SQL Editor**.
2. Paste the contents of `supabase/migrations/01_init.sql`.
3. Execute the script to create all 10 tables, indexes, and RLS policies.
4. Copy your Supabase Project URL, Anon Key, and Service Role Key into `.env.local`.

---

## 9. Outstanding Client Information Required Before Launch

Before public domain deployment, confirm the following with the retreat team:
1. **Exact Venue Address**: The specific ashram or sanctuary location in Rishikesh to enable precise venue directions.
2. **Final Participation Inclusions & Pricing**: Confirmed single and shared accommodation fees, non-residential pricing, and cancellation policy.
3. **Hour-by-Hour Daily Timetable**: Specific daily start/end times and satsang schedule to publish in the four-day programme.
4. **Video Hosting Account**: Finalizing the CDN streaming endpoint (Mux / Cloudflare) for the master video.

