"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type GalleryTile = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  spanClassName: string;
};

export default function GaleriePage() {
  const { content, loading } = useStudioContent();
  const visibleItems = content.gallery.filter((item) => item.imageUrl.trim().length > 0 || item.title || item.caption);
  const imageItems = useMemo(
    () => visibleItems.filter((item) => item.imageUrl.trim().length > 0),
    [visibleItems],
  );
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);

  const galleryTiles = useMemo<GalleryTile[]>(() => {
    return visibleItems
      .filter((item) => item.imageUrl.trim().length > 0)
      .map((item, index) => ({
        id: item.id || `${item.title}-${index}`,
        imageUrl: item.imageUrl,
        title: item.title || `Fotografie ${index + 1}`,
        caption: item.caption || "Cadru de prezentare",
        spanClassName:
          index % 8 === 0
            ? "md:col-span-6 md:row-span-2"
            : index % 8 === 1
              ? "md:col-span-3 md:row-span-1"
              : index % 8 === 2
                ? "md:col-span-3 md:row-span-2"
                : index % 8 === 3
                  ? "md:col-span-4 md:row-span-1"
                  : index % 8 === 4
                    ? "md:col-span-4 md:row-span-2"
                    : index % 8 === 5
                      ? "md:col-span-4 md:row-span-1"
                      : index % 8 === 6
                        ? "md:col-span-6 md:row-span-1"
                        : "md:col-span-6 md:row-span-2",
      }));
  }, [visibleItems]);

  const closeFullscreen = useCallback(() => {
    setFullscreenIndex(null);
  }, []);

  const goToPrev = useCallback(() => {
    setFullscreenIndex((prev) => {
      if (prev === null || imageItems.length === 0) {
        return null;
      }

      return (prev - 1 + imageItems.length) % imageItems.length;
    });
  }, [imageItems.length]);

  const goToNext = useCallback(() => {
    setFullscreenIndex((prev) => {
      if (prev === null || imageItems.length === 0) {
        return null;
      }

      return (prev + 1) % imageItems.length;
    });
  }, [imageItems.length]);

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
  }, [closeFullscreen, fullscreenIndex, goToNext, goToPrev]);

  const activeFullscreenPhoto = fullscreenIndex !== null ? imageItems[fullscreenIndex] : null;

  return (
    <SiteShell
      title="Galerie"
      description="Selecții mari, aerisite și editate într-un limbaj vizual elegant."
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <section className="space-y-8">
        <div className="max-w-3xl">
          <p className={siteConfig.theme.badge}>Galerie editorială</p>
          <p className={`mt-5 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
            Galeria păstrează exact datele din backend și le transformă într-un montaj aerisit, cu proporții variate și hover discret.
          </p>
        </div>

        {galleryTiles.length > 0 ? (
          <div className="grid auto-rows-[9.5rem] gap-4 md:grid-cols-12 md:auto-rows-[11rem] lg:gap-5">
            {galleryTiles.map((tile, index) => (
              <motion.article
                key={tile.id}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-[rgba(203,184,169,0.18)] bg-white/70 shadow-[0_12px_32px_rgba(43,43,43,0.05)] ${tile.spanClassName}`}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: index * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setFullscreenIndex(index)}
                  className="relative block h-full w-full text-left"
                >
                  <div className="relative h-full min-h-[18rem] overflow-hidden">
                    <Image
                      src={tile.imageUrl}
                      alt={tile.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-all duration-500 group-hover:scale-[1.05] group-hover:brightness-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent" />

                  </div>
                </button>
              </motion.article>
            ))}
          </div>
        ) : loading ? (
          <div className="grid auto-rows-[9.5rem] gap-4 md:grid-cols-12 md:auto-rows-[11rem] lg:gap-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <article
                key={`galerie-skeleton-${index}`}
                className={`overflow-hidden rounded-[1.75rem] border border-[rgba(203,184,169,0.14)] bg-white/65 animate-pulse ${index % 8 === 0
                  ? "md:col-span-6 md:row-span-2"
                  : index % 8 === 1
                    ? "md:col-span-3 md:row-span-1"
                    : index % 8 === 2
                      ? "md:col-span-3 md:row-span-2"
                      : index % 8 === 3
                        ? "md:col-span-4 md:row-span-1"
                        : index % 8 === 4
                          ? "md:col-span-4 md:row-span-2"
                          : index % 8 === 5
                            ? "md:col-span-4 md:row-span-1"
                            : index % 8 === 6
                              ? "md:col-span-6 md:row-span-1"
                              : "md:col-span-6 md:row-span-2"
                  }`}
              />
            ))}
          </div>
        ) : (
          <p className={`rounded-[1.5rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu există încă fotografii în galerie.
          </p>
        )}
      </section>

      <AnimatePresence>
        {activeFullscreenPhoto ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Vizualizare fotografie fullscreen"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-6 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFullscreen}
          >
            <button
              type="button"
              aria-label="Imagine anterioară"
              onClick={(event) => {
                event.stopPropagation();
                goToPrev();
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-[110] rounded-full border border-white/40 bg-black/40 sm:bg-white/25 px-4 py-3 text-xl font-semibold text-white backdrop-blur-xl transition hover:bg-black/50 sm:hover:bg-white/30 shadow-lg"
            >
              ‹
            </button>

            <motion.div
              className="relative max-h-full max-w-[96vw]"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.35 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Image
                src={activeFullscreenPhoto.imageUrl}
                alt={activeFullscreenPhoto.title || "Fotografie"}
                width={1600}
                height={1200}
                sizes="96vw"
                className="max-h-[90vh] w-auto max-w-[96vw] rounded-[1.25rem] object-contain"
                priority
              />
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {(fullscreenIndex ?? 0) + 1} / {imageItems.length}
              </p>
            </motion.div>

            <button
              type="button"
              aria-label="Imagine următoare"
              onClick={(event) => {
                event.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-[110] rounded-full border border-white/40 bg-black/40 sm:bg-white/25 px-4 py-3 text-xl font-semibold text-white backdrop-blur-xl transition hover:bg-black/50 sm:hover:bg-white/30 shadow-lg"
            >
              ›
            </button>

            <button
              type="button"
              aria-label="Închide"
              onClick={closeFullscreen}
              className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/20"
            >
              Închide
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SiteShell>
  );
}