'use client';

import { useEffect, useState } from 'react';

interface FormData {
  postText: string;
  imagePreview?: string;
  imageSize?: number;
  title?: string;
}

interface EventItem {
  _id?: string;
  title: string;
  description: string;
  location: string;
  category: string;
  dateShort: string;
  facebookLink?: string;
  facebookImage?: string;
  facebookPermalink?: string;
  facebookMessage?: string;
  createdAt?: string;
}

export default function PostEventPage() {
  const [formData, setFormData] = useState<FormData>({
    postText: '',
    imagePreview: undefined,
    imageSize: undefined,
    title: undefined,
  });
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(
            data.map((event: any) => ({
              ...event,
              _id: event._id?.toString(),
              createdAt: event.createdAt ? new Date(event.createdAt).toLocaleString() : undefined,
            }))
          );
        }
      } catch (error) {
        console.error('Failed to load events:', error);
      }
    };

    loadEvents();
  }, []);

  const compressImage = async (file: File) => {
    const imageBitmap = await createImageBitmap(file);
    const maxDimension = 1200;
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    if (width > maxDimension || height > maxDimension) {
      const scale = Math.min(maxDimension / width, maxDimension / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Unable to get canvas context');
    ctx.drawImage(imageBitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((result) => resolve(result), 'image/jpeg', 0.72)
    );

    if (!blob) throw new Error('Image compression failed');

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') resolve(reader.result);
        else reject(new Error('Failed to read compressed image'));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    return { dataUrl, size: blob.size };
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const { dataUrl, size } = await compressImage(file);
      setFormData((prev) => ({
        ...prev,
        imagePreview: dataUrl,
        imageSize: size,
      }));
      setMessage({ type: 'success', text: `Image compressed to ${(size / 1024).toFixed(0)} KB.` });
      setTimeout(() => setMessage(null), 2500);
    } catch (error) {
      console.error('Image compression failed:', error);
      setMessage({ type: 'error', text: 'Unable to process the selected image.' });
    } finally {
      setIsCompressing(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(
          data.map((event: any) => ({
            ...event,
            _id: event._id?.toString(),
            createdAt: event.createdAt ? new Date(event.createdAt).toLocaleString() : undefined,
          }))
        );
      }
    } catch (error) {
      console.error('Failed to refresh events:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.postText.trim() && !formData.imagePreview) {
      setMessage({ type: 'error', text: 'Add text or an image before posting.' });
      return;
    }

    setIsLoading(true);
    try {
      const firstLine = formData.postText.trim().split('\n')[0];
      const payload = {
        title: formData.title?.trim() || firstLine || 'Community update',
        description: formData.postText.trim() || 'A new update has been posted.',
        location: 'Brgy.Imelda Tolosa Leyte',
        category: 'Community',
        dateShort: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        facebookImage: formData.imagePreview,
        facebookMessage: formData.postText.trim(),
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Event posted successfully!' });
        setFormData({ postText: '', imagePreview: undefined, imageSize: undefined, title: undefined });
        fetchEvents();
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to post event.' });
      }
    } catch (error) {
      console.error('Error posting event:', error);
      setMessage({ type: 'error', text: 'Error posting event.' });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (id?: string) => {
    if (!id) return;

    try {
      const response = await fetch('/api/events', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setEvents((prev) => prev.filter((event) => event._id !== id));
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div className="max-w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Post to Community</h1>
        <p className="text-slate-400">A lightweight YouTube-style composer with image support and compressed uploads.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.03fr_minmax(420px,0.9fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-400">The Potter&apos;s House Tolosa Leyte</p>
                <p className="text-sm text-slate-300">Public</p>
              </div>
              <div className="rounded-full border border-white/10 bg-slate-950/80 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">
                Post
              </div>
            </div>

            <form onSubmit={handlePostEvent} className="space-y-4">
              <textarea
                name="postText"
                value={formData.postText}
                onChange={handleInputChange}
                rows={6}
                placeholder="Share a sneak peek of your next video, announcement, or event..."
                className="min-h-[220px] w-full rounded-[2rem] border border-white/10 bg-slate-950/80 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />

              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                <label className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-400 hover:bg-blue-500/10">
                  <span>Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <div className="space-y-1 text-right text-xs text-slate-400">
                  <p>{isCompressing ? 'Compressing image…' : formData.imageSize ? `Compressed image ${(formData.imageSize / 1024).toFixed(0)} KB` : 'Max 1200px, JPEG compressed'}</p>
                  <p>Free tier optimized.</p>
                </div>
              </div>

              {formData.imagePreview ? (
                <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 overflow-hidden">
                  <img src={formData.imagePreview} alt="Preview" className="h-72 w-full object-cover" />
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Post preview</p>
                  <p className="text-sm text-slate-300">The preview is compressed in the browser for smaller uploads.</p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || isCompressing}
                  className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {isLoading ? 'Posting...' : 'Post now'}
                </button>
              </div>
            </form>

            {message ? (
              <div className={`mt-4 rounded-3xl border p-4 text-sm font-semibold ${message.type === 'success' ? 'border-emerald-500/30 bg-emerald-900/30 text-emerald-100' : 'border-rose-500/30 bg-rose-900/30 text-rose-100'}`}>
                {message.text}
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Post Preview</h2>
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 overflow-hidden shadow-inner">
              {formData.imagePreview ? (
                <div className="relative h-64 overflow-hidden bg-slate-900">
                  <img src={formData.imagePreview} alt="Post preview" className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-40 bg-slate-900/90 p-6 text-slate-500 flex items-center justify-center text-center">
                  <p>No image selected yet.</p>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
                  <span>Community</span>
                  <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-white">{formData.title || 'Community post preview'}</h3>
                <p className="mt-3 min-h-[100px] whitespace-pre-line text-slate-300 leading-relaxed">
                  {formData.postText || 'Write your announcement above to preview it here.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Event List</h2>
              <button
                type="button"
                onClick={fetchEvents}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
            <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {events.length ? (
                events.map((event) => (
                  <div key={event._id ?? event.title} className="rounded-3xl border border-white/10 bg-slate-950/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm text-slate-400">{event.category}</p>
                        <h3 className="mt-1 text-lg font-semibold text-white truncate">{event.title}</h3>
                      </div>
                      <span className="rounded-full bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-[0.25em] text-slate-400">
                        {event.dateShort}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300 line-clamp-3">{event.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500">
                      <span>{event.location}</span>
                      {event.facebookImage ? <span className="rounded-full bg-slate-800 px-2 py-1 text-slate-300">Image attached</span> : null}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteEvent(event._id)}
                        className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-rose-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/80 p-6 text-center text-sm text-slate-400">
                  No events found yet. Post one to populate the list.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
