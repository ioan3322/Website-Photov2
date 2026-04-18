"use client";

import { useEffect, useMemo, useState } from "react";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function GaleriePage() {
  const { content, loading } = useStudioContent();
  const visibleItems = content.gallery.filter((item) => item.imageUrl.trim().length > 0 || item.title || item.caption);
  const imageItems = useMemo(
    () => visibleItems.filter((item) => item.imageUrl.trim().length > 0),
    [visibleItems],
  );
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const closeFullscreen = () => {
    setFullscreenIndex(null);
  };

  const goToPrev = () => {
    setFullscreenIndex((prev) => {
      if (prev === null || imageItems.length === 0) {
        return null;
      }

      return (prev - 1 + imageItems.length) % imageItems.length;
    });
  };

  const goToNext = () => {
    setFullscreenIndex((prev) => {
      if (prev === null || imageItems.length === 0) {
        return null;
      }

      return (prev + 1) % imageItems.length;
    });
  };

  useEffect(() => {
    if (fullscreenIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }

      if (event.key === "ArrowLeft") {
        goToPrev();
      }

      if (event.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreenIndex, imageItems.length]);

  const activeFullscreenPhoto = fullscreenIndex !== null ? imageItems[fullscreenIndex] : null;

  return (
    <SiteShell
      title="Galerie"
      description="Fotografii mari de prezentare."
      containerClassName="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14"
    >
      {visibleItems.length > 0 ? (
        <div className="mt-4 columns-2 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
          {visibleItems.map((item, index) => (
            <article key={item.id || `${item.title}-${index}`} className="mb-6 break-inside-avoid space-y-2">
              <div className={`${siteConfig.theme.card} shadow-none overflow-hidden p-0`}>
                {item.imageUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      const photoIndex = imageItems.findIndex((photo) => photo.id === item.id && photo.imageUrl === item.imageUrl);
                      if (photoIndex >= 0) {
                        setFullscreenIndex(photoIndex);
                      }
                    }}
                    className="group block w-full text-left"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Fotografie"}
                      className="h-auto w-full object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-[1.03]"
                      loading="lazy"
                    />
                  </button>
                ) : (
                  <div className={`h-[240px] w-full ${siteConfig.theme.softSurface}`} />
                )}
              </div>
              <h2 className="text-lg font-semibold leading-tight text-slate-900">{item.title || `Fotografie ${index + 1}`}</h2>
              <p className={`text-sm ${siteConfig.theme.mutedText}`}>{item.caption || "Cadru de prezentare"}</p>
            </article>
          ))}
        </div>
      ) : loading ? (
        <div className="mt-4 columns-2 gap-4 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
          {Array.from({ length: 12 }).map((_, index) => (
            <article key={`galerie-skeleton-${index}`} className="mb-6 break-inside-avoid space-y-2">
              <div className={`${siteConfig.theme.card} shadow-none overflow-hidden p-0`}>
                <div className={`h-[240px] w-full ${siteConfig.theme.softSurface} animate-pulse`} />
              </div>
              <div className={`h-5 w-2/3 rounded ${siteConfig.theme.softSurface}`} />
              <div className={`h-4 w-5/6 rounded ${siteConfig.theme.softSurface}`} />
            </article>
          ))}
        </div>
      ) : (
        <p className={`mt-8 rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
          Nu exista inca fotografii in galerie.
        </p>
      )}

      {activeFullscreenPhoto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vizualizare fotografie fullscreen"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-3 py-6 sm:px-8"
          onClick={closeFullscreen}
        >
          <button
            type="button"
            aria-label="Imagine anterioara"
            onClick={(event) => {
              event.stopPropagation();
              goToPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 px-4 py-3 text-xl font-semibold text-white backdrop-blur transition hover:bg-black/50 sm:left-6"
          >
            ‹
          </button>

          <div className="relative max-h-full max-w-[96vw]" onClick={(event) => event.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeFullscreenPhoto.imageUrl}
              alt={activeFullscreenPhoto.title || "Fotografie"}
              className="max-h-[90vh] w-auto max-w-[96vw] rounded-xl object-contain"
            />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
              {(fullscreenIndex ?? 0) + 1} / {imageItems.length}
            </p>
          </div>

          <button
            type="button"
            aria-label="Imagine urmatoare"
            onClick={(event) => {
              event.stopPropagation();
              goToNext();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 px-4 py-3 text-xl font-semibold text-white backdrop-blur transition hover:bg-black/50 sm:right-6"
          >
            ›
          </button>

          <button
            type="button"
            aria-label="Inchide"
            onClick={closeFullscreen}
            className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/30 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/50"
          >
            Inchide
          </button>
        </div>
      ) : null}
    </SiteShell>
  );
}
