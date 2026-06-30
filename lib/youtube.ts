export type YouTubeVideo = {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
};

export type YouTubeLiveStatus = {
  liveVideo: YouTubeVideo | null;
  channelUrl: string;
  missingConfig: boolean;
};

const normalizeYouTubeHandle = (handle: string) => handle.trim().replace(/^.*\/\@/, '').replace(/^@/, '');

const resolveYouTubeChannelId = async (apiKey: string, channelId?: string, channelHandle?: string) => {
  if (channelId) return channelId;
  if (!channelHandle) return null;

  const handle = normalizeYouTubeHandle(channelHandle);
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(handle)}&maxResults=1&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;

  const data = await res.json();
  return data.items?.[0]?.id?.channelId ?? null;
};

const fetchLiveVideo = async (apiKey: string, channelId: string) => {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=live&channelId=${encodeURIComponent(channelId)}&maxResults=1&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) return null;

  const data = await res.json();
  const item = data.items?.[0];
  if (!item?.id?.videoId) return null;

  return {
    videoId: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
    publishedAt: item.snippet.publishedAt,
    channelTitle: item.snippet.channelTitle,
  } as YouTubeVideo;
};

const fetchUploadsPlaylistId = async (apiKey: string, channelId: string) => {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(channelId)}&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return null;

  const data = await res.json();
  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
};

const fetchPlaylistVideos = async (apiKey: string, playlistId: string, maxResults: number) => {
  let nextPageToken: string | undefined;
  const videos: any[] = [];

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${encodeURIComponent(playlistId)}&maxResults=${Math.min(maxResults, 50)}${nextPageToken ? `&pageToken=${encodeURIComponent(nextPageToken)}` : ''}&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) break;

    const data = await res.json();
    videos.push(...(data.items ?? []));
    nextPageToken = data.nextPageToken;
  } while (nextPageToken && videos.length < maxResults);

  return videos.slice(0, maxResults).map((item: any) => ({
    videoId: item.contentDetails?.videoId,
    title: item.snippet?.title,
    description: item.snippet?.description,
    thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url,
    publishedAt: item.snippet?.publishedAt,
    channelTitle: item.snippet?.channelTitle,
  }));
};

export async function getLatestYouTubeVideos(maxResults = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE;

  if (!apiKey) return [];

  const resolvedChannelId = await resolveYouTubeChannelId(apiKey, channelId, channelHandle);
  if (!resolvedChannelId) return [];

  const playlistId = await fetchUploadsPlaylistId(apiKey, resolvedChannelId);
  if (!playlistId) return [];

  return fetchPlaylistVideos(apiKey, playlistId, maxResults);
};

export async function getYouTubeLiveStatus(): Promise<YouTubeLiveStatus> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const channelHandle = process.env.YOUTUBE_CHANNEL_HANDLE;

  if (!apiKey) {
    return {
      liveVideo: null,
      channelUrl: 'https://www.youtube.com',
      missingConfig: true,
    };
  }

  const resolvedChannelId = await resolveYouTubeChannelId(apiKey, channelId, channelHandle);
  if (!resolvedChannelId) {
    const handle = channelHandle ? normalizeYouTubeHandle(channelHandle) : null;
    return {
      liveVideo: null,
      channelUrl: handle ? `https://www.youtube.com/@${handle}` : 'https://www.youtube.com',
      missingConfig: true,
    };
  }

  const liveVideo = await fetchLiveVideo(apiKey, resolvedChannelId);
  const channelUrl = channelId
    ? `https://www.youtube.com/channel/${encodeURIComponent(resolvedChannelId)}`
    : channelHandle
    ? `https://www.youtube.com/@${normalizeYouTubeHandle(channelHandle)}`
    : `https://www.youtube.com/channel/${encodeURIComponent(resolvedChannelId)}`;

  return {
    liveVideo,
    channelUrl,
    missingConfig: false,
  };
}
