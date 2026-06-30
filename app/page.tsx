import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import ServiceTimes from '@/components/home/ServiceTimes';
import UpcomingEvents from '@/components/home/UpcomingEvents';
import MinistriesSlider from '@/components/home/MinistriesSlider';
import FindUs from '@/components/home/FindUs';
import RecentMessages from '@/components/home/RecentMessages';

export const metadata: Metadata = {
  title: { absolute: "Tolosa Potter's House" },
  description: "The Potter's House Christian Church in Tolosa, Leyte. Discover service times, events, and latest messages.",
  alternates: { canonical: '/' },
  openGraph: {
    title: "The Potter's House Christian Church",
    description: "The Potter's House Christian Church in Tolosa, Leyte. Discover service times, events, and latest messages.",
    url: '/',
    images: [
      {
        url: '/images/world_bg.jpg',
        width: 1200,
        height: 630,
        alt: "The Potter's House Christian Church Home",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Potter's House Christian Church",
    description: "The Potter's House Christian Church in Tolosa, Leyte. Discover service times, events, and latest messages.",
    images: ['/images/world_bg.jpg'],
  },
};

export default function HomePage() {
  const homeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: "The Potter's House Christian Church - Home",
    url: 'https://tolosapottershouse.site/',
    description: "The Potter's House Christian Church in Tolosa, Leyte. Discover service times, events, and latest messages.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <main className="min-h-screen bg-light-gray text-mid-gray">
        <HeroSection />
        <ServiceTimes />
        <UpcomingEvents isHomePage={true} />
        <MinistriesSlider />
        <FindUs />
        <RecentMessages />
      </main>
    </>
  );
}
