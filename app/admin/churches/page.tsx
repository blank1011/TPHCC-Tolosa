'use client';

import { useEffect, useState } from 'react';
import { MapPin, UserRound } from 'lucide-react';

type ChurchItem = {
  _id?: string;
  name: string;
  address: string;
  pastorName: string;
  latitude: number;
  longitude: number;
  phone?: string;
  createdAt?: string;
};

type ChurchForm = {
  name: string;
  address: string;
  pastorName: string;
  latitude: string;
  longitude: string;
  phone: string;
};

const initialForm: ChurchForm = {
  name: '',
  address: '',
  pastorName: '',
  latitude: '',
  longitude: '',
  phone: '',
};

export default function AdminChurchesPage() {
  const [form, setForm] = useState<ChurchForm>(initialForm);
  const [churches, setChurches] = useState<ChurchItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadChurches = async () => {
    try {
      const response = await fetch('/api/churches');
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setChurches(
        data.map((item: any) => ({
          ...item,
          _id: item._id?.toString(),
          createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString() : undefined,
        }))
      );
    } catch (error) {
      console.error('Failed to load churches:', error);
    }
  };

  useEffect(() => {
    loadChurches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.address.trim() || !form.pastorName.trim() || !form.latitude.trim() || !form.longitude.trim()) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    const lat = Number(form.latitude);
    const lng = Number(form.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setMessage({ type: 'error', text: 'Latitude and longitude must be valid numbers.' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/churches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          pastorName: form.pastorName,
          latitude: lat,
          longitude: lng,
          phone: form.phone,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        setMessage({ type: 'error', text: errorBody.error || 'Failed to save church.' });
        return;
      }

      setMessage({ type: 'success', text: 'Church saved successfully.' });
      setForm(initialForm);
      loadChurches();
    } catch (error) {
      console.error('Failed to save church:', error);
      setMessage({ type: 'error', text: 'Failed to save church.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) {
      return;
    }

    try {
      const response = await fetch('/api/churches', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        setMessage({ type: 'error', text: 'Failed to delete church.' });
        return;
      }

      setChurches((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Failed to delete church:', error);
      setMessage({ type: 'error', text: 'Failed to delete church.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-4xl font-bold text-white">Add Church</h1>
        <p className="text-slate-400">Create church locations with pastor name and exact map coordinates.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_minmax(380px,0.95fr)]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Church Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="The Potter's House Christian Church - Tolosa"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Pastor Name *</label>
              <input
                name="pastorName"
                value={form.pastorName}
                onChange={handleChange}
                placeholder="Pastor John Doe"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Brgy. Imelda, Tolosa, Leyte"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Latitude *</label>
                <input
                  name="latitude"
                  value={form.latitude}
                  onChange={handleChange}
                  placeholder="11.063753666303958"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Longitude *</label>
                <input
                  name="longitude"
                  value={form.longitude}
                  onChange={handleChange}
                  placeholder="125.03609567286577"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200">Phone (optional)</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(63) 992-431-0216"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {isLoading ? 'Saving...' : 'Save Church'}
            </button>
          </form>

          {message ? (
            <div className={`mt-4 rounded-2xl border p-3 text-sm ${message.type === 'success' ? 'border-emerald-500/30 bg-emerald-900/30 text-emerald-100' : 'border-rose-500/30 bg-rose-900/30 text-rose-100'}`}>
              {message.text}
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Church List</h2>
            <button
              type="button"
              onClick={loadChurches}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {churches.length ? (
              churches.map((church) => (
                <div key={church._id ?? church.name} className="rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                  <h3 className="text-base font-semibold text-white">{church.name}</h3>
                  <div className="mt-2 flex items-start gap-2 text-sm text-slate-300">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0 text-red-300" />
                    <span>{church.address}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <UserRound size={16} className="flex-shrink-0 text-emerald-300" />
                    <span>{church.pastorName}</span>
                  </div>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                    Lat: {church.latitude} | Lng: {church.longitude}
                  </p>
                  {church.phone ? (
                    <p className="mt-1 text-xs text-slate-400">{church.phone}</p>
                  ) : null}
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(church._id)}
                      className="rounded-full bg-rose-600 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/80 p-6 text-center text-sm text-slate-400">
                No churches yet. Add your first church using the form.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
