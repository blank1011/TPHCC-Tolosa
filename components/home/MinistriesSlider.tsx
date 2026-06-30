'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const slides = [
  {
    title: 'Basketball Ministry',
    description: 'Building character, teamwork, and faith through sports.',
    accent: 'Sports & youth development',
    image: '/images/basketball-bg.jpg',
  },
  {
    title: 'Discipleship Groups',
    description: 'Small groups gathering to grow in faith, study Scripture, and encourage one another.',
    accent: 'Growth in community',
    image: '/images/discipleship-bg.jpg',
  },
  {
    title: 'Community Outreach',
    description: 'Serving Tolosa with food drives, prayer, and support for neighbors in need.',
    accent: 'Neighbors helping neighbors',
    image: '/images/outreach-bg.jpg',
  },
  {
    title: 'Prayer Ministry',
    description: 'Coming together in prayer to seek God for our community and families.',
    accent: 'Prayer & presence',
    image: '/images/prayer-bg.jpg',
  },
];

export default function MinistriesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const previous = () => setCurrentIndex((value) => (value === 0 ? slides.length - 1 : value - 1));
  const next = () => setCurrentIndex((value) => (value === slides.length - 1 ? 0 : value + 1));

  return (
    <section id="ministries" className="relative h-[60vh] overflow-hidden bg-navy text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
      />
      <div className="absolute inset-0 bg-slate-950/40" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-3xl"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-red-400">{slides[currentIndex].accent}</p>
          <h3 className="mt-5 text-5xl font-semibold tracking-tight leading-tight text-white">
            {slides[currentIndex].title}
          </h3>
          <p className="mt-6 text-lg leading-8 text-slate-200">
            {slides[currentIndex].description}
          </p>
        </motion.div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={previous}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
