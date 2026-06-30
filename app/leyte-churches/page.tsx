import type { Metadata } from 'next';
import LeyteChurchesExplorer from '@/components/locations/LeyteChurchesExplorer';

export const metadata: Metadata = {
  title: 'Leyte Churches',
  description: "Browse Potter's House church locations in Leyte and nearby areas with interactive map directions.",
  alternates: { canonical: '/leyte-churches' },
  openGraph: {
    title: "Leyte Churches | The Potter's House Christian Church",
    description: "Browse Potter's House church locations in Leyte and nearby areas with interactive map directions.",
    url: '/leyte-churches',
    images: [
      {
        url: '/images/world_bg.jpg',
        width: 1200,
        height: 630,
        alt: "The Potter's House Church Locations",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Leyte Churches | The Potter's House Christian Church",
    description: "Browse Potter's House church locations in Leyte and nearby areas with interactive map directions.",
    images: ['/images/world_bg.jpg'],
  },
};

export default function LeyteChurchesPage() {
  const churchesJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: "The Potter's House Church Locations",
    url: 'https://tolosapottershouse.site/leyte-churches',
    description: "Browse Potter's House church locations in Leyte and nearby areas with interactive map directions.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(churchesJsonLd) }}
      />
      <main className="bg-[url('/images/world_bg.jpg')] bg-cover bg-center bg-fixed text-white">
        <section className="relative overflow-hidden py-12 lg:py-16">
          <div className="absolute inset-0 bg-slate-950/60" />

          <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10">
            <LeyteChurchesExplorer />
          </div>
        </section>
      </main>
    </>
  );
}
