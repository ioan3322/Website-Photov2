"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Container from "@/app/components/ui/Container";
import RevealOnScroll from "@/app/components/ui/RevealOnScroll";
import Section from "@/app/components/ui/Section";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type HomeCard = {
  id: string;
  imageUrl: string;
  kind: "photo" | "album";
  href?: string;
};

type FeaturedAlbum = {
  id: string;
  title: string;
  description: string;
  photos: string[];
};

export default function AcasaPage() {
  const { content, loading } = useStudioContent();
  const [tiltByAlbum, setTiltByAlbum] = useState<Record<string, { rotateX: number; rotateY: number }>>({});
  const [fullscreenAlbum, setFullscreenAlbum] = useState<{ albumId: string; photoIndex: number } | null>(null);

  const featuredAlbums = useMemo<FeaturedAlbum[]>(() => {
    return content.albums
      .filter((album) => (album.showOnHome ?? true) && album.photos.some((photo) => photo.trim().length > 0))
      .slice(0, 3)
      .map((album) => ({
        id: album.id,
        title: album.title || "Album",
        description: album.description || "Album selectat pentru pagina Home",
        photos: album.photos.filter((photo) => photo.trim().length > 0),
      }));
  }, [content.albums]);

  const cards = useMemo<HomeCard[]>(() => {
    const galleryCards = content.gallery
      .filter((item) => (item.showOnHome ?? true) && item.imageUrl.trim().length > 0)
      .map((item) => ({
        id: `gallery-${item.id}`,
        imageUrl: item.imageUrl,
        kind: "photo" as const,
      }));

    return galleryCards;
  }, [content]);

  const activeFullscreenAlbum = fullscreenAlbum
    ? featuredAlbums.find((album) => album.id === fullscreenAlbum.albumId)
    : null;
  const activeFullscreenPhoto = activeFullscreenAlbum?.photos[fullscreenAlbum?.photoIndex ?? -1];

  const openAlbumFullscreen = (albumId: string) => {
    setFullscreenAlbum({ albumId, photoIndex: 0 });
  };

  const closeAlbumFullscreen = () => {
    setFullscreenAlbum(null);
  };

  const goToPrevPhoto = () => {
    setFullscreenAlbum((prev) => {
      if (!prev) {
        return null;
      }

      const album = featuredAlbums.find((item) => item.id === prev.albumId);
      if (!album || album.photos.length === 0) {
        return null;
      }

      return {
        ...prev,
        photoIndex: (prev.photoIndex - 1 + album.photos.length) % album.photos.length,
      };
    });
  };

  const goToNextPhoto = () => {
    setFullscreenAlbum((prev) => {
      if (!prev) {
        return null;
      }

      const album = featuredAlbums.find((item) => item.id === prev.albumId);
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
    if (!fullscreenAlbum) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeAlbumFullscreen();
      }

      if (event.key === "ArrowLeft") {
        goToPrevPhoto();
      }

      if (event.key === "ArrowRight") {
        goToNextPhoto();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreenAlbum, featuredAlbums]);

  const updateTilt = (albumId: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 8;
    const rotateX = (0.5 - y) * 8;

    setTiltByAlbum((prev) => ({
      ...prev,
      [albumId]: { rotateX, rotateY },
    }));
  };

  const resetTilt = (albumId: string) => {
    setTiltByAlbum((prev) => ({
      ...prev,
      [albumId]: { rotateX: 0, rotateY: 0 },
    }));
  };

  return (
    <SiteShell
      title="Acasa"
      description="Studio foto pentru bebelusi, cu sedinte in siguranta si cadre naturale."
      containerClassName="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:py-16"
    >
      <Container>
        <RevealOnScroll>
          <Section className="space-y-6 text-center">
            <p className={siteConfig.theme.badge}>
              Studio foto pentru bebelusi
            </p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Momente mici, amintiri pentru o viata
            </h1>
            <p className={`max-w-3xl text-lg ${siteConfig.theme.mutedText}`}>
              Sedinte foto cu setup profesional, lumina blanda si mult confort pentru bebelus.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-rose-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-lg sm:w-auto"
              >
                Contact
              </Link>
              <Link
                href="/recenzii"
                className="inline-flex w-full items-center justify-center rounded-2xl border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-50 sm:w-auto"
              >
                Recenzii
              </Link>
            </div>
          </Section>
        </RevealOnScroll>

        {featuredAlbums.length > 0 || loading ? (
          <RevealOnScroll className="mt-14">
            <Section title="Albume alese de admin">
              <div className="grid justify-center gap-6 [grid-template-columns:repeat(auto-fit,minmax(180px,220px))]">
            {loading && featuredAlbums.length === 0
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div key={`album-skeleton-${index}`} className="block text-center [perspective:1200px]">
                    <div className="relative transition-transform duration-200 ease-out">
                      <div className="relative h-[280px]">
                        <div className="absolute inset-0 translate-x-4 translate-y-4 overflow-hidden rounded-[1.6rem] border border-rose-200/70 bg-rose-100/50" />
                        <div className="absolute inset-0 translate-x-2 translate-y-2 overflow-hidden rounded-[1.6rem] border border-rose-200/80 bg-rose-100/70" />
                        <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-rose-200 bg-rose-100">
                          <div className="absolute bottom-0 left-0 top-0 z-10 w-4 bg-gradient-to-r from-rose-300/40 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : featuredAlbums.map((album) => {
                  const tilt = tiltByAlbum[album.id] ?? { rotateX: 0, rotateY: 0 };
                  const stackPhotos = [
                    album.photos[0],
                    album.photos[1] || album.photos[0],
                    album.photos[2] || album.photos[1] || album.photos[0],
                  ];

                  return (
                    <button
                      key={album.id}
                      type="button"
                      onClick={() => openAlbumFullscreen(album.id)}
                      onMouseMove={(event) => updateTilt(album.id, event)}
                      onMouseLeave={() => resetTilt(album.id)}
                      className="group block text-center transition-all duration-300 hover:-translate-y-1 [perspective:1200px]"
                    >
                      <div
                        className="relative transition-transform duration-200 ease-out"
                        style={{ transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)` }}
                      >
                        <div className="relative h-[280px]">
                          <div className="absolute inset-0 translate-x-4 translate-y-4 overflow-hidden rounded-[1.6rem] border border-rose-200/70 bg-white/95">
                            <Image
                              src={stackPhotos[2]}
                              alt=""
                              aria-hidden="true"
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                              className="object-cover opacity-35 blur-[0.5px] saturate-75"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-200/20 via-white/25 to-transparent" />
                          </div>
                          <div className="absolute inset-0 translate-x-2 translate-y-2 overflow-hidden rounded-[1.6rem] border border-rose-200/80 bg-white/95">
                            <Image
                              src={stackPhotos[1]}
                              alt=""
                              aria-hidden="true"
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                              className="object-cover opacity-55 saturate-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                          </div>

                          <div className="relative h-full overflow-hidden rounded-[1.6rem] border border-rose-200 bg-white shadow-md shadow-rose-100/50">
                            <div className="absolute bottom-0 left-0 top-0 z-10 w-4 bg-gradient-to-r from-rose-300/70 to-transparent" />
                            <Image
                              src={album.photos[0]}
                              alt={album.title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
                              className="object-cover transition-all duration-300 group-hover:scale-[1.04] group-hover:brightness-[1.03]"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>
          </RevealOnScroll>
        ) : null}

        <RevealOnScroll className="mt-14">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Explorează</h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="mt-10">
          <Section>
        {cards.length > 0 ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
            {cards.map((card) => {
              const CardBody = (
                <article className="mb-6 break-inside-avoid">
                  <div className="overflow-hidden rounded-2xl bg-slate-100 transition-all duration-300 hover:-translate-y-0.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={card.imageUrl}
                      alt=""
                      aria-hidden="true"
                      className="h-auto w-full object-cover transition-all duration-300 hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                </article>
              );

              if (card.href) {
                return (
                  <Link key={card.id} href={card.href} className="block">
                    {CardBody}
                  </Link>
                );
              }

              return <div key={card.id}>{CardBody}</div>;
            })}
          </div>
        ) : loading ? (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <article
                key={`home-photo-skeleton-${index}`}
                className="mb-6 break-inside-avoid overflow-hidden rounded-2xl bg-rose-100/70 animate-pulse"
              >
                <div
                  className="w-full bg-gradient-to-br from-rose-100 via-rose-50 to-amber-50"
                  style={{ height: `${220 + (index % 4) * 40}px` }}
                />
              </article>
            ))}
          </div>
        ) : (
          <p className={`rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu exista inca elemente bifate pentru Home. Selecteaza fotografii sau albume din panoul Admin.
          </p>
        )}
          </Section>
        </RevealOnScroll>

        <RevealOnScroll className="mt-8">
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="inline-flex w-full max-w-md items-center justify-center rounded-2xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-rose-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-700 hover:shadow-lg sm:w-auto"
            >
              Contact
            </Link>
          </div>
        </RevealOnScroll>
      </Container>

      {activeFullscreenAlbum && activeFullscreenPhoto ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Vizualizare album fullscreen"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-3 py-6 sm:px-8"
          onClick={closeAlbumFullscreen}
        >
          <button
            type="button"
            aria-label="Imagine anterioara"
            onClick={(event) => {
              event.stopPropagation();
              goToPrevPhoto();
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 px-4 py-3 text-xl font-semibold text-white backdrop-blur transition hover:bg-black/50 sm:left-6"
          >
            ‹
          </button>

          <div className="relative max-h-full max-w-[96vw]" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activeFullscreenPhoto}
              alt={activeFullscreenAlbum.title}
              width={1600}
              height={1200}
              className="max-h-[90vh] w-auto max-w-[96vw] rounded-xl object-contain"
              priority
            />
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
              {(fullscreenAlbum?.photoIndex ?? 0) + 1} / {activeFullscreenAlbum.photos.length}
            </p>
          </div>

          <button
            type="button"
            aria-label="Imagine urmatoare"
            onClick={(event) => {
              event.stopPropagation();
              goToNextPhoto();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/40 bg-black/30 px-4 py-3 text-xl font-semibold text-white backdrop-blur transition hover:bg-black/50 sm:right-6"
          >
            ›
          </button>

          <button
            type="button"
            aria-label="Inchide"
            onClick={closeAlbumFullscreen}
            className="absolute right-4 top-4 rounded-full border border-white/40 bg-black/30 px-3 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-black/50"
          >
            Inchide
          </button>
        </div>
      ) : null}
    </SiteShell>
  );
}
