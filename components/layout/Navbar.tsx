"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Ellipsis, Home, Info, Radio, Video } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname]);

  const mobileLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/events', label: 'Events', icon: CalendarDays },
    { href: '/videos', label: 'Videos', icon: Video },
    { href: '/live', label: 'Live', icon: Radio },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/logo.png" alt="The Potter's House Christian Centre" width={40} height={40} className="rounded-full bg-white" />
          <div className="flex flex-col leading-tight">
            <span className="font-display text-base font-semibold text-navy sm:text-lg">The Potter's House</span>
            <span className="text-sm text-mid-gray">Christian Centre - Tolosa Leyte</span>
          </div>
        </Link>
        <nav className="hidden gap-8 md:flex text-sm font-medium text-mid-gray">
          <Link href="/" className="hover:text-navy">Home</Link>
          <Link href="/about" className="hover:text-navy">About</Link>
          <Link href="/events" className="hover:text-navy">Events</Link>
          <Link href="/videos" className="hover:text-navy">Videos</Link>
          <Link href="/live" className="hover:text-navy flex items-center gap-2">
            Live
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.12)]" />
          </Link>
          <div className="group relative">
            <button type="button" className="flex items-center gap-1 hover:text-navy">
              More Links
              <span className="text-xs">▼</span>
            </button>
            <div className="invisible absolute right-0 mt-2 w-48 rounded-3xl border border-slate-200/70 bg-white py-3 shadow-xl shadow-slate-200/40 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <Link href="/leyte-churches" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Leyte Locations</Link>
              <a href="https://www.prescottpottershouse.com/" target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Prescott</a>
              <a href="https://pottershousephils.com/" target="_blank" rel="noreferrer" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Mandaluyong</a>
            </div>
          </div>
        </nav>
        </div>
      </header>

      {isMoreOpen ? (
        <>
          <button
            type="button"
            aria-label="Close more links"
            onClick={() => setIsMoreOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/20 md:hidden"
          />
          <div className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.3rem)] z-[60] mx-auto w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/95 p-2 shadow-[0_14px_42px_rgba(15,23,42,0.2)] backdrop-blur md:hidden">
            <p className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">More Links</p>
            <div className="grid gap-1">
              <Link
                href="/leyte-churches"
                onClick={() => setIsMoreOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Leyte Locations
              </Link>
              <a
                href="https://www.prescottpottershouse.com/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMoreOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Prescott
              </a>
              <a
                href="https://pottershousephils.com/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsMoreOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Mandaluyong
              </a>
            </div>
          </div>
        </>
      ) : null}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/70 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.45rem)] pt-2 shadow-[0_-10px_32px_rgba(15,23,42,0.12)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {mobileLinks.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/' ? pathname === '/' : pathname?.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[0.68rem] font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 text-navy'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                <Icon size={17} className={isActive ? 'text-navy' : 'text-slate-500'} />
                <span className="mt-1 tracking-[0.01em]">{label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[0.68rem] font-semibold transition ${
              isMoreOpen
                ? 'bg-blue-50 text-navy'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Ellipsis size={17} className={isMoreOpen ? 'text-navy' : 'text-slate-500'} />
            <span className="mt-1 tracking-[0.01em]">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
