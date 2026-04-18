"use client";

import { useEffect, useMemo, useState } from "react";
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

      if (width >= 1600) {
        setVisibleCount(5);
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
      setActiveByAlbum({});
      return;
    }

    // Auto-scroll each album row from right to left.
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

  useEffect(() => {
    setActiveByAlbum((prev) => {
      const next: Record<string, number> = {};

      albumRows.forEach((album) => {
        const current = prev[album.id] ?? 0;
        next[album.id] = Math.min(current, album.photos.length - 1);
      });

      return next;
    });
  }, [albumRows]);

  const goToPrev = (albumId: string, count: number) => {
    setActiveByAlbum((prev) => ({
      ...prev,
      [albumId]: ((prev[albumId] ?? 0) - 1 + count) % count,
    }));
  };

  const goToNext = (albumId: string, count: number) => {
    setActiveByAlbum((prev) => ({
      ...prev,
      [albumId]: ((prev[albumId] ?? 0) + 1) % count,
    }));
  };

  const openFullscreen = (albumId: string, photoIndex: number) => {
    setFullscreenState({ albumId, photoIndex });
  };

  const closeFullscreen = () => {
    setFullscreenState(null);
  };

  const goToFullscreenPrev = () => {
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
  };

  const goToFullscreenNext = () => {
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
  };

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
  }, [fullscreenState, albumRows]);

  const getVisibleSlides = (album: AlbumRow) => {
    const start = activeByAlbum[album.id] ?? 0;
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
      description="Fotografiile ruleaza automat de la dreapta la stanga."
      containerClassName="mx-auto w-full max-w-8xl px-4 py-10 sm:px-6 sm:py-12 lg:py-14"
    >
      {albumRows.length > 0 ? (
        <section className="space-y-8 bg-white/70 px-2 py-2 md:space-y-10 md:p-4">
          {albumRows.map((album) => {
            const visibleSlides = getVisibleSlides(album);

            return (
              <article key={album.id} className="relative overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-md shadow-rose-100/40 transition-all duration-300 hover:shadow-lg">
                <header className="border-b border-rose-100 px-4 py-4 text-slate-900 md:px-5">
                  <h2 className="text-xl font-semibold tracking-tight md:text-3xl">{album.title}</h2>
                  {album.description ? (
                    <p className="mt-2 text-sm text-slate-600 md:text-base">{album.description}</p>
                  ) : null}
                </header>

                <div
                  className="grid h-[54vh] min-h-[340px] gap-1 p-1 sm:h-[48vh] md:h-[42vh]"
                  style={{ gridTemplateColumns: `repeat(${Math.min(visibleCount, album.photos.length)}, minmax(0, 1fr))` }}
                >
                  {visibleSlides.map((slide, index) => (
                    <button
                      key={`${slide.id}-${index}`}
                      type="button"
                      onClick={() => openFullscreen(album.id, slide.photoIndex - 1)}
                      className="group relative overflow-hidden text-left"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.imageUrl}
                        alt={`${album.title} ${slide.photoIndex}`}
                        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.03] group-hover:brightness-[1.03]"
                      />
                      <p className="absolute bottom-2 left-2 rounded bg-black/45 px-2 py-1 text-xs font-medium text-white">
                        {slide.photoIndex} / {album.photos.length}
                      </p>
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPrev(album.id, album.photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-rose-200 bg-white/90 px-3 py-2 text-sm font-semibold text-rose-700 backdrop-blur transition-all duration-300 hover:-translate-y-1/2 hover:bg-white hover:shadow"
                >
                  Inapoi
                </button>

                <button
                  type="button"
                  onClick={() => goToNext(album.id, album.photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-rose-200 bg-white/90 px-3 py-2 text-sm font-semibold text-rose-700 backdrop-blur transition-all duration-300 hover:-translate-y-1/2 hover:bg-white hover:shadow"
                >
                  inainte
                </button>
              </article>
            );
          })}
        </section>
      ) : loading ? (
        <section className="space-y-8 bg-white/70 px-2 py-2 md:space-y-10 md:p-4">
          {Array.from({ length: 2 }).map((_, index) => (
            <article key={`album-skeleton-${index}`} className="relative overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
              <header className="border-b border-rose-100 px-4 py-4 text-slate-900 md:px-5">
                <div className={`h-6 w-1/3 rounded ${siteConfig.theme.softSurface}`} />
                <div className={`mt-2 h-4 w-1/2 rounded ${siteConfig.theme.softSurface}`} />
              </header>

              <div className="grid h-[54vh] min-h-[340px] grid-cols-2 gap-1 p-1 sm:h-[48vh] md:h-[42vh] md:grid-cols-3">
                {Array.from({ length: 3 }).map((__, slotIndex) => (
                  <div key={`album-skeleton-${index}-slot-${slotIndex}`} className={`h-full w-full ${siteConfig.theme.softSurface} animate-pulse`} />
                ))}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className={`m-6 rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
          Nu exista inca fotografii in albume.
        </p>
      )}

      {fullscreenAlbum && fullscreenPhoto ? (
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
              goToFullscreenPrev();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 px-4 py-3 text-xl font-semibold text-white backdrop-blur transition hover:bg-black/50 sm:left-6"
          >
            ‹
          </button>

          <div className="relative max-h-full max-w-[96vw]" onClick={(event) => event.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenPhoto.imageUrl}
              alt={`${fullscreenAlbum.title} ${fullscreenPhoto.photoIndex}`}
              className="max-h-[90vh] w-auto max-w-[96vw] rounded-xl object-contain shadow-2xl"
            />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
              {fullscreenPhoto.photoIndex} / {fullscreenAlbum.photos.length}
            </p>
          </div>

          <button
            type="button"
            aria-label="Imagine urmatoare"
            onClick={(event) => {
              event.stopPropagation();
              goToFullscreenNext();
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
