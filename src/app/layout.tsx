import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter, Cinzel } from 'next/font/google';
import './globals.css';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { SiteFlight } from '@/components/layout/SiteFlight';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CMSProvider } from '@/contexts/CMSContext';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#031713',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const siteUrl = (() => {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('beyondthemindretreat.org')) {
    return envUrl.replace(/\/$/, '');
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://beyondthemind2027.vercel.app';
})();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Beyond the Mind 2027 — The Divine Retreat | Rishikesh, Uttarakhand',
    template: '%s | Beyond the Mind 2027',
  },
  description:
    'A transformative 4-day spiritual retreat into the Infinite within. Guided by Pradeep Muthukulam in sacred Rishikesh, Uttarakhand from October 6–9, 2027 (Arrival: October 5). Featuring Kundalini Awakening, Energy Field Activation, Soul Liberation & Shiva Mandala.',
  keywords: [
    'Beyond the Mind 2027',
    'The Divine Retreat',
    'Pradeep Muthukulam',
    'Pradeep Muthukulam Meditation',
    'Rishikesh Spiritual Retreat',
    'Kundalini Awakening Retreat India',
    'Meditation Retreat Rishikesh',
    'Moola Brahman Retreat',
    'Ganges Meditation Retreat',
    'Soul Liberation Shiva Mandala',
    'Bio Field Dimensional Expansion',
    'Daily Guided Meditation Zoom',
    'Strict vegetarian food during retreat',
  ],
  authors: [{ name: 'Beyond the Mind' }],
  creator: 'Beyond the Mind',
  publisher: 'Beyond the Mind',
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/images/brand/logo.jpg',
    shortcut: '/images/brand/logo.jpg',
    apple: '/images/brand/logo.jpg',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || 'beyond-the-mind-2027',
  },
  openGraph: {
    title: 'Beyond the Mind 2027 — The Divine Retreat | Rishikesh',
    description:
      'A transformative 4-day sanctuary in the sacred land of Rishikesh. October 6–9, 2027 (Arrival: Oct 5). Guided by Pradeep Muthukulam.',
    url: siteUrl,
    siteName: 'Beyond the Mind 2027',
    images: [
      {
        url: `${siteUrl}/images/brand/og-cover.jpg`,
        secureUrl: `${siteUrl}/images/brand/og-cover.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Beyond the Mind 2027 — The Divine Retreat Cover Image',
      },
      {
        url: `${siteUrl}/og-image.jpg`,
        secureUrl: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Beyond the Mind 2027 — The Divine Retreat Banner',
      },
      {
        url: `${siteUrl}/images/brand/logo.jpg`,
        secureUrl: `${siteUrl}/images/brand/logo.jpg`,
        width: 1024,
        height: 1024,
        type: 'image/jpeg',
        alt: 'Beyond the Mind Sacred Emblem',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beyond the Mind 2027 — The Divine Retreat',
    description:
      'A journey into the Infinite within. Rishikesh, October 6–9, 2027. Guided by Pradeep Muthukulam.',
    site: '@beyondthemind27',
    creator: '@beyondthemind27',
    images: [`${siteUrl}/images/brand/og-cover.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Enhanced GEO & AEO Knowledge Graph Schemas for AI Agents (ChatGPT, Perplexity, Gemini, Google Search)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Beyond the Mind',
        description: 'The Divine Retreat & Daily Guided Meditation — A Journey Into the Infinite Within.',
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'Beyond the Mind',
        url: siteUrl,
        logo: `${siteUrl}/images/brand/logo.jpg`,
        telephone: '+918075572018',
        email: 'moolabrahman@gmail.com',
        sameAs: [
          'https://www.instagram.com/thedivineretreat?exln=Y3RrM2FxcngxOWtm',
          'https://www.facebook.com/profile.php?id=61595374757132',
          'https://www.youtube.com/@BeyondTheMindRetreat',
          'https://x.com/beyondthemind27?s=11',
        ],
      },
      {
        '@type': 'Event',
        '@id': `${siteUrl}/#retreat2027`,
        name: 'Beyond the Mind 2027 — The Divine Retreat',
        description:
          'Flagship 4-day spiritual immersion in Rishikesh guided by Pradeep Muthukulam. Arrival: October 5, 2027. Sessions: October 6–9, 2027. Available offline in Rishikesh and online via live stream. Features 7 sacred sessions.',
        startDate: '2027-10-05T00:00:00+05:30',
        endDate: '2027-10-09T18:00:00+05:30',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: 'Rishikesh Sanctuary beside holy Ganga',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: '30.0869',
            longitude: '78.2676',
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Rishikesh',
            addressRegion: 'Uttarakhand',
            addressCountry: 'India',
          },
        },
        image: [`${siteUrl}/images/brand/logo.jpg`],
        organizer: {
          '@id': `${siteUrl}/#organization`,
        },
        performer: {
          '@type': 'Person',
          name: 'Pradeep Muthukulam',
          jobTitle: 'Lead Spiritual Guide',
          image: `${siteUrl}/images/brand/pradeep-muthukulam.jpg`,
        },
      },
      {
        '@type': 'EducationalEvent',
        '@id': `${siteUrl}/#dailymeditation`,
        name: 'Daily Guided Meditation — A Journey Within',
        description:
          'Ongoing weekday guided meditation sessions by Beyond the Mind. Online via Zoom from Monday to Friday at 7:30 PM IST. Paid sessions focusing on cultivating awareness, exploring inner silence, and transcending mental chatter.',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        eventSchedule: {
          '@type': 'Schedule',
          repeatFrequency: 'P1W',
          byDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          startTime: '19:30:00+05:30',
        },
        organizer: {
          '@id': `${siteUrl}/#organization`,
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'When does Beyond the Mind 2027 take place?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Participants arrive on October 5, 2027. The 4-day retreat sessions run from October 6 to October 9, 2027 in Rishikesh, Uttarakhand, India.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I participate online?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! The Divine Retreat 2027 is available both in-person (offline in Rishikesh) and online via live stream.',
            },
          },
          {
            '@type': 'Question',
            name: 'What language will the retreat be conducted in?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'The retreat sessions and daily meditations are conducted in English and Malayalam. Hindi translation is available upon request.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the Daily Guided Meditation sessions?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Daily Guided Meditation is an ongoing regular activity of Beyond the Mind conducted online via Zoom Monday to Friday at 7:30 PM IST.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${cinzel.variable}`}>
      <head>
        <meta name="geo.region" content="IN-UT" />
        <meta name="geo.placename" content="Rishikesh" />
        <meta name="geo.position" content="30.0869;78.2676" />
        <meta name="ICBM" content="30.0869, 78.2676" />
        <link rel="image_src" href={`${siteUrl}/images/brand/og-cover.jpg`} />
        <meta property="og:image" content={`${siteUrl}/images/brand/og-cover.jpg`} />
        <meta property="og:image:secure_url" content={`${siteUrl}/images/brand/og-cover.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Beyond the Mind 2027 — The Divine Retreat | Rishikesh, Uttarakhand" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`${siteUrl}/images/brand/og-cover.jpg`} />
        <meta name="twitter:image:alt" content="Beyond the Mind 2027 — The Divine Retreat" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#031713] text-[#FAF8F5] antialiased selection:bg-[#D4AF37] selection:text-[#031713]">
        <CMSProvider>
          <LanguageProvider>
            {children}
            <SiteFlight />
            <WhatsAppFloat />
          </LanguageProvider>
        </CMSProvider>
      </body>
    </html>
  );
}

