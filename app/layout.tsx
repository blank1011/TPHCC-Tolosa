import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display, Montserrat } from 'next/font/google';
import Script from 'next/script';
import AppShell from '@/components/layout/AppShell';

const baseUrl = 'https://tolosapottershouse.site';
const defaultOgImage = '/images/world_bg.jpg';

const inter = Inter({ subsets: ['latin'], variable: '--font-body' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'], variable: '--font-display' });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-accent' });

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "The Potter's House Christian Church",
    template: "%s | The Potter's House Christian Church",
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  description: 'Official website of The Potter\'s House Christian Church in Tolosa, Leyte. Watch sermons, see events, and find church locations.',
  keywords: ['The Potter\'s House', 'Tolosa Leyte Church', 'Christian Church Leyte', 'Church Events', 'Sermons', 'Live Church'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "The Potter's House Christian Church",
    description: 'Watch sermons, join events, and find church locations in Leyte and nearby areas.',
    url: '/',
    siteName: "The Potter's House Christian Church",
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: "The Potter's House Christian Church",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Potter's House Christian Church",
    description: 'Watch sermons, join events, and find church locations in Leyte and nearby areas.',
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Church',
    name: "The Potter's House Christian Church",
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    image: `${baseUrl}/images/logo.png`,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61555717811786',
      'https://www.youtube.com/@tphtl-o2z',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Brgy. Imelda',
      addressLocality: 'Tolosa',
      addressRegion: 'Leyte',
      addressCountry: 'PH',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: "The Potter's House Christian Church",
    url: baseUrl,
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${montserrat.variable}`}>
      <head>
        <Script
          src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[url('/images/world_bg.jpg')] bg-cover bg-center bg-fixed text-mid-gray">
        <div className="flex-1">
          <AppShell>
            {children}
          </AppShell>
        </div>
        <footer className="border-t border-white/10 bg-slate-950/80 py-6 text-center text-sm text-slate-300 backdrop-blur-xl">
          © 2026 The Potter's House Christian Church. All rights reserved. | Tolosa, Leyte
        </footer>
      </body>
    </html>
  );
}
