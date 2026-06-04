"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type AlbumPhoto = {
  id: string;
  imageUrl: string;
  photoIndex: number;
};

type AlbumRow = {
  id: string;
  title: string;
  description: string;
  photos: AlbumPhoto[];
};

export default function AlbumePage() {
  const { content, loading } = useStudioContent();
  const [activeByAlbum, setActiveByAlbum] = useState<Record<string, number>>({});
  const [visibleCount, setVisibleCount] = useState(3);
  const [fullscreenState, setFullscreenState] = useState<{ albumId: string; photoIndex: number } | null>(null);

  const albumRows = useMemo<AlbumRow[]>(() => {
    return content.albums
      .map((album) => {
        const validPhotos = album.photos.filter((photo) => photo.trim().length > 0);

        return {
          id: album.id,
          title: album.title || "Album",
          description: album.description || "",
          photos: validPhotos.map((photo, photoIndex) => ({
            id: `${album.id}-${photoIndex}`,
            imageUrl: photo,
            photoIndex: photoIndex + 1,
          })),
        };
      })
      .filter((album) => album.photos.length > 0);
  }, [content.albums]);

  const safeActiveByAlbum = useMemo(() => {
    const next: Record<string, number> = {};

    albumRows.forEach((album) => {
      const current = activeByAlbum[album.id] ?? 0;
      next[album.id] = Math.min(current, album.photos.length - 1);
    });

    return next;
  }, [activeByAlbum, albumRows]);

  useEffect(() => {
    const setCountFromViewport = () => {
      const width = window.innerWidth;

      if (width < 640) {
        setVisibleCount(1);
        return;
      }

      if (width < 1024) {
        setVisibleCount(2);
        return;
      }

      if (width >= 1280) {
        setVisibleCount(5);
        return;
      }

      setVisibleCount(4);
    };

    setCountFromViewport();
    window.addEventListener("resize", setCountFromViewport);

    return () => window.removeEventListener("resize", setCountFromViewport);
  }, []);

  useEffect(() => {
    if (albumRows.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      setActiveByAlbum((prev) => {
        const next: Record<string, number> = { ...prev };

        albumRows.forEach((album) => {
          const current = prev[album.id] ?? 0;
          next[album.id] = (current + 1) % album.photos.length;
        });

        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [albumRows]);

  const goToPrev = useCallback((albumId: string, count: number) => {
    setActiveByAlbum((prev) => ({
      ...prev,
      [albumId]: ((prev[albumId] ?? 0) - 1 + count) % count,
    }));
  }, []);

  const goToNext = useCallback((albumId: string, count: number) => {
    setActiveByAlbum((prev) => ({
      ...prev,
      [albumId]: ((prev[albumId] ?? 0) + 1) % count,
    }));
  }, []);

  const openFullscreen = useCallback((albumId: string, photoIndex: number) => {
    setFullscreenState({ albumId, photoIndex });
  }, []);

  const closeFullscreen = useCallback(() => {
    setFullscreenState(null);
  }, []);

  const goToFullscreenPrev = useCallback(() => {
    setFullscreenState((prev) => {
      if (!prev) {
        return null;
      }

      const album = albumRows.find((row) => row.id === prev.albumId);

      if (!album || album.photos.length === 0) {
        return null;
      }

      return {
        ...prev,
        photoIndex: (prev.photoIndex - 1 + album.photos.length) % album.photos.length,
      };
    });
  }, [albumRows]);

  const goToFullscreenNext = useCallback(() => {
    setFullscreenState((prev) => {
      if (!prev) {
        return null;
      }

      const album = albumRows.find((row) => row.id === prev.albumId);

      if (!album || album.photos.length === 0) {
        return null;
      }

      return {
        ...prev,
        photoIndex: (prev.photoIndex + 1) % album.photos.length,
      };
    });
  }, [albumRows]);

  // Touch / swipe handling for album rows
  const touchStartRef = useRef<Record<string, number>>({});
  const touchLastRef = useRef<Record<string, number>>({});

  const handleTouchStart = useCallback((albumId: string, event: any) => {
    touchStartRef.current[albumId] = event.touches[0].clientX;
    touchLastRef.current[albumId] = event.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((albumId: string, event: any) => {
    touchLastRef.current[albumId] = event.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((albumId: string, count: number) => {
    const start = touchStartRef.current[albumId];
    const last = touchLastRef.current[albumId];

    if (typeof start !== "number" || typeof last !== "number") return;

    const delta = start - last;
    const threshold = 50; // pixels to consider a swipe

    if (delta > threshold) {
      goToNext(albumId, count);
    } else if (delta < -threshold) {
      goToPrev(albumId, count);
    }

    delete touchStartRef.current[albumId];
    delete touchLastRef.current[albumId];
  }, [goToNext, goToPrev]);

  // Fullscreen swipe handling
  const fsTouchStartRef = useRef<number | null>(null);
  const fsTouchLastRef = useRef<number | null>(null);

  const handleFullscreenTouchStart = useCallback((event: any) => {
    fsTouchStartRef.current = event.touches[0].clientX;
    fsTouchLastRef.current = event.touches[0].clientX;
  }, []);

  const handleFullscreenTouchMove = useCallback((event: any) => {
    fsTouchLastRef.current = event.touches[0].clientX;
  }, []);

  const handleFullscreenTouchEnd = useCallback(() => {
    const start = fsTouchStartRef.current;
    const last = fsTouchLastRef.current;
    if (typeof start !== "number" || typeof last !== "number") return;

    const delta = start - last;
    const threshold = 50;

    if (delta > threshold) {
      goToFullscreenNext();
    } else if (delta < -threshold) {
      goToFullscreenPrev();
    }

    fsTouchStartRef.current = null;
    fsTouchLastRef.current = null;
  }, [goToFullscreenNext, goToFullscreenPrev]);

  useEffect(() => {
    if (!fullscreenState) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeFullscreen();
      }

      if (event.key === "ArrowLeft") {
        goToFullscreenPrev();
      }

      if (event.key === "ArrowRight") {
        goToFullscreenNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreenState, closeFullscreen, goToFullscreenNext, goToFullscreenPrev]);

  const getVisibleSlides = (album: AlbumRow) => {
    const start = safeActiveByAlbum[album.id] ?? 0;
    const slots = Math.min(visibleCount, album.photos.length);

    return Array.from({ length: slots }, (_, slotIndex) => {
      const photoIndex = (start + slotIndex) % album.photos.length;
      return album.photos[photoIndex];
    });
  };

  const fullscreenAlbum = fullscreenState
    ? albumRows.find((row) => row.id === fullscreenState.albumId)
    : null;
  const fullscreenPhoto = fullscreenAlbum?.photos[fullscreenState?.photoIndex ?? -1];

  return (
    <SiteShell
      title="Albume"
      description="Secțiuni discrete, cu slideshow automat și fullscreen elegant."
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <section className="space-y-8">
        <div className="max-w-3xl">
          <p className={siteConfig.theme.badge}>Albume curatoriate</p>
          <p className={`mt-5 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
            Păstrăm aceeași logică de auto-scroll și fullscreen, dar o punem într-un context mai calm, mai curat și mai premium.
          </p>
        </div>

        {albumRows.length > 0 ? (
          <div className="space-y-6 lg:space-y-8">
            {albumRows.map((album) => {
              const visibleSlides = getVisibleSlides(album);

              return (
                <motion.article
                  key={album.id}
                  className="relative overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.22)] bg-white/72 shadow-[0_18px_48px_rgba(43,43,43,0.06)] backdrop-blur-sm"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6 }}
                >
                  <header className="flex flex-col gap-5 border-b border-[rgba(203,184,169,0.16)] px-5 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Album</p>
                      <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#2B2B2B] sm:text-3xl">{album.title}</h2>
                      {album.description ? <p className={`mt-3 text-sm ${siteConfig.theme.mutedText}`}>{album.description}</p> : null}
                    </div>

                    <div className="flex items-center gap-3">

                    </div>
                  </header>

                  {/* Desktop arrows: always visible on md+ */}
                  <button
                    type="button"
                    aria-label="Imagine anterioară"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrev(album.id, album.photos.length);
                    }}
                    className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full border border-[rgba(203,184,169,0.32)] bg-white/90 px-3 py-2 text-xl font-semibold text-[#2B2B2B] shadow-md hover:bg-white"
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    aria-label="Imagine următoare"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext(album.id, album.photos.length);
                    }}
                    className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 items-center justify-center rounded-full border border-[rgba(203,184,169,0.32)] bg-white/90 px-3 py-2 text-xl font-semibold text-[#2B2B2B] shadow-md hover:bg-white"
                  >
                    ›
                  </button>

                  <div
                    className="grid gap-3 p-3 sm:gap-4"
                    style={{ gridTemplateColumns: `repeat(${Math.min(visibleCount, album.photos.length)}, minmax(0, 1fr))` }}
                    onTouchStart={(e) => handleTouchStart(album.id, e)}
                    onTouchMove={(e) => handleTouchMove(album.id, e)}
                    onTouchEnd={() => handleTouchEnd(album.id, album.photos.length)}
                  >
                    {visibleSlides.map((slide, index) => (
                      <button
                        key={`${slide.id}-${index}`}
                        type="button"
                        onClick={() => openFullscreen(album.id, slide.photoIndex - 1)}
                        className="group relative overflow-hidden rounded-[1.5rem] text-left"
                      >
                        <div className="relative h-[40vh] min-h-[16rem] overflow-hidden sm:h-[34vh] lg:h-[42vh]">
                          <Image
                            src={slide.imageUrl}
                            alt={`${album.title} ${slide.photoIndex}`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                          <p className="absolute bottom-3 left-3 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                            {slide.photoIndex} / {album.photos.length}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        ) : loading ? (
          <div className="space-y-6 lg:space-y-8">
            {Array.from({ length: 2 }).map((_, index) => (
              <article
                key={`album-skeleton-${index}`}
                className="overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/72 shadow-[0_18px_48px_rgba(43,43,43,0.05)]"
              >
                <header className="border-b border-[rgba(203,184,169,0.16)] px-5 py-5 sm:px-6">
                  <div className={`h-6 w-1/3 rounded ${siteConfig.theme.softSurface} animate-pulse`} />
                  <div className={`mt-3 h-4 w-1/2 rounded ${siteConfig.theme.softSurface} animate-pulse`} />
                </header>

                <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 3 }).map((__, slotIndex) => (
                    <div
                      key={`album-skeleton-${index}-slot-${slotIndex}`}
                      className={`h-[30vh] min-h-[16rem] rounded-[1.5rem] ${siteConfig.theme.softSurface} animate-pulse`}
                    />
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={`rounded-[1.5rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu există încă fotografii în albume.
          </p>
        )}
      </section>

      <AnimatePresence>
        {fullscreenAlbum && fullscreenPhoto ? (
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
                goToFullscreenPrev();
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
              onTouchStart={handleFullscreenTouchStart}
              onTouchMove={handleFullscreenTouchMove}
              onTouchEnd={handleFullscreenTouchEnd}
            >
              <Image
                src={fullscreenPhoto.imageUrl}
                alt={fullscreenAlbum.title}
                width={1600}
                height={1200}
                className="max-h-[90vh] w-auto max-w-[96vw] rounded-[1.25rem] object-contain"
                priority
              />
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {(fullscreenState?.photoIndex ?? 0) + 1} / {fullscreenAlbum.photos.length}
              </p>
            </motion.div>

            <button
              type="button"
              aria-label="Imagine următoare"
              onClick={(event) => {
                event.stopPropagation();
                goToFullscreenNext();
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