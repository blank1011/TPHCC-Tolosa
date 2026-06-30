import { getLatestYouTubeVideos } from '@/lib/youtube';
import Link from 'next/link';
import Image from 'next/image';

export default async function RecentMessages() {
  const videos = await getLatestYouTubeVideos(3);

  return (
    <section id="messages" className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-500">Sermons</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">Recent Messages</h2>
          </div>
          <Link href="/videos" className="text-sm font-semibold text-red-600 hover:text-red-700">View All →</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.length > 0 ? (
            videos.map((video) => (
              <Link
                key={video.videoId}
                href={`https://www.youtube.com/watch?v=${video.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <div className="relative h-56 w-full">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-x-0 bottom-4 flex justify-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-navy">Watch</span>
                  </div>
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold text-navy">{video.title}</h3>
                  <p className="text-sm text-slate-500">{new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500 shadow-sm">
              <p>No recent videos found yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
