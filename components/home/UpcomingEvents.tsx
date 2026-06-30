'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { EventItem } from '@/data/events';
import { MapPin } from 'lucide-react';

interface UpcomingEventsProps {
  isHomePage?: boolean;
}

export default function UpcomingEvents({ isHomePage = false }: UpcomingEventsProps) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [trackTransition, setTrackTransition] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length <= 3) {
      setCurrentIndex(0);
      setTrackTransition(true);
      return;
    }

    setCurrentIndex((prev) => prev % events.length);
  }, [events.length]);

  const hasLongText = (text: string) => text.length > 220;
  const closeModal = () => setSelectedEvent(null);

  const isLooping = !isHomePage && events.length > 3;
  const trackItems = useMemo(
    () => (isLooping ? [...events, ...events.slice(0, 3)] : events),
    [events, isLooping]
  );
  
  const displayedEvents = isHomePage ? events.slice(0, 3) : (isLooping ? events : events.slice(0, 3));

  const slidePercentage = 30;

  const nextSlide = () => {
    if (!isLooping) {
      return;
    }

    setTrackTransition(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const previousSlide = () => {
    if (!isLooping) {
      return;
    }

    setTrackTransition(true);
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const onTrackTransitionEnd = () => {
    if (!isLooping || currentIndex < events.length) {
      return;
    }

    setTrackTransition(false);
    setCurrentIndex(0);
  };

  useEffect(() => {
    if (!isLooping || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setTrackTransition(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [events.length, isLooping, isPaused]);

  useEffect(() => {
    if (!trackTransition) {
      const frame = window.requestAnimationFrame(() => {
        setTrackTransition(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    return undefined;
  }, [trackTransition]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-slate-200 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 text-center text-slate-500">
        <p>No events scheduled yet. Check back soon!</p>
      </div>
    );
  }

  // Grid view for home page (3 events max)
  if (!isLooping) {
    return (
      <section id="events" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-red-500">Upcoming Events</p>
              <h2 className="mt-3 text-3xl font-bold text-navy">Church Events</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-red-600 hover:text-red-700">View All →</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedEvents.map((event) => (
              <div
                key={event._id}
                className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative overflow-hidden bg-slate-900">
                  {event.facebookImage ? (
                    <img
                      src={event.facebookImage}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-56 w-full bg-slate-300" />
                  )}
                  <div className="absolute inset-0 bg-black/10" />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="text-lg font-semibold text-navy line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-slate-500">{event.dateShort}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Carousel view for events page (3+ events)
  return (
    <>
      <div className="flex flex-col gap-6" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        {isLooping ? (
          <>
            <div className="grid gap-4 md:hidden">
              {events.map((event) => (
                <article
                  key={event._id}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-lg shadow-slate-950/20 backdrop-blur-xl"
                >
                  <div className="relative overflow-hidden bg-slate-950">
                    {event.facebookImage ? (
                      <img
                        src={event.facebookImage}
                        alt={event.title}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-52 w-full bg-slate-900" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
                  </div>

                  <div className="space-y-3 p-5 text-white">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-200">
                        {event.category}
                      </span>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-200">
                        {event.dateShort}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-white transition hover:text-red-300">
                      {event.title}
                    </h3>

                    <p className="line-clamp-3 text-sm leading-6 text-slate-200">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-2 pt-2">
                      {hasLongText(event.description) ? (
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className="inline-flex w-max items-center justify-center rounded-full bg-white/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                        >
                          See more
                        </button>
                      ) : null}
                      {event.facebookLink && (
                        <a
                          href={event.facebookLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-max items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-blue-200 transition hover:bg-blue-500/20"
                        >
                          View on Facebook
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                      <span>Uploaded</span>
                      <span>{event.dateShort}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden max-w-5xl overflow-hidden md:block">
              <div
                className={`flex gap-4 ${trackTransition ? 'transition-transform duration-700 ease-out' : 'transition-none'}`}
                style={{ transform: `translateX(-${currentIndex * slidePercentage}%)`, willChange: 'transform' }}
                onTransitionEnd={onTrackTransitionEnd}
              >
                {trackItems.map((event, index) => (
                  <article
                    key={`${event._id}-${index}`}
                    style={{ minWidth: '30%', maxWidth: '30%' }}
                    className="group overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-lg shadow-slate-950/20 backdrop-blur-xl"
                  >
                    <div className="relative overflow-hidden bg-slate-950">
                      {event.facebookImage ? (
                        <img
                          src={event.facebookImage}
                          alt={event.title}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="h-48 w-full bg-slate-900" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
                    </div>

                    <div className="space-y-3 p-5 text-white">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-200">
                          {event.category}
                        </span>
                        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-slate-200">
                          {event.dateShort}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-white transition hover:text-red-300">
                        {event.title}
                      </h3>

                      <p className="text-sm leading-6 text-slate-200 line-clamp-3">
                        {event.description}
                      </p>

                      <div className="flex flex-col gap-3 pt-2">
                        {hasLongText(event.description) ? (
                          <button
                            type="button"
                            onClick={() => setSelectedEvent(event)}
                            className="inline-flex w-max items-center justify-center rounded-full bg-white/10 px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
                          >
                            See more
                          </button>
                        ) : null}
                        {event.facebookLink && (
                          <a
                            href={event.facebookLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-max items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200 transition hover:bg-blue-500/20"
                          >
                            View on Facebook
                          </a>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                        <span>Uploaded</span>
                        <span>{event.dateShort}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="group overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 shadow-lg shadow-slate-950/20 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative overflow-hidden bg-slate-950">
                  {event.facebookImage ? (
                    <img
                      src={event.facebookImage}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-48 w-full bg-slate-900" />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-transparent" />
                </div>

                <div className="space-y-3 p-5 text-white">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-200">
                      {event.category}
                    </span>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-slate-200">
                      {event.dateShort}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white transition hover:text-red-300">
                    {event.title}
                  </h3>

                  <p className="text-sm leading-6 text-slate-200 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex flex-col gap-2 pt-2">
                    {hasLongText(event.description) ? (
                      <button
                        type="button"
                        onClick={() => setSelectedEvent(event)}
                        className="inline-flex w-max items-center justify-center rounded-full bg-white/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/20"
                      >
                        See more
                      </button>
                    ) : null}
                    {event.facebookLink && (
                      <a
                        href={event.facebookLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-max items-center justify-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-blue-200 transition hover:bg-blue-500/20"
                      >
                        View on Facebook
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-400">
                    <span>Uploaded</span>
                    <span>{event.dateShort}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {isLooping && (
          <div className="hidden items-center justify-between gap-3 pt-2 md:flex">
            <div></div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={previousSlide}
                className="rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="rounded-full border border-white/15 bg-slate-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-900"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedEvent ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative flex h-[min(88vh,660px)] w-[min(94vw,1060px)] flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-5 top-5 z-10 rounded-full bg-slate-900/80 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Close
            </button>
            <div className="grid h-full min-h-0 gap-6 p-6 pt-16 lg:grid-cols-2 lg:gap-8 lg:p-8 lg:pt-16">
              {selectedEvent.facebookImage ? (
                <div className="h-52 overflow-hidden rounded-2xl bg-slate-900 sm:h-64 lg:h-full lg:min-h-0">
                  <img
                    src={selectedEvent.facebookImage}
                    alt={selectedEvent.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : null}
              <div className="flex min-h-0 flex-col gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                      {selectedEvent.category}
                    </span>
                    <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                      {selectedEvent.dateShort}
                    </span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">{selectedEvent.title}</h2>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                  <p className="text-slate-300 leading-relaxed text-sm lg:text-base">{selectedEvent.description}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 border-t border-white/10 pt-4 text-sm uppercase tracking-[0.2em] text-slate-400">
                  <MapPin size={16} className="text-red-400 flex-shrink-0" />
                  <span>{selectedEvent.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
