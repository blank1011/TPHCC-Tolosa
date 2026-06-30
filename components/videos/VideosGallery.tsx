'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type Video = {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};

export default function VideosGallery({ videos }: { videos: Video[] }) {
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
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentVideos.length > 0 ? (
          currentVideos.map((video) => (
            <article
              key={video.videoId}
              className="overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
            >
              <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer">
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
              </a>
              <div className="space-y-3 p-5 text-white">
                <a
                  href={`https://www.youtube.com/watch?v=${video.videoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-semibold text-white transition hover:text-red-300"
                >
                  {video.title}
                </a>
                <p className="text-sm leading-6 text-slate-200 line-clamp-3">{video.description}</p>
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-300">
                  <span>Uploaded</span>
                  <time dateTime={video.publishedAt}>{new Date(video.publishedAt).toLocaleDateString()}</time>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-[2rem] border border-white/15 bg-white/10 p-10 text-center text-slate-200 shadow-lg shadow-slate-950/20">
            <p className="text-lg font-semibold text-white">No videos available yet.</p>
            <p className="mt-3">If your channel has uploads, check that the API key and channel handle are correct.</p>
          </div>
        )}
      </div>

      {videos.length > pageSize ? (
        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/15 bg-white/10 px-4 py-4 text-white shadow-lg shadow-slate-950/20 sm:flex-row">
          <div className="text-sm text-slate-200">Page {page} of {pageCount}</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="rounded-full border border-white/20 bg-slate-900/60 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageIndex) => (
              <button
                key={pageIndex}
                type="button"
                onClick={() => goToPage(pageIndex)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${pageIndex === page ? 'bg-white text-navy' : 'bg-slate-900/60 text-white hover:bg-slate-800'}`}
              >
                {pageIndex}
              </button>
            ))}
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
      ) : null}
    </>
  );
}
