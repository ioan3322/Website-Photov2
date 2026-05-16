"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useCallback, useEffect, useMemo, useState, type MouseEvent } from "react";
import HeroSlideshow, { type HeroSlide } from "@/app/components/ui/HeroSlideshow";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type FeaturedAlbum = {
  id: string;
  title: string;
  description: string;
  photos: string[];
};

type PortfolioTile = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  spanClassName: string;
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const services = [
  {
    title: "Nou-născuți",
    description: "Ședințe calme, cu lumină blândă și ritm atent, pentru cadre intime și delicate.",
  },
  {
    title: "Bebeluși",
    description: "Momente naturale, expresii sincere și imagini curate, cu focus pe emoție și conexiune.",
  },
  {
    title: "Familie",
    description: "Portrete elegante, aerisite, construite pentru a păstra apropierea și căldura fiecărei familii.",
  },
  {
    title: "Maternitate",
    description: "Cadre editoriale cu volum, liniște și feminitate, gândite pentru o estetică premium.",
  },
];

const testimonials = [
  {
    name: "Ana M.",
    text: "Totul a fost foarte liniștit și elegant. Fotografiile au un aer cald, premium și natural.",
  },
  {
    name: "Ioana P.",
    text: "Am simțit că fiecare detaliu contează. Rezultatul arată ca o poveste vizuală, nu doar o ședință foto.",
  },
  {
    name: "Darius T.",
    text: "Comunicare clară, experiență plăcută și imagini care chiar transmit emoție.",
  },
];

export default function AcasaPage() {
  const { content, loading } = useStudioContent();
  const prefersReducedMotion = useReducedMotion();
  const [tiltByAlbum, setTiltByAlbum] = useState<Record<string, { rotateX: number; rotateY: number }>>({});
  const [fullscreenAlbum, setFullscreenAlbum] = useState<{ albumId: string; photoIndex: number } | null>(null);

  const featuredAlbums = useMemo<FeaturedAlbum[]>(() => {
    return content.albums
      .filter((album) => (album.showOnHome ?? true) && album.photos.some((photo) => photo.trim().length > 0))
      .slice(0, 3)
      .map((album) => ({
        id: album.id,
        title: album.title || "Album",
        description: album.description || "Selecție editorială pentru homepage",
        photos: album.photos.filter((photo) => photo.trim().length > 0),
      }));
  }, [content.albums]);

  const heroSlides = useMemo<HeroSlide[]>(() => {
    const candidateSlides: HeroSlide[] = [
      ...content.gallery
        .filter((item) => (item.showOnHome ?? true) && item.imageUrl.trim().length > 0)
        .map((item) => ({
          id: `gallery-${item.id}`,
          src: item.imageUrl,
          alt: item.title || item.caption || "Fotografie de prezentare",
        })),
      ...featuredAlbums.flatMap((album) =>
        album.photos.slice(0, 1).map((photo, index) => ({
          id: `album-${album.id}-${index}`,
          src: photo,
          alt: album.title,
        })),
      ),
      ...content.photographerPhotos
        .filter((photo) => photo.trim().length > 0)
        .map((photo, index) => ({
          id: `photographer-${index}`,
          src: photo,
          alt: `Fotograf ${index + 1}`,
        })),
    ];

    const seen = new Set<string>();

    return candidateSlides.filter((slide) => {
      if (seen.has(slide.src)) {
        return false;
      }

      seen.add(slide.src);
      return true;
    }).slice(0, 6);
  }, [content.gallery, content.photographerPhotos, featuredAlbums]);

  const portfolioTiles = useMemo<PortfolioTile[]>(() => {
    const tiles = content.gallery
      .filter((item) => (item.showOnHome ?? true) && item.imageUrl.trim().length > 0)
      .slice(0, 8)
      .map((item, index) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        title: item.title || `Fotografie ${index + 1}`,
        caption: item.caption || "Cadru selectat pentru prezentare",
        spanClassName:
          index === 0
            ? "md:col-span-7 md:row-span-2"
            : index === 1
              ? "md:col-span-5 md:row-span-1"
              : index === 2
                ? "md:col-span-4 md:row-span-1"
                : index === 3
                  ? "md:col-span-3 md:row-span-2"
                  : index === 4
                    ? "md:col-span-5 md:row-span-2"
                    : index === 5
                      ? "md:col-span-4 md:row-span-1"
                      : index === 6
                        ? "md:col-span-4 md:row-span-1"
                        : "md:col-span-8 md:row-span-1",
      }));

    return tiles;
  }, [content.gallery]);

  const activeFullscreenAlbum = fullscreenAlbum
    ? featuredAlbums.find((album) => album.id === fullscreenAlbum.albumId)
    : null;
  const activeFullscreenPhoto = activeFullscreenAlbum?.photos[fullscreenAlbum?.photoIndex ?? -1];

  const openAlbumFullscreen = (albumId: string) => {
    setFullscreenAlbum({ albumId, photoIndex: 0 });
  };

  const closeAlbumFullscreen = useCallback(() => {
    setFullscreenAlbum(null);
  }, []);

  const goToPrevPhoto = useCallback(() => {
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
  }, [featuredAlbums]);

  const goToNextPhoto = useCallback(() => {
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
  }, [featuredAlbums]);

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
  }, [closeAlbumFullscreen, fullscreenAlbum, goToNextPhoto, goToPrevPhoto]);

  const updateTilt = (albumId: string, event: MouseEvent<HTMLButtonElement>) => {
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

  const stackMotion = prefersReducedMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10%" },
        transition: { duration: 0.7 },
      };

  return (
    <SiteShell
      title="Acasă"
      description="Studio foto premium pentru bebeluși, familie și maternitate."
      showHeader={false}
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <div className="-mt-24 sm:-mt-28">
        <HeroSlideshow slides={heroSlides} loading={loading} />
      </div>

      <motion.section className="mt-20 sm:mt-24" {...(stackMotion ?? {})}>
        <div className="mx-auto max-w-4xl text-center">
          <p className={siteConfig.theme.badge}>Servicii</p>
          <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
            Ședințe construite ca o experiență, nu ca un simplu serviciu.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <motion.article
              key={service.title}
              className="rounded-[1.75rem] border border-[rgba(203,184,169,0.22)] bg-white/70 p-6 shadow-[0_12px_36px_rgba(43,43,43,0.05)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, delay: index * 0.06 }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">0{index + 1}</p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight text-[#2B2B2B]">{service.title}</h3>
              <p className={`mt-4 text-sm ${siteConfig.theme.mutedText}`}>{service.description}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="mt-24 sm:mt-28" {...(stackMotion ?? {})}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={siteConfig.theme.badge}>Albume</p>
            <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
              We all love the babyes 
            </h2>
          </div>
         
        </div>

        {featuredAlbums.length > 0 || loading ? (
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {loading && featuredAlbums.length === 0
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`album-skeleton-${index}`}
                    className="overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/65 p-4 shadow-[0_12px_36px_rgba(43,43,43,0.05)]"
                  >
                    <div className="relative h-[28rem] overflow-hidden rounded-[1.5rem] bg-[#efe8e1] animate-pulse" />
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
                    <motion.button
                      key={album.id}
                      type="button"
                      onClick={() => openAlbumFullscreen(album.id)}
                      onMouseMove={(event) => updateTilt(album.id, event)}
                      onMouseLeave={() => resetTilt(album.id)}
                      className="group text-left"
                      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div
                        className="rounded-[2rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 shadow-[0_16px_40px_rgba(43,43,43,0.06)] backdrop-blur-sm transition-transform duration-300"
                        style={{ transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)` }}
                      >
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#efe7df]">
                          <div className="absolute inset-0 translate-x-4 translate-y-4 overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/70">
                            <Image
                              src={stackPhotos[2]}
                              alt=""
                              aria-hidden="true"
                              fill
                              sizes="(max-width: 1024px) 92vw, 28vw"
                              className="object-cover opacity-35 blur-[0.35px] saturate-75"
                            />
                          </div>
                          <div className="absolute inset-0 translate-x-2 translate-y-2 overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/75">
                            <Image
                              src={stackPhotos[1]}
                              alt=""
                              aria-hidden="true"
                              fill
                              sizes="(max-width: 1024px) 92vw, 28vw"
                              className="object-cover opacity-55 saturate-90"
                            />
                          </div>
                          <Image
                            src={album.photos[0]}
                            alt={album.title}
                            fill
                            sizes="(max-width: 1024px) 92vw, 28vw"
                            className="object-cover transition-all duration-500 group-hover:scale-[1.04] group-hover:brightness-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/24 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                           
                            <h3 className="mt-2 text-2xl font-medium tracking-tight text-white">{album.title}</h3>
                            <p className="mt-2 text-sm text-white/80">{album.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
          </div>
        ) : (
          <p className={`mt-8 rounded-[1.5rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu există încă albume selectate pentru homepage.
          </p>
        )}
      </motion.section>

      <motion.section className="mt-24 sm:mt-28" {...(stackMotion ?? {})}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className={siteConfig.theme.badge}>Portofoliu</p>
            <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
              Fotograf nou-nascuţi, copii, familie, gravide in Timișoara
            </h2>
          </div>
          <p className={`max-w-xl text-sm sm:text-base ${siteConfig.theme.mutedText}`}>
            Structura este aerisită, cu proporții variate și hover discret, ca să păstrăm energia premium fără efecte Pinterest.
          </p>
        </div>

        {portfolioTiles.length > 0 ? (
          <div className="mt-10 grid auto-rows-[10rem] gap-4 md:grid-cols-12 md:auto-rows-[12rem]">
            {portfolioTiles.map((tile, index) => (
              <motion.article
                key={tile.id}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-[rgba(203,184,169,0.18)] bg-white/70 shadow-[0_12px_32px_rgba(43,43,43,0.05)] ${tile.spanClassName}`}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.65, delay: index * 0.05 }}
              >
                <Image
                  src={tile.imageUrl}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-all duration-500 group-hover:scale-[1.05] group-hover:brightness-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 rounded-[1.25rem] border border-white/20 bg-white/60 p-4 text-left backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#6f645a]">Fotografie {index + 1}</p>
                  <p className="mt-2 text-sm font-medium text-[#2B2B2B]">{tile.title}</p>
                  <p className={`mt-1 text-xs ${siteConfig.theme.mutedText}`}>{tile.caption}</p>
                </div>
              </motion.article>
            ))}
          </div>
        ) : loading ? (
          <div className="mt-10 grid auto-rows-[10rem] gap-4 md:grid-cols-12 md:auto-rows-[12rem]">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`home-photo-skeleton-${index}`}
                className={`rounded-[1.75rem] border border-[rgba(203,184,169,0.14)] bg-white/65 ${
                  index === 0
                    ? "md:col-span-7 md:row-span-2"
                    : index === 1
                      ? "md:col-span-5 md:row-span-1"
                      : index === 2
                        ? "md:col-span-4 md:row-span-1"
                        : index === 3
                          ? "md:col-span-3 md:row-span-2"
                          : index === 4
                            ? "md:col-span-5 md:row-span-2"
                            : index === 5
                              ? "md:col-span-4 md:row-span-1"
                              : index === 6
                                ? "md:col-span-4 md:row-span-1"
                                : "md:col-span-8 md:row-span-1"
                } animate-pulse`}
              />
            ))}
          </div>
        ) : (
          <p className={`mt-8 rounded-[1.5rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu există încă elemente marcate pentru homepage. Selectează fotografii sau albume din admin.
          </p>
        )}
      </motion.section>

      <motion.section className="mt-24 sm:mt-28" {...(stackMotion ?? {})}>
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/70 p-4 shadow-[0_16px_42px_rgba(43,43,43,0.05)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-[#efe7df]">
              {content.photographerPhotos.find((photo) => photo.trim().length > 0) || heroSlides[0]?.src ? (
                <Image
                  src={content.photographerPhotos.find((photo) => photo.trim().length > 0) || heroSlides[0]?.src || ""}
                  alt="Fotograf"
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              ) : null}
            </div>
          </div>

          <div className="max-w-2xl">
            <p className={siteConfig.theme.badge}>Despre studio</p>
            <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
              Un ritm calm, un stil editorial și imagini care rămân relevante în timp.
            </h2>
            <p className={`mt-6 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
              Am construit această experiență pentru familii care își doresc fotografii curate, elegante și emoționale.
              Accentul cade pe confort, lumină și o direcție vizuală care pune în valoare relația dintre oameni, nu artificiul.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[rgba(203,184,169,0.22)] bg-white/65 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Stil</p>
                <p className="mt-2 text-sm font-medium text-[#2B2B2B]">Minimalist, luminos, atemporal</p>
              </div>
              <div className="rounded-[1.5rem] border border-[rgba(203,184,169,0.22)] bg-white/65 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Atmosferă</p>
                <p className="mt-2 text-sm font-medium text-[#2B2B2B]">Calm, răbdare și îndrumare atentă</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section className="mt-24 sm:mt-28" {...(stackMotion ?? {})}>
        <div className="mx-auto max-w-4xl text-center">
          <p className={siteConfig.theme.badge}>Recenzii</p>
          <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
            O experiență premium, spusă de familii reale.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testimonials.map((review, index) => (
            <motion.article
              key={review.name}
              className="rounded-[1.75rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_12px_34px_rgba(43,43,43,0.05)] backdrop-blur-sm"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.65, delay: index * 0.06 }}
            >
              <p className="text-4xl leading-none text-[#c7b39f]">“</p>
              <p className={`mt-3 text-base ${siteConfig.theme.mutedText}`}>{review.text}</p>
              <p className="mt-6 text-sm font-medium tracking-wide text-[#2B2B2B]">{review.name}</p>
            </motion.article>
          ))}
        </div>
      </motion.section>

      <motion.section className="mt-24 sm:mt-28 pb-8" {...(stackMotion ?? {})}>
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[rgba(203,184,169,0.22)] bg-[#2B2B2B] px-6 py-14 text-white shadow-[0_28px_80px_rgba(43,43,43,0.18)] sm:px-10 sm:py-16 lg:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(203,184,169,0.3),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.18),_transparent_32%)]" />
          <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/70">Rezervări</p>
              <h2 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                Dacă vrei o sesiune foto cu atmosferă caldă și rezultate elegante, putem construi împreună experiența potrivită.
              </h2>
            </div>
            <div className="flex flex-col gap-3 lg:items-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-medium text-[#2B2B2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#faf8f5]"
              >
                Rezervă ședința
              </Link>
              <p className="text-sm text-white/72">Email: andreea.albo@gmail.com · Telefon: 0724430533</p>
            </div>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {activeFullscreenAlbum && activeFullscreenPhoto ? (
          <motion.div
            key="album-fullscreen"
            role="dialog"
            aria-modal="true"
            aria-label="Vizualizare album fullscreen"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-3 py-6 sm:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAlbumFullscreen}
          >
            <button
              type="button"
              aria-label="Imagine anterioară"
              onClick={(event) => {
                event.stopPropagation();
                goToPrevPhoto();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xl font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:left-6"
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
                src={activeFullscreenPhoto}
                alt={activeFullscreenAlbum.title}
                width={1600}
                height={1200}
                className="max-h-[90vh] w-auto max-w-[96vw] rounded-[1.25rem] object-contain"
                priority
              />
              <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {(fullscreenAlbum?.photoIndex ?? 0) + 1} / {activeFullscreenAlbum.photos.length}
              </p>
            </motion.div>

            <button
              type="button"
              aria-label="Imagine următoare"
              onClick={(event) => {
                event.stopPropagation();
                goToNextPhoto();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/10 px-4 py-3 text-xl font-semibold text-white backdrop-blur-xl transition hover:bg-white/20 sm:right-6"
            >
              ›
            </button>

            <button
              type="button"
              aria-label="Închide"
              onClick={closeAlbumFullscreen}
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