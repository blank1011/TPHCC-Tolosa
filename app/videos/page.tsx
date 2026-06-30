import type { Metadata } from 'next';
import VideosPanel from '@/components/videos/VideosPanel';

const MAX_RESULTS = 50;
const MAX_TOTAL_VIDEOS = 100;

function normalizeYouTubeHandle(handle: string) {
  return handle.trim().replace(/^.*\/@/, '').replace(/^@/, '');
}

async function resolveYouTubeChannelId(apiKey: string, channelId?: string, channelHandle?: string) {
  if (channelId) return channelId;
  if (!channelHandle) return null;

  const handle = normalizeYouTubeHandle(channelHandle);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&maxResults=1&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) return null;

  const data = await res.json();
  return data.items?.[0]?.id?.channelId ?? null;
}

async function fetchUploadsPlaylistId(apiKey: string, channelId: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) return null;

  const data = await res.json();
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

async function fetchPlaylistVideos(apiKey: string, playlistId: string) {
  let nextPageToken: string | undefined;
  const videos: any[] = [];

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(playlistId)}&maxResults=${MAX_RESULTS}${nextPageToken ? `&pageToken=${encodeURIComponent(nextPageToken)}` : ''}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) break;

    const data = await res.json();
    videos.push(...(data.items ?? []));
    nextPageToken = data.nextPageToken;
  } while (nextPageToken && videos.length < MAX_TOTAL_VIDEOS);

  return videos.slice(0, MAX_TOTAL_VIDEOS).map((item: any) => ({
    videoId: item.contentDetails?.videoId,
    title: item.snippet?.title,
    description: item.snippet?.description,
    thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url,
    publishedAt: item.snippet?.publishedAt,
  }));
}

async function fetchLatestYouTubeVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE;

  if (!apiKey) {
    return { videos: [], missingConfig: true, channelUrl: 'https://www.youtube.com' };
  }

  const resolvedChannelId = await resolveYouTubeChannelId(apiKey, channelId, channelHandle);
  if (!resolvedChannelId) {
    return { videos: [], missingConfig: true, channelUrl: channelHandle ? `https://www.youtube.com/@${normalizeYouTubeHandle(channelHandle)}` : 'https://www.youtube.com' };
  }

  const uploadsPlaylistId = await fetchUploadsPlaylistId(apiKey, resolvedChannelId);
  if (!uploadsPlaylistId) {
    return { videos: [], missingConfig: true, channelUrl: channelHandle ? `https://www.youtube.com/@${normalizeYouTubeHandle(channelHandle)}` : 'https://www.youtube.com' };
  }

  const videos = await fetchPlaylistVideos(apiKey, uploadsPlaylistId);
  return {
    videos,
    missingConfig: false,
    channelUrl: channelHandle ? `https://www.youtube.com/@${normalizeYouTubeHandle(channelHandle)}` : 'https://www.youtube.com/channel/' + resolvedChannelId,
  };
}

export const metadata: Metadata = {
  title: 'Videos',
  description: 'Watch live services and recent YouTube videos from The Potter’s House Christian Church.',
  alternates: { canonical: '/videos' },
  openGraph: {
    title: "Videos | The Potter's House Christian Church",
    description: 'Watch live services and recent YouTube videos from The Potter’s House Christian Church.',
    url: '/videos',
    images: [
      {
        url: '/images/world_bg.jpg',
        width: 1200,
        height: 630,
        alt: "The Potter's House Videos",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Videos | The Potter's House Christian Church",
    description: 'Watch live services and recent YouTube videos from The Potter’s House Christian Church.',
    images: ['/images/world_bg.jpg'],
  },
};

export default async function VideosPage() {
  const { videos, missingConfig, channelUrl } = await fetchLatestYouTubeVideos();
  const videosJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: "The Potter's House Christian Church Videos",
    url: 'https://tolosapottershouse.site/videos',
    hasPart: videos.slice(0, 10).map((video) => ({
      '@type': 'VideoObject',
      name: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnail,
      uploadDate: video.publishedAt,
      contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videosJsonLd) }}
      />
      <main className="min-h-screen bg-[url('/images/world_bg.jpg')] bg-cover bg-center bg-fixed text-white">
        <section className="relative overflow-hidden py-16 lg:py-20">
          <div className="absolute inset-0 bg-slate-950/60" />
          <div className="relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10">
              <div>
                <VideosPanel videos={videos} missingConfig={missingConfig} channelUrl={channelUrl} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
