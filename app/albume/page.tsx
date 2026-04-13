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
  const { content } = useStudioContent();
  const [activeByAlbum, setActiveByAlbum] = useState<Record<string, number>>({});
  const [visibleCount, setVisibleCount] = useState(3);

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

      if (width >= 1200) {
        setVisibleCount(4);
        return;
      }

      setVisibleCount(3);
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

  const getVisibleSlides = (album: AlbumRow) => {
    const start = activeByAlbum[album.id] ?? 0;
    const slots = Math.min(visibleCount, album.photos.length);

    return Array.from({ length: slots }, (_, slotIndex) => {
      const photoIndex = (start + slotIndex) % album.photos.length;
      return album.photos[photoIndex];
    });
  };

  return (
    <SiteShell
      title="Albume"
      description="Fotografiile ruleaza automat de la dreapta la stanga."
      containerClassName="mx-auto w-full max-w-none px-0 py-0"
    >
      {albumRows.length > 0 ? (
        <section className="space-y-6 bg-white px-3 py-4 md:space-y-8 md:p-6">
          {albumRows.map((album) => {
            const visibleSlides = getVisibleSlides(album);

            return (
              <article key={album.id} className="relative overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                <header className="border-b border-rose-100 px-4 py-4 text-slate-900 md:px-5">
                  <h2 className="text-lg font-semibold tracking-tight md:text-2xl">{album.title}</h2>
                  {album.description ? (
                    <p className="mt-1 text-sm text-slate-600">{album.description}</p>
                  ) : null}
                </header>

                <div
                  className="grid h-[54vh] min-h-[340px] gap-1 p-1 sm:h-[48vh] md:h-[42vh]"
                  style={{ gridTemplateColumns: `repeat(${Math.min(visibleCount, album.photos.length)}, minmax(0, 1fr))` }}
                >
                  {visibleSlides.map((slide, index) => (
                    <div key={`${slide.id}-${index}`} className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={slide.imageUrl}
                        alt={`${album.title} ${slide.photoIndex}`}
                        className="h-full w-full object-cover"
                      />
                      <p className="absolute bottom-2 left-2 rounded bg-black/45 px-2 py-1 text-xs font-medium text-white">
                        {slide.photoIndex} / {album.photos.length}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToPrev(album.id, album.photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-rose-200 bg-white/90 px-3 py-2 text-sm font-semibold text-rose-700 backdrop-blur transition hover:bg-white"
                >
                  Inapoi
                </button>

                <button
                  type="button"
                  onClick={() => goToNext(album.id, album.photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-rose-200 bg-white/90 px-3 py-2 text-sm font-semibold text-rose-700 backdrop-blur transition hover:bg-white"
                >
                  Inainte
                </button>
              </article>
            );
          })}
        </section>
      ) : (
        <p className={`m-6 rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
          Nu exista inca fotografii in albume.
        </p>
      )}
    </SiteShell>
  );
}
