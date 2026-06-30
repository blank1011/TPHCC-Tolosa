'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import VideosGallery from './VideosGallery';

type Video = {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

export default function VideosPanel({
  videos,
  missingConfig,
  channelUrl,
}: {
  videos: Video[];
  missingConfig: boolean;
  channelUrl: string;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(videos.length / pageSize));

  const currentVideos = useMemo(
    () => videos.slice((page - 1) * pageSize, page * pageSize),
    [videos, page]
  );

  const goToPage = (newPage: number) => {
    setPage(Math.min(Math.max(newPage, 1), pageCount));
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(320px,0.78fr)_1.22fr] lg:items-start">
      <div className="flex justify-start">
        <div className="w-full max-w-[520px] rounded-[2.5rem] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-amber-200/90">Videos</p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Live services and recent uploads from our YouTube channel</h1>
          <p className="text-base leading-8 text-slate-200/90">
            We stream our services live, and every recording becomes part of our channel. This page automatically shows the latest videos from YouTube so your site stays up to date.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              Back to Home
            </Link>
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
            <div className="mt-8 rounded-[2rem] border border-amber-200/80 bg-amber-50/20 p-8 text-sm text-amber-100 shadow-lg shadow-slate-950/20 backdrop-blur-xl">
              <p className="font-semibold text-white">YouTube auto-update is not configured yet.</p>
              <p className="mt-3 text-slate-200">
                Add the following variables to your <code className="rounded bg-slate-900/70 px-2 py-1 text-xs">.env.local</code> file:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-200">
                <li><code>YOUTUBE_API_KEY</code></li>
                <li><code>YOUTUBE_CHANNEL_HANDLE</code></li>
              </ul>
              <p className="mt-3 text-slate-200">Once added, this page will automatically display the latest YouTube uploads from your channel.</p>
            </div>
          ) : null}

          {videos.length > pageSize ? (
            <div className="mt-10 rounded-[2rem] border border-white/15 bg-white/10 px-4 py-4 text-white shadow-lg shadow-slate-950/20">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-200">Page {page} of {pageCount}</div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === pageCount}
                    className="rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div>
        <VideosGallery videos={currentVideos} />
      </div>
    </div>
  );
}
