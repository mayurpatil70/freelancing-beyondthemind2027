import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';
import { SiteFlight } from '@/components/layout/SiteFlight';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#031713',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://beyondthemindretreat.org'),
  title: {
    default: 'Beyond the Mind 2027 — The Divine Retreat | Rishikesh, Uttarakhand',
    template: '%s | Beyond the Mind 2027',
  },
  description:
    'A transformative 4-day spiritual retreat into the Infinite within. Guided by Pradeep Sir in sacred Rishikesh, Uttarakhand from October 6–9, 2027. Featuring Kundalini Awakening, Energy Field Activation, Soul Liberation & Shiva Mandala.',
  keywords: [
    'Beyond the Mind 2027',
    'The Divine Retreat',
    'Rishikesh Spiritual Retreat',
    'Kundalini Awakening Retreat India',
    'Meditation Retreat Rishikesh',
    'Pradeep Sir Meditation',
    'Moola Brahman Retreat',
    'Ganges Meditation Retreat',
    'Soul Liberation Shiva Mandala',
  ],
  authors: [{ name: 'Beyond the Mind' }],
  creator: 'Beyond the Mind',
  publisher: 'Beyond the Mind',
  alternates: {
    canonical: 'https://beyondthemindretreat.org',
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
    title: 'Beyond the Mind 2027 — The Divine Retreat',
    description: 'A transformative 4-day sanctuary in the sacred land of Rishikesh. October 6–9, 2027.',
    url: 'https://beyondthemindretreat.org',
    siteName: 'Beyond the Mind',
    images: [
      {
        url: '/images/brand/logo.jpg',
        width: 1200,
        height: 1200,
        alt: 'Beyond the Mind 2027 — The Divine Retreat Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beyond the Mind 2027 — The Divine Retreat',
    description: 'A journey into the Infinite within. Rishikesh, October 6–9, 2027.',
    images: ['/images/brand/logo.jpg'],
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
        '@id': 'https://beyondthemindretreat.org/#website',
        url: 'https://beyondthemindretreat.org',
        name: 'Beyond the Mind',
        description: 'The Divine Retreat & Daily Guided Meditation — A Journey Into the Infinite Within.',
        publisher: {
          '@id': 'https://beyondthemindretreat.org/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://beyondthemindretreat.org/#organization',
        name: 'Beyond the Mind',
        url: 'https://beyondthemindretreat.org',
        logo: 'https://beyondthemindretreat.org/images/brand/logo.jpg',
        telephone: '+918075572018',
        email: 'moolabrahman@gmail.com',
        sameAs: [
          'https://www.instagram.com/thedivineretreat?exln=Y3RrM2FxcngxOWtm',
          'https://www.facebook.com/profile.php?id=61595374757132',
        ],
      },
      {
        '@type': 'Event',
        '@id': 'https://beyondthemindretreat.org/#retreat2027',
        name: 'Beyond the Mind 2027 — The Divine Retreat',
        description:
          'Flagship 4-day spiritual immersion in Rishikesh guided by Pradeep Sir. Arrival: October 5, 2027 at 2:45 PM. Sessions: October 6–9, 2027. Available offline in Rishikesh and online via live stream. Features 7 sacred sessions.',
        startDate: '2027-10-05T14:45:00+05:30',
        endDate: '2027-10-09T18:00:00+05:30',
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
        location: {
          '@type': 'Place',
          name: 'Rishikesh Sanctuary beside holy Ganga',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Rishikesh',
            addressRegion: 'Uttarakhand',
            addressCountry: 'India',
          },
        },
        image: ['https://beyondthemindretreat.org/images/brand/logo.jpg'],
        organizer: {
          '@id': 'https://beyondthemindretreat.org/#organization',
        },
        performer: {
          '@type': 'Person',
          name: 'Pradeep Sir',
        },
      },
      {
        '@type': 'EducationalEvent',
        '@id': 'https://beyondthemindretreat.org/#dailymeditation',
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
          '@id': 'https://beyondthemindretreat.org/#organization',
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
              text: 'Participants arrive on October 5, 2027 at 2:45 PM. The 4-day retreat sessions run from October 6 to October 9, 2027 in Rishikesh, Uttarakhand, India.',
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
              text: 'The retreat sessions are conducted in English, with Hindi translation available for participants who require it.',
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
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-[#031713] text-[#FAF8F5] antialiased selection:bg-[#D4AF37] selection:text-[#031713]">
        {children}
        <SiteFlight />
        <WhatsAppFloat />
      </body>
    </html>
  );
}

