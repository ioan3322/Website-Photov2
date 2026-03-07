"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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









export default function AdminPage() {
  const { content, setContent, saveContent } = useStudioContent();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const isUploading = uploadingTarget !== null;

  const getErrorMessage = (error: unknown) =>
    error instanceof Error && error.message
      ? error.message
      : "A aparut o eroare la incarcarea imaginii.";

  const uploadImageToServer = async (file: File, folder: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error || "Upload failed");
    }

    const payload = (await response.json()) as { url: string };
    return payload.url;
  };

  // Gallery handlers
  const handleGalleryChange = (index: number, field: keyof GalleryItem, value: string) => {
    setContent((prev) => {
      const next = { ...prev };
      next.gallery = [...prev.gallery];
      next.gallery[index] = { ...next.gallery[index], [field]: value };
      return next;
    });
  };

  const handleGalleryImageUpload = async (index: number, file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const target = `gallery-${index}`;
    setUploadingTarget(target);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const url = await uploadImageToServer(file, "gallery");
      handleGalleryChange(index, "imageUrl", url);
      setUploadSuccess("Imaginea din galerie a fost incarcata cu succes.");
    } catch (error) {
      setUploadError(getErrorMessage(error));
      console.error("Gallery image upload failed:", error);
    } finally {
      setUploadingTarget(null);
    }
  };

  // Album handlers
  const handleAlbumChange = (id: string, field: keyof Omit<AlbumItem, "id">, value: string) => {
    setContent((prev) => {
      const next = { ...prev };
      next.albums = prev.albums.map((album) =>
        album.id === id ? { ...album, [field]: value } : album
      );
      return next;
    });
  };

  const handleAddAlbum = () => {
    setContent((prev) => ({
      ...prev,
      albums: [
        ...prev.albums,
        {
          id: `album-${Date.now()}`,
          title: "Album nou",
          description: "Descriere album",
          photos: [],
        },
      ],
    }));
  };

  const handleDeleteAlbum = (id: string) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.filter((album) => album.id !== id),
    }));
  };

  const handleAddPhotoToAlbum = (albumId: string, photoUrl: string) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((album) =>
        album.id === albumId
          ? { ...album, photos: [...album.photos, photoUrl] }
          : album
      ),
    }));
  };

  const handlePhotoUploadToAlbum = async (albumId: string, file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const target = `album-${albumId}`;
    setUploadingTarget(target);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const url = await uploadImageToServer(file, "albums");
      handleAddPhotoToAlbum(albumId, url);
      setUploadSuccess("Fotografia a fost adaugata in album.");
    } catch (error) {
      setUploadError(getErrorMessage(error));
      console.error("Album image upload failed:", error);
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleDeletePhotoFromAlbum = (albumId: string, photoIndex: number) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((album) =>
        album.id === albumId
          ? { ...album, photos: album.photos.filter((_, i) => i !== photoIndex) }
          : album
      ),
    }));
  };

  // Photographer photos handlers
  const handlePhotographerPhotoChange = (index: number, value: string) => {
    setContent((prev) => {
      const next = { ...prev };
      next.photographerPhotos = [...prev.photographerPhotos];
      next.photographerPhotos[index] = value;
      return next;
    });
  };

  const handlePhotographerPhotoUpload = async (index: number, file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const target = `photographer-${index}`;
    setUploadingTarget(target);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const url = await uploadImageToServer(file, "photographer");
      handlePhotographerPhotoChange(index, url);
      setUploadSuccess("Poza fotografului a fost incarcata cu succes.");
    } catch (error) {
      setUploadError(getErrorMessage(error));
      console.error("Photographer image upload failed:", error);
    } finally {
      setUploadingTarget(null);
    }
  };

  useEffect(() => {
    if (!uploadSuccess) return;

    const timer = setTimeout(() => setUploadSuccess(null), 2500);
    return () => clearTimeout(timer);
  }, [uploadSuccess]);

  // Storage sync
  useEffect(() => {
    const save = async () => {
      try {
        setIsSaving(true);
        await saveContent(content);
      } catch (error) {
        console.error("Error saving content:", error);
      } finally {
        setIsSaving(false);
      }
    };

    const timer = setTimeout(save, 800); // Save with 800ms debounce
    return () => clearTimeout(timer);
  }, [content, saveContent]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 via-gray-100 to-white text-gray-950 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 dark:text-gray-100">
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-gray-200/40 blur-3xl dark:bg-gray-400/10" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-gray-300/40 blur-3xl dark:bg-gray-300/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-gray-200/30 blur-3xl dark:bg-gray-300/10" />

      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-12 sm:px-10 lg:px-16">
        <header className="grid gap-8 rounded-3xl border border-gray-200 bg-white p-8 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900 md:grid-cols-2 md:p-10">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Admin studio foto
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Momente mici, amintiri pentru o viață
            </h1>
            <p className="max-w-xl text-lg text-gray-600 dark:text-gray-300">
              Panou admin complet sincronizat cu pagina principală. Editează galeria, albumele și pozele fotografului.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#galerie-admin"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                Editează galeria
              </a>
              <a
                href="#albume-admin"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Editează albume
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Vezi pagina publică
              </Link>
            </div>
            <div className="space-y-2 text-sm">
              {isUploading && (
                <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-blue-800 dark:border-blue-900/70 dark:bg-blue-950/40 dark:text-blue-300">
                  Se incarca imaginea, te rog asteapta...
                </p>
              )}
              {isSaving && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800 dark:border-amber-900/70 dark:bg-amber-950/40 dark:text-amber-300">
                  Se sincronizeaza continutul in baza de date...
                </p>
              )}
              {uploadSuccess && (
                <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 dark:border-emerald-900/70 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {uploadSuccess}
                </p>
              )}
              {uploadError && (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-800 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
                  Upload esuat: {uploadError}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/80 p-6 dark:from-gray-900/70 dark:to-gray-800/60">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl">📷</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  6 fotografii editabile în galerie
                </p>
              </div>
              <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl">📚</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Adaugă și șterge albume la cerere
                </p>
              </div>
              <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl">👤</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  2 poze cu fotograful editable
                </p>
              </div>
              <div className="rounded-xl bg-white p-4 dark:bg-gray-900">
                <p className="text-3xl">🔄</p>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                  Sincronizare instant cu pagina publică
                </p>
              </div>
            </div>
          </div>
        </header>

        <section id="galerie-admin" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Galerie (Admin)</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Editează fiecare poză în parte: titlu, descriere și URL imagine.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.gallery.map((item, index) => (
              <article
                key={`${item.title}-${index}`}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div
                  className="aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-gray-900/70 dark:to-gray-800/60"
                  style={
                    item.imageUrl
                      ? {
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url(${item.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                      : undefined
                  }
                />
                <div className="space-y-3 p-4">
                  <input
                    value={item.title}
                    onChange={(event) =>
                      handleGalleryChange(index, "title", event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
                    placeholder="Titlu"
                  />
                  <input
                    value={item.caption}
                    onChange={(event) =>
                      handleGalleryChange(index, "caption", event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
                    placeholder="Descriere"
                  />
                  <input
                    value={item.imageUrl}
                    onChange={(event) =>
                      handleGalleryChange(index, "imageUrl", event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
                    placeholder="URL imagine"
                  />
                  <label className="block w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    Alege poză din calculator (JPG, PNG, WEBP)
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) =>
                        handleGalleryImageUpload(index, event.target.files?.[0])
                      }
                    />
                  </label>
                  {uploadingTarget === `gallery-${index}` && (
                    <p className="text-xs text-blue-700 dark:text-blue-300">Se incarca aceasta imagine...</p>
                  )}
                  <div>
                    <h3 className="font-medium">{item.title || "Titlu"}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.caption || "Cadru de prezentare"}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="albume-admin" className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Albume (Admin)</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Adaugă, editează sau șterge albume și fotografiile din fiecare album.
              </p>
            </div>
            <button
              onClick={handleAddAlbum}
              className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              ➕ Adaugă album
            </button>
          </div>

          <div className="space-y-6">
            {content.albums.map((album) => (
              <article
                key={album.id}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="space-y-4 p-6">
                  <div className="space-y-3">
                    <input
                      value={album.title}
                      onChange={(event) =>
                        handleAlbumChange(album.id, "title", event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
                      placeholder="Titlu album"
                    />
                    <input
                      value={album.description}
                      onChange={(event) =>
                        handleAlbumChange(album.id, "description", event.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
                      placeholder="Descriere album"
                    />
                  </div>

                  <div className="border-t border-gray-300/50 pt-4 dark:border-gray-700/50">
                    <h4 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      📸 Fotografii album ({album.photos.length})
                    </h4>

                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 mb-3">
                      {album.photos.map((photo, photoIndex) => (
                        <div
                          key={`${album.id}-photo-${photoIndex}`}
                          className="group relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/80 dark:from-gray-900/70 dark:to-gray-800/60"
                        >
                          {photo && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={photo}
                              alt={`${album.title} - ${photoIndex + 1}`}
                              className="h-full w-full object-cover"
                            />
                          )}
                          <button
                            onClick={() => handleDeletePhotoFromAlbum(album.id, photoIndex)}
                            className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500/90 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                            title="Șterge fotografie"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <label className="block w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                      ➕ Adaugă fotografie în album
                      <input
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(event) =>
                          handlePhotoUploadToAlbum(album.id, event.target.files?.[0])
                        }
                      />
                    </label>
                    {uploadingTarget === `album-${album.id}` && (
                      <p className="text-xs text-blue-700 dark:text-blue-300">Se incarca fotografia in acest album...</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-300 dark:hover:bg-red-900"
                  >
                    🗑️ Șterge întregul album
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="fotograf-admin" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Fotograful (Admin)</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Adaugă pozele fotografului care apar în partea de jos a paginii principale.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {content.photographerPhotos.map((photo, index) => (
              <article
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
                <div className="space-y-3 p-4">
                  <input
                    value={photo}
                    onChange={(event) =>
                      handlePhotographerPhotoChange(index, event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none ring-0 placeholder:text-gray-400 focus:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:placeholder:text-gray-500"
                    placeholder="URL poză fotograf"
                  />
                  <label className="block w-full cursor-pointer rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                    Alege poză din calculator
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) =>
                        handlePhotographerPhotoUpload(index, event.target.files?.[0])
                      }
                    />
                  </label>
                  {uploadingTarget === `photographer-${index}` && (
                    <p className="text-xs text-blue-700 dark:text-blue-300">Se incarca poza fotografului...</p>
                  )}
                  <div className="text-xs text-gray-600/70 dark:text-gray-400/70">
                    Poză fotograf #{index + 1}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold tracking-tight">Pachete</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Mini",
                details: "30 min • 10 fotografii editate",
              },
              {
                title: "Classic",
                details: "60 min • 25 fotografii editate",
              },
              {
                title: "Premium",
                details: "90 min • 40 fotografii + album",
              },
            ].map((plan) => (
              <article
                key={plan.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900"
              >
                <h3 className="text-lg font-semibold">{plan.title}</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {plan.details}
                </p>
              </article>
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
    </div>
  );
}
