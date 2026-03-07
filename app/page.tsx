"use client";

import { useEffect, useMemo, useState } from "react";
import { useStudioContent } from "@/hooks/useStudioContent";

type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
};

type AlbumItem = {
  id: string;
  title: string;
  description: string;
  photos: string[];
};

type SiteContent = {
  gallery: GalleryItem[];
  albums: AlbumItem[];
  photographerPhotos: string[];
};

const defaultContent: SiteContent = {
  gallery: [
    { id: "gallery-0", title: "Nou-născut", caption: "Cadru de prezentare", imageUrl: "" },
    { id: "gallery-1", title: "Somn liniștit", caption: "Cadru de prezentare", imageUrl: "" },
    { id: "gallery-2", title: "Portret de familie", caption: "Cadru de prezentare", imageUrl: "" },
    { id: "gallery-3", title: "Detalii mici", caption: "Cadru de prezentare", imageUrl: "" },
    { id: "gallery-4", title: "Primul zâmbet", caption: "Cadru de prezentare", imageUrl: "" },
    { id: "gallery-5", title: "Set aniversar", caption: "Cadru de prezentare", imageUrl: "" },
  ],
  albums: [
    {
      id: "album-1",
      title: "Album Nou-născut",
      description: "Primele 14 zile, imagini delicate și cadre naturale.",
      photos: [],
    },
    {
      id: "album-2",
      title: "Album Familie",
      description: "Portrete emoționale cu părinți și frați.",
      photos: [],
    },
  ],
  photographerPhotos: ["", ""],
};

const reviews = [
  {
    name: "Ana M.",
    text: "Foarte răbdători și atenți. Am primit fotografii superbe.",
  },
  {
    name: "Ioana P.",
    text: "Atmosferă calmă, studio curat și rezultat peste așteptări.",
  },
  {
    name: "Darius T.",
    text: "Comunicare excelentă, livrare rapidă și albume foarte frumoase.",
  },
];

const policies = [
  "Programările se confirmă cu avans.",
  "Reprogramarea se face cu minimum 48h înainte.",
  "Fișierele finale se livrează digital, în termenul comunicat.",
  "Datele personale și imaginile sunt tratate confidențial.",
];

function normalizeContent(value: unknown): SiteContent {
  if (typeof value !== "object" || value === null) {
    return defaultContent;
  }

  const raw = value as Partial<SiteContent>;

  const gallery = Array.isArray(raw.gallery)
    ? raw.gallery.map((item, index) => {
      const fallback = defaultContent.gallery[index] ?? defaultContent.gallery[0];
      if (typeof item !== "object" || item === null) {
        return fallback;
      }

      const casted = item as Partial<GalleryItem>;
      return {
        id: typeof casted.id === "string" ? casted.id : fallback.id,
        title: typeof casted.title === "string" ? casted.title : fallback.title,
        caption:
          typeof casted.caption === "string" ? casted.caption : fallback.caption,
        imageUrl: typeof casted.imageUrl === "string" ? casted.imageUrl : "",
      };
    })
    : defaultContent.gallery;

  const albums = Array.isArray(raw.albums)
    ? raw.albums.map((item, index) => {
      const fallback = defaultContent.albums[index] ?? {
        id: `album-${index + 1}`,
        title: "Album nou",
        description: "Descriere album",
        photos: [],
      };

      if (typeof item !== "object" || item === null) {
        return fallback;
      }

      const casted = item as Partial<AlbumItem>;
      const photos = Array.isArray(casted.photos)
        ? casted.photos.filter((p) => typeof p === "string")
        : [];

      return {
        id:
          typeof casted.id === "string" && casted.id.length > 0
            ? casted.id
            : fallback.id,
        title: typeof casted.title === "string" ? casted.title : fallback.title,
        description:
          typeof casted.description === "string"
            ? casted.description
            : fallback.description,
        photos,
      };
    })
    : defaultContent.albums;

  const photographerPhotos = Array.isArray(raw.photographerPhotos)
    ? raw.photographerPhotos.map((item) => (typeof item === "string" ? item : "")).slice(0, 2)
    : defaultContent.photographerPhotos;

  if (photographerPhotos.length < 2) {
    photographerPhotos.push(...Array.from({ length: 2 - photographerPhotos.length }, () => ""));
  }

  return { gallery, albums, photographerPhotos };
}

export default function Home() {
  const { content, loading } = useStudioContent();
  const [activeSection, setActiveSection] = useState("acasa");
  const [isManualClick, setIsManualClick] = useState(false);
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    images: string[];
    currentIndex: number;
  }>({ isOpen: false, images: [], currentIndex: 0 });

  const openLightbox = (images: string[], index: number) => {
    setLightbox({ isOpen: true, images, currentIndex: index });
  };

  const closeLightbox = () => {
    setLightbox({ isOpen: false, images: [], currentIndex: 0 });
  };

  const nextImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length,
    }));
  };

  const prevImage = () => {
    setLightbox((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1,
    }));
  };

  const sections = useMemo(
    () => [
      { id: "acasa", label: "Acasă" },
      { id: "galerie", label: "Galerie" },
      { id: "albume", label: "Albume" },
      { id: "recenzii", label: "Recenzii" },
      { id: "politici", label: "Politici" },
      { id: "fotograf", label: "Fotograf" },
    ],
    [],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Ignoră actualizările de la observer când se face click manual
        if (isManualClick) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -30% 0px" },
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sections, isManualClick]);

  useEffect(() => {
    if (!lightbox.isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightbox.isOpen, lightbox.images.length]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-rose-50 to-white text-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-black dark:text-gray-100">
      {/* Elemente decorative roz */}
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-pink-300/40 blur-3xl dark:bg-pink-900/20" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-rose-300/40 blur-3xl dark:bg-rose-800/20" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl dark:bg-pink-900/20" />
      <div className="pointer-events-none absolute right-1/4 top-1/2 h-64 w-64 rounded-full bg-rose-200/30 blur-2xl dark:bg-rose-900/15" />

      {/* Flori decorative */}
      <div className="pointer-events-none absolute left-10 top-40 text-6xl opacity-20 dark:opacity-10">🌸</div>
      <div className="pointer-events-none absolute right-20 top-60 text-5xl opacity-25 dark:opacity-10">🌺</div>
      <div className="pointer-events-none absolute left-1/4 top-96 text-4xl opacity-20 dark:opacity-10">🌷</div>
      <div className="pointer-events-none absolute right-1/3 bottom-40 text-5xl opacity-20 dark:opacity-10">🌸</div>
      <div className="pointer-events-none absolute left-1/2 bottom-60 text-6xl opacity-15 dark:opacity-10">🌺</div>
      <div className="pointer-events-none absolute right-10 top-1/3 text-4xl opacity-25 dark:opacity-10">🌷</div>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-300/80 bg-black backdrop-blur-md dark:border-gray-700 dark:bg-gray-950/85">
        <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-10 lg:px-16">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={() => {
                setActiveSection(section.id);
                setIsManualClick(true);
                // Resetează flag-ul după ce derularea s-a finalizat
                setTimeout(() => setIsManualClick(false), 1000);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ease-in-out transform ${activeSection === section.id
                ? "bg-gray-900 text-white shadow-lg scale-105 dark:bg-gray-200 dark:text-gray-950"
                : "text-white hover:bg-white/20 hover:scale-105 hover:shadow-md dark:text-gray-200 dark:hover:bg-gray-800"
                }`}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pt-24 pb-12 sm:px-10 lg:px-16">
        <header
          id="acasa"
          className="grid gap-8 rounded-3xl border border-gray-200 bg-white p-8 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80 md:grid-cols-2 md:p-10"
        >
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              Studio foto pentru bebeluși
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Momente mici, amintiri pentru o viață
            </h1>
            <p className="max-w-xl text-lg text-gray-600/90 dark:text-gray-300/90">
              Ședințe foto cu setup profesional, lumină blândă și multă atenție
              pentru confortul bebelușului.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-white"
              >
                Programează o ședință
              </a>

            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div
              className="aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-gray-900/70 dark:to-gray-800/60"
              style={
                content.gallery[0]?.imageUrl
                  ? {
                    backgroundImage: `url(${content.gallery[0].imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                  : undefined
              }
            />
          </div>
        </header>

        <section id="galerie" className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Fotografii mari</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Cadre ample, în format mare, pentru un impact vizual puternic.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.gallery.map((item, index) => {
              const galleryUrls = content.gallery.map(g => g.imageUrl).filter(url => url);
              return (
                <button
                  key={`${item.title}-${index}`}
                  onClick={() => item.imageUrl && openLightbox(galleryUrls, galleryUrls.indexOf(item.imageUrl))}
                  disabled={!item.imageUrl}
                  className={`group overflow-hidden rounded-2xl border border-gray-200/80 bg-white backdrop-blur-sm shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1 dark:border-gray-700 dark:bg-gray-900 ${index < 2 ? "md:col-span-2" : ""} ${item.imageUrl ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{
                    animation: `fadeSlideIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div
                    className={`relative bg-gradient-to-br from-gray-50 to-gray-100/80 transition-transform duration-500 group-hover:scale-105 dark:from-gray-800/70 dark:to-gray-900/60 ${index < 2 ? "aspect-[16/9]" : "aspect-[4/3]"}`}
                    style={
                      item.imageUrl
                        ? {
                          backgroundImage: `linear-gradient(rgba(255,255,255,0.04), rgba(255,255,255,0.04)), url(${item.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                        : undefined
                    }
                  >
                    {item.imageUrl && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                  </div>
                  <div className="p-5 text-left">
                    <h3 className="text-xl font-semibold transition-colors duration-300 group-hover:text-gray-700">{item.title || "Titlu"}</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {item.caption || "Cadru de prezentare"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section id="albume" className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Albume</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Albume cu galerii foto interactive. Click pe imagine pentru a vizualiza în fullscreen.
            </p>
          </div>
          <div className="space-y-8">
            {content.albums.map((album, albumIndex) => (
              <article
                key={album.id}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white backdrop-blur-sm shadow-sm transition-all duration-500 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
                style={{
                  animation: `fadeSlideIn 0.5s ease-out ${albumIndex * 0.15}s both`,
                }}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold transition-colors duration-300 hover:text-gray-700">{album.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {album.description}
                  </p>
                  {album.photos.length > 0 ? (
                    <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                      {album.photos.map((photo, index) => (
                        <button
                          key={`${album.id}-photo-${index}`}
                          onClick={() => openLightbox(album.photos, index)}
                          className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/80 shadow-sm transition-all duration-300 hover:scale-[1.05] hover:shadow-lg hover:-rotate-1 dark:from-gray-800/70 dark:to-gray-900/60"
                          style={{
                            animation: `fadeSlideIn 0.4s ease-out ${index * 0.05}s both`,
                          }}
                        >
                          {photo && (
                            <img
                              src={photo}
                              alt={`${album.title} - Poză ${index + 1}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-lg bg-gray-50/50 p-6 text-center text-sm text-gray-500 dark:bg-gray-800/30 dark:text-gray-400">
                      Acest album nu are încă fotografii adăugate.
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="recenzii" className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">Recenzii</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review.name}
                className="rounded-2xl border border-gray-200/80 bg-white p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">"{review.text}"</p>
                <p className="mt-4 text-sm font-semibold">{review.name}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="politici" className="space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight">Politici</h2>
          <div className="rounded-2xl border border-gray-200/80 bg-white p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900">
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {policies.map((policy) => (
                <li key={policy} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-gray-700 dark:bg-gray-400" />
                  <span>{policy}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="fotograf" className="space-y-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Fotograful</h2>
            <p className="text-gray-600 dark:text-gray-300">
              În partea de jos a paginii sunt afișate fotografii cu fotograful.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {content.photographerPhotos.map((photo, index) => (
              <div
                key={`photographer-${index}`}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div
                  className="aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-gray-900/70 dark:to-gray-800/60"
                  style={
                    photo
                      ? {
                        backgroundImage: `url(${photo})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </section>

        <section
          id="contact"
          className="rounded-3xl border border-gray-200 bg-white p-8 text-center backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            Hai să planificăm ședința foto
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Scrie-ne la contact@littlelights.ro sau sună la 07xx xxx xxx.
          </p>
        </section>
      </main>

      {/* Lightbox Modal */}
      {lightbox.isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 animate-fadeIn"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:rotate-90"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {lightbox.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:-translate-x-1"
                aria-label="Previous"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 z-[110] flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20 hover:scale-110 hover:translate-x-1"
                aria-label="Next"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            {lightbox.images[lightbox.currentIndex] && (
              <img
                key={lightbox.currentIndex}
                src={lightbox.images[lightbox.currentIndex]}
                alt={`Photo ${lightbox.currentIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain animate-imageSlide"
              />
            )}
            {lightbox.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white backdrop-blur-sm animate-slideUp">
                {lightbox.currentIndex + 1} / {lightbox.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
