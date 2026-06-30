import { getYouTubeLiveStatus } from '@/lib/youtube';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Live | The Potter\'s House Christian Church',
  description: 'Watch the current live stream from The Potter\'s House Christian Church.',
  alternates: { canonical: '/live' },
  openGraph: {
    title: "Live | The Potter's House Christian Church",
    description: "Watch the current live stream from The Potter's House Christian Church.",
    url: '/live',
    images: [
      {
        url: '/images/world_bg.jpg',
        width: 1200,
        height: 630,
        alt: "The Potter's House Live",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Live | The Potter's House Christian Church",
    description: "Watch the current live stream from The Potter's House Christian Church.",
    images: ['/images/world_bg.jpg'],
  },
};

export default async function LivePage() {
  const { liveVideo, channelUrl, missingConfig } = await getYouTubeLiveStatus();

  return (
    <main className="bg-[url('/images/world_bg.jpg')] bg-cover bg-center bg-fixed text-white">
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative mx-auto max-w-6xl h-full px-4 sm:px-6 lg:px-8">
          <div className="h-full rounded-[2.5rem] border border-white/15 bg-white/10 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="space-y-6 lg:max-w-4xl mx-auto">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-amber-200/90">Live</p>
                  <h1 className="text-4xl font-bold text-white md:text-5xl">Current Livestream</h1>
                </div>
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Visit YouTube Channel
                </a>
              </div>

              {missingConfig ? (
                <div className="rounded-[2rem] border border-amber-200/80 bg-amber-50/20 p-8 text-sm text-amber-100 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
                  <p className="font-semibold text-white">YouTube live status is not configured yet.</p>
                  <p className="mt-3 text-slate-200">Add your <code className="rounded bg-slate-900/70 px-2 py-1 text-xs">YOUTUBE_API_KEY</code> and channel configuration in <code className="rounded bg-slate-900/70 px-2 py-1 text-xs">.env.local</code>.</p>
                </div>
              ) : liveVideo ? (
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
                  <div className="space-y-6">
                    <div className="overflow-hidden rounded-[2rem] border border-white/15 bg-slate-950/60 shadow-xl shadow-slate-950/30">
                      <iframe
                        title={liveVideo.title}
                        src={`https://www.youtube.com/embed/${liveVideo.videoId}?autoplay=0&rel=0&modestbranding=1`}
                        className="h-[320px] w-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">{liveVideo.title}</h2>
                      <p className="mt-3 text-slate-200">{liveVideo.description}</p>
                    </div>
                  </div>
                  <div className="rounded-[2rem] border border-white/15 bg-white/10 p-6 shadow-xl shadow-slate-950/30 backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-amber-200/90">Now Live</p>
                    <p className="mt-3 text-slate-200">{liveVideo.channelTitle} is currently streaming.</p>
                    <a
                      href={`https://www.youtube.com/watch?v=${liveVideo.videoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300"
                    >
                      Watch Live on YouTube
                    </a>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-white/15 bg-slate-900/80 p-8 text-slate-200 shadow-xl shadow-slate-950/30 max-w-3xl mx-auto">
                  <p className="text-xl font-semibold text-white">No live stream detected right now.</p>
                  <p className="mt-3">If a live stream is active on your channel, it will appear here automatically.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
