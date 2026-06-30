'use client';

import Link from 'next/link';
import MapView from '@/components/home/MapView';

export default function FindUs() {
  return (
    <section id="find-us" className="bg-light-gray py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-red-500">Visit Us</p>
            <h2 className="mt-3 text-3xl font-bold text-navy">Find The Potter’s House</h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600">
              Brgy. Imelda, Tolosa, Leyte. Drop by for worship, fellowship, and prayer. We’re here to welcome everyone.
            </p>
            <div className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-mid-gray">Address</h3>
                <p className="mt-2 text-base text-slate-700">Brgy. Imelda, Tolosa, Leyte</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-mid-gray">Phone</h3>
                <p className="mt-2 text-base text-slate-700">(63) 992-431-0216</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-mid-gray">Email</h3>
                <p className="mt-2 text-base text-slate-700">to be added soon</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                href="https://www.google.com/maps/search/?api=1&query=11.063753666303958,125.03609567286577"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white"
              >
                Get Directions
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61555717811786"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-blue-600/20 bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Facebook Page
              </a>
              <Link href="/leyte-churches" className="inline-flex items-center justify-center rounded-full border border-red-500 bg-white px-5 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50">View All Leyte Churches</Link>
              </div>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-white shadow-lg">
            <div className="h-full w-full">
              <MapView />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
