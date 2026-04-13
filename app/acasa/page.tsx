"use client";

import { useEffect, useMemo, useState } from "react";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type HomeSlide = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
};

export default function AcasaPage() {
  const { content } = useStudioContent();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = useMemo<HomeSlide[]>(() => {
    const gallerySlides = content.gallery
      .filter((item) => item.imageUrl.trim().length > 0)
      .map((item, index) => ({
        id: `gallery-${item.id}-${index}`,
        imageUrl: item.imageUrl,
        title: item.title || `Galerie ${index + 1}`,
        caption: item.caption || "Fotografie selectata din galerie",
      }));

    const albumSlides = content.albums.flatMap((album) =>
      album.photos
        .filter((photo) => photo.trim().length > 0)
        .map((photo, photoIndex) => ({
          id: `album-${album.id}-${photoIndex}`,
          imageUrl: photo,
          title: album.title || `Album ${photoIndex + 1}`,
          caption: album.description || "Fotografie selectata din album",
        }))
    );

    return [...gallerySlides, ...albumSlides];
  }, [content]);

  useEffect(() => {
    if (slides.length === 0) {
      setActiveSlide(0);
      return;
    }

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (activeSlide > slides.length - 1) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  const goToPrev = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    if (slides.length === 0) return;
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const currentSlide = slides[activeSlide];

  return (
    <SiteShell
      title="Acasa"
      description="Studio foto pentru bebelusi, cu sedinte in siguranta si cadre naturale."
      containerClassName="mx-auto grid w-full max-w-6xl gap-8 px-6 py-12 md:grid-cols-2"
    >
      <section className="space-y-5">
        <p className={siteConfig.theme.badge}>
          Studio foto pentru bebelusi
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Momente mici, amintiri pentru o viata
        </h1>
        <p className={`text-lg ${siteConfig.theme.mutedText}`}>
          Sedinte foto cu setup profesional, lumina blanda si mult confort pentru bebelus.
        </p>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-rose-100 bg-white p-3 shadow-sm">
        {currentSlide ? (
          <div className="space-y-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent p-4 text-white">
                <p className="text-sm font-semibold">{currentSlide.title}</p>
                <p className="text-xs text-white/90">{currentSlide.caption}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={goToPrev}
                className="rounded-full border border-rose-200 px-3 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Inapoi
              </button>

              <div className="flex items-center gap-1">
                {slides.slice(0, 8).map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 w-2.5 rounded-full transition ${activeSlide === index ? "bg-rose-600" : "bg-rose-200 hover:bg-rose-300"
                      }`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goToNext}
                className="rounded-full border border-rose-200 px-3 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Inainte
              </button>
            </div>
          </div>
        ) : (
          <div className={`aspect-[4/5] w-full rounded-2xl ${siteConfig.theme.softSurface}`} />
        )}
      </section>
    </SiteShell>
  );
}
