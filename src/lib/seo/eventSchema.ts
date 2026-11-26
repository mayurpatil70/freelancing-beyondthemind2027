import type { FAQItem, ParticipationTier, SiteSettings } from '@/types';
import { parseKeywords } from '@/lib/seo/keywords';

// Schema.org Event markup for the retreat and the daily meditation.
// Google reports an Offer without a numeric `price` as 'Missing field "price" (in "offers")'. `offers` itself is
// optional for Events, so an Offer is only emitted when a real price exists: the retreat's from the admin
// "Participation" tab (one Offer per priced tier), the daily meditation's from the admin "Daily meditation fee".
// Until the client sets prices there, the events carry no `offers` at all. Never invent a price here.

const IST = '+05:30';
// Ticket sales / enquiries opened before the site launched; Google only needs a date in the past.
const OFFERS_VALID_FROM = `2026-11-01T00:00:00${IST}`;

// "₹45,000", "45000", "INR 45,000 per person" -> 45000. Anything without a number -> undefined.
export function parsePrice(raw: string | undefined | null): number | undefined {
  const match = (raw || '').replace(/,/g, '').match(/\d+(\.\d+)?/);
  if (!match) return undefined;
  const value = Number(match[0]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export function formatInr(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

function offer(
  siteUrl: string,
  path: string,
  extra: { name?: string; category?: string; price: number }
): Record<string, unknown> {
  return {
    '@type': 'Offer',
    ...(extra.name ? { name: extra.name } : {}),
    ...(extra.category ? { category: extra.category } : {}),
    url: `${siteUrl}${path}`,
    availability: 'https://schema.org/InStock',
    price: extra.price,
    priceCurrency: 'INR',
    validFrom: OFFERS_VALID_FROM,
  };
}

// One Offer per Participation tier that has a numeric price. Tiers without one are left out (never sent priceless).
export function retreatOffers(siteUrl: string, tiers: ParticipationTier[]): Record<string, unknown>[] {
  return tiers.flatMap((t) => {
    const price = parsePrice(t.price);
    if (!t.title?.trim() || price === undefined) return [];
    return [
      offer(siteUrl, `/register?programme=${encodeURIComponent(t.title)}`, {
        name: t.title,
        category: t.subtitle || undefined,
        price,
      }),
    ];
  });
}

export function retreatEvent(siteUrl: string, tiers: ParticipationTier[]): Record<string, unknown> {
  const offers = retreatOffers(siteUrl, tiers);
  const organizer = { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Beyond the Mind', url: siteUrl };
  return {
    '@type': 'Event',
    '@id': `${siteUrl}/#retreat2027`,
    name: 'Beyond the Mind 2027 — The Divine Retreat',
    description:
      'Flagship 4-day spiritual immersion in Rishikesh guided by Pradeep Muthukulam. Arrival: October 5, 2027. Sessions: October 6–9, 2027. Available offline in Rishikesh and online via live stream. Features 7 sacred sessions.',
    url: `${siteUrl}/participation`,
    startDate: `2027-10-05T14:45:00${IST}`,
    endDate: `2027-10-09T18:00:00${IST}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    // Mixed (offline + online) events need both a Place and a VirtualLocation.
    location: [
      {
        '@type': 'Place',
        name: 'Rishikesh Sanctuary beside holy Ganga',
        geo: { '@type': 'GeoCoordinates', latitude: 30.0869, longitude: 78.2676 },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Rishikesh',
          addressRegion: 'Uttarakhand',
          postalCode: '249201',
          addressCountry: 'IN',
        },
      },
      { '@type': 'VirtualLocation', url: `${siteUrl}/register` },
    ],
    image: [`${siteUrl}/images/brand/og-cover.jpg`, `${siteUrl}/images/brand/logo.jpg`],
    organizer,
    performer: {
      '@type': 'Person',
      name: 'Pradeep Muthukulam',
      jobTitle: 'Lead Spiritual Guide',
      image: `${siteUrl}/images/brand/pradeep-muthukulam.jpg`,
    },
    inLanguage: ['en', 'ml'],
    ...(offers.length ? { offers } : {}),
  };
}

// "7:30 PM IST" -> [19, 30], "19:30" -> [19, 30]. Falls back to 7:30 PM.
export function parseTime(raw: string | undefined): [number, number] {
  const m = (raw || '').match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i);
  if (!m) return [19, 30];
  let hour = Number(m[1]);
  const minute = Number(m[2] || 0);
  const meridiem = m[3]?.toLowerCase();
  if (meridiem === 'pm' && hour < 12) hour += 12;
  if (meridiem === 'am' && hour === 12) hour = 0;
  if (hour > 23 || minute > 59) return [19, 30];
  return [hour, minute];
}

const pad = (n: number) => String(n).padStart(2, '0');

// Next Monday–Friday session in India time (today's if it has not started yet), as ISO strings.
export function nextWeekdaySession(now: Date, hour: number, minute: number, minutes = 60): { start: string; end: string } {
  const istOffsetMs = 330 * 60 * 1000;
  const ist = new Date(now.getTime() + istOffsetMs); // read with getUTC* to get India wall-clock values
  const day = new Date(Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate(), hour, minute));
  if (day.getTime() <= ist.getTime()) day.setUTCDate(day.getUTCDate() + 1);
  while (day.getUTCDay() === 0 || day.getUTCDay() === 6) day.setUTCDate(day.getUTCDate() + 1);
  const end = new Date(day.getTime() + minutes * 60 * 1000);
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:00${IST}`;
  return { start: fmt(day), end: fmt(end) };
}

export function dailyMeditationEvent(siteUrl: string, settings: SiteSettings, now = new Date()): Record<string, unknown> {
  const [hour, minute] = parseTime(settings.daily_meditation_time);
  const { start, end } = nextWeekdaySession(now, hour, minute);
  const fee = parsePrice(settings.daily_meditation_fee);
  return {
    '@type': 'EducationalEvent',
    '@id': `${siteUrl}/#dailymeditation`,
    name: 'Daily Guided Meditation — A Journey Within',
    description:
      'Ongoing weekday guided meditation sessions by Beyond the Mind. Online via Zoom from Monday to Friday at 7:30 PM IST. Paid sessions focusing on cultivating awareness, exploring inner silence, and transcending mental chatter.',
    url: `${siteUrl}/daily-meditation`,
    startDate: start,
    endDate: end,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventSchedule: {
      '@type': 'Schedule',
      repeatFrequency: 'P1W',
      byDay: [
        'https://schema.org/Monday',
        'https://schema.org/Tuesday',
        'https://schema.org/Wednesday',
        'https://schema.org/Thursday',
        'https://schema.org/Friday',
      ],
      startTime: `${pad(hour)}:${pad(minute)}:00`,
      scheduleTimezone: 'Asia/Kolkata',
    },
    location: { '@type': 'VirtualLocation', url: `${siteUrl}/daily-meditation` },
    image: [`${siteUrl}/images/brand/og-cover.jpg`],
    organizer: { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: 'Beyond the Mind', url: siteUrl },
    performer: { '@type': 'Person', name: 'Pradeep Muthukulam' },
    ...(fee !== undefined
      ? { offers: offer(siteUrl, '/daily-meditation', { name: 'Daily Guided Meditation', price: fee }) }
      : {}),
  };
}

// FAQPage for /faq built from the admin FAQs. Each question carries its own keywords (never rendered on the page).
export function faqPageSchema(siteUrl: string, faqs: FAQItem[], pageKeywords: string[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/faq#faqpage`,
    url: `${siteUrl}/faq`,
    ...(pageKeywords.length ? { keywords: pageKeywords.join(', ') } : {}),
    mainEntity: faqs
      .filter((f) => f.question?.trim() && f.answer?.trim())
      .map((f) => {
        const kw = parseKeywords(f.keywords);
        return {
          '@type': 'Question',
          name: f.question,
          ...(kw.length ? { keywords: kw.join(', ') } : {}),
          acceptedAnswer: { '@type': 'Answer', text: f.answer },
        };
      }),
  };
}
