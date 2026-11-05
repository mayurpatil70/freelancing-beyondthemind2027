import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { WhatsAppFloat } from '@/components/layout/WhatsAppFloat';

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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Beyond the Mind 2027 — The Divine Retreat',
    startDate: '2027-10-06T09:00:00+05:30',
    endDate: '2027-10-09T18:00:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Rishikesh Sanctuary',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Rishikesh',
        addressRegion: 'Uttarakhand',
        addressCountry: 'India',
      },
    },
    image: ['/images/brand/logo.jpg', '/images/posters/btm2027-invitation.jpg'],
    description:
      'A transformative 4-day retreat in the sacred land of Rishikesh to reconnect with your True Self, release inner blocks and awaken the vastness within.',
    organizer: {
      '@type': 'Organization',
      name: 'Beyond the Mind & Moola Brahman',
      url: 'https://beyondthemindretreat.org',
      telephone: '+918075572018',
      email: 'moolabrahman@gmail.com',
    },
  };

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#031713] text-[#FAF8F5] antialiased selection:bg-[#D4AF37] selection:text-[#031713]">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}

