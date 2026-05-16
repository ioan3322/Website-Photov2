"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

export type HeroSlide = {
  id: string;
  src: string;
  alt: string;
};

type HeroSlideshowProps = {
  slides: HeroSlide[];
  loading?: boolean;
};

const AUTO_ADVANCE_MS = 6200;

const textVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, staggerChildren: 0.08 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export default function HeroSlideshow({ slides, loading = false }: HeroSlideshowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [readySlides, setReadySlides] = useState<Record<string, boolean>>({});

  const normalizedSlides = useMemo(
    () => slides.filter((slide) => slide.src.trim().length > 0),
    [slides],
  );

  const safeActiveIndex = normalizedSlides.length > 0 ? activeIndex % normalizedSlides.length : 0;
  const activeSlide = normalizedSlides[safeActiveIndex];

  useEffect(() => {
    if (normalizedSlides.length === 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, AUTO_ADVANCE_MS);

    return () => window.clearInterval(timer);
  }, [normalizedSlides.length]);

  useEffect(() => {
    if (normalizedSlides.length === 0) {
      return;
    }

    const imageLoaders = normalizedSlides.map((slide) => {
      const image = new window.Image();
      image.src = slide.src;
      image.onload = () => {
        setReadySlides((prev) => ({ ...prev, [slide.id]: true }));
      };
      image.onerror = () => {
        setReadySlides((prev) => ({ ...prev, [slide.id]: true }));
      };
      return image;
    });

    return () => {
      imageLoaders.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, [normalizedSlides]);

  const isLoading = loading || normalizedSlides.length === 0 || !readySlides[activeSlide?.id || ""];

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#FAF8F5]">
      <div className="relative h-screen min-h-[100svh] w-full">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(203,184,169,0.22)_0,_transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.04))]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-gradient-to-br from-[#e8ded4] via-[#f8f3ee] to-[#d4c2b2]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.18),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.12))]" />
            <div className="absolute inset-0 animate-pulse bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.2),transparent)]" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeSlide ? (
              <motion.div
                key={activeSlide.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: "easeOut" }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={prefersReducedMotion ? { scale: 1 } : { scale: 1 }}
                  animate={prefersReducedMotion ? { scale: 1 } : { scale: 1.05 }}
                  transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                >
                  <Image
                    src={activeSlide.src}
                    alt={activeSlide.alt}
                    fill
                    priority={safeActiveIndex === 0}
                    sizes="100vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-20 pt-24 sm:px-6 sm:pb-24 lg:px-8 lg:pb-24">
          <motion.div
            className="max-w-3xl"
            variants={textVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={childVariants}
              className="mb-5 w-fit rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-xl"
            >
              Studio foto premium
            </motion.p>

            <motion.h1
              variants={childVariants}
              className="max-w-2xl text-4xl font-medium leading-[0.96] tracking-tight text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.2)] sm:text-5xl lg:text-7xl"
            >
              Amintiri care rămân pentru o viață
            </motion.h1>

            <motion.p
              variants={childVariants}
              className="mt-6 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg"
            >
              Fotografie premium pentru nou-născuți, maternitate și familie.
            </motion.p>

            <motion.div
              variants={childVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Link
                href="/galerie"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/90 px-6 py-3.5 text-sm font-medium text-[#2B2B2B] shadow-[0_12px_34px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
              >
                Vezi portofoliul
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/12 px-6 py-3.5 text-sm font-medium text-white backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/18"
              >
                Rezervă ședința
              </Link>
            </motion.div>
          </motion.div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <div className="hidden max-w-xl gap-2 sm:flex">
              {normalizedSlides.slice(0, 3).map((slide) => (
                <div key={`${slide.id}-chip`} className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-xl">
                  {slide.alt}
                </div>
              ))}
            </div>

            <div className="ml-auto flex items-center gap-2">
              {normalizedSlides.map((slide, index) => {
                const isActive = index === safeActiveIndex;

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Schimbă slide-ul la ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      isActive ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/70"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}