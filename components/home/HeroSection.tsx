'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-gray-900 text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/video_bg.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center px-4 py-24">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="mb-6 text-sm uppercase tracking-[0.35em] text-red-500">The Potter's House Christian Church</p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Changing Lives
            <br />
            Making Disciples
            <br />
            Reaching the World
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-gray-200 md:text-lg">
            A warm community in Tolosa, Leyte, bringing faith, fellowship, and service together through worship,
            outreach, and spiritual growth.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#about" variant="solid">Learn More</Button>
            <Button href="#messages" variant="outline">Watch Messages</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
