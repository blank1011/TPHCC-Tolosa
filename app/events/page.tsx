import type { Metadata } from 'next';

import UpcomingEvents from '@/components/home/UpcomingEvents';

export const metadata: Metadata = {
  title: 'Events',
  description: "See upcoming church events at The Potter's House Christian Church in Tolosa, Leyte.",
  alternates: { canonical: '/events' },
  openGraph: {
    title: "Church Events | The Potter's House Christian Church",
    description: "See upcoming church events at The Potter's House Christian Church in Tolosa, Leyte.",
    url: '/events',
    images: [
      {
        url: '/images/world_bg.jpg',
        width: 1200,
        height: 630,
        alt: "The Potter's House Church Events",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Church Events | The Potter's House Christian Church",
    description: "See upcoming church events at The Potter's House Christian Church in Tolosa, Leyte.",
    images: ['/images/world_bg.jpg'],
  },
};

export default function EventsPage() {
  const eventsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: "The Potter's House Christian Church Events",
    url: 'https://tolosapottershouse.site/events',
    description: "See upcoming church events at The Potter's House Christian Church in Tolosa, Leyte.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <main className="bg-[url('/images/world_bg.jpg')] bg-cover bg-center bg-fixed text-white">
        <section className="relative overflow-hidden pt-12 pb-44 lg:pt-16 lg:pb-52">
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="relative mx-auto max-w-screen-2xl px-6 sm:px-8 lg:px-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(320px,0.78fr)_1.22fr] lg:items-start">
              <div className="w-full rounded-[2.5rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.35em] text-amber-200/90">Upcoming Events</p>
                <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">Church Events</h1>
                <p className="mt-6 text-base leading-8 text-slate-200/90 md:text-lg">
                  Discover what's happening at The Potter's House Christian Church.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Back to Home
                  </a>
                </div>
              </div>

              <div className="rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                <UpcomingEvents />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
