"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/app/layout/siteConfig";
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

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || `Upload failed (${response.status})`);
      }

      const payload = (await response.json()) as { url: string };
      return payload.url;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(
          "Nu s-a putut contacta endpoint-ul de upload. Verifica serverul Next.js si configurarea Supabase.",
        );
      }
      throw error;
    }
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
    <div className={`${siteConfig.theme.pageBackground} relative overflow-hidden`}>
      <div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-rose-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-amber-100/50 blur-3xl" />

      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
        <header className="grid gap-8 rounded-3xl border border-rose-100 bg-white/95 p-8 shadow-sm md:grid-cols-[1.3fr_1fr] md:p-10">
          <div className="space-y-5">
            <p className={siteConfig.theme.badge}>Panou admin</p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Editezi continutul. Site-ul se actualizeaza imediat.
            </h1>
            <p className={`max-w-2xl text-lg ${siteConfig.theme.mutedText}`}>
              Actualizeaza galeria, albumele si sectiunea fotograf direct din acest panou.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#galerie-admin"
                className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Galerie
              </a>
              <a
                href="#albume-admin"
                className="inline-flex items-center justify-center rounded-full border border-rose-200 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Albume
              </a>
              <a
                href="#fotograf-admin"
                className="inline-flex items-center justify-center rounded-full border border-rose-200 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                Fotograf
              </a>
              <Link
                href="/acasa"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Vezi pagina publica
              </Link>
            </div>
          </div>

          <div className="grid content-start gap-3 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-amber-50 p-5">
            <div className="rounded-xl border border-rose-100 bg-white p-4 text-sm text-slate-600">
              Galerie editabila: <span className="font-semibold text-slate-900">{content.gallery.length}</span> imagini
            </div>
            <div className="rounded-xl border border-rose-100 bg-white p-4 text-sm text-slate-600">
              Albume active: <span className="font-semibold text-slate-900">{content.albums.length}</span>
            </div>
            <div className="rounded-xl border border-rose-100 bg-white p-4 text-sm text-slate-600">
              Poze fotograf: <span className="font-semibold text-slate-900">{content.photographerPhotos.length}</span>
            </div>
          </div>
        </header>

        <section className="space-y-2 text-sm">
          {isUploading ? (
            <p className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-800">
              Se incarca o imagine. Te rog asteapta.
            </p>
          ) : null}
          {isSaving ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
              Se sincronizeaza continutul in baza de date.
            </p>
          ) : null}
          {uploadSuccess ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
              {uploadSuccess}
            </p>
          ) : null}
          {uploadError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
              Upload esuat: {uploadError}
            </p>
          ) : null}
        </section>

        <section id="galerie-admin" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Galerie</h2>
            <p className={siteConfig.theme.mutedText}>Editeaza titlu, descriere, URL sau incarca imagine noua.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.gallery.map((item, index) => (
              <article key={`${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                <div className="aspect-[4/5] border-b border-rose-100 bg-slate-50">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.title || `Imagine galerie ${index + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className={`h-full w-full ${siteConfig.theme.softSurface}`} />
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <input
                    value={item.title}
                    onChange={(event) => handleGalleryChange(index, "title", event.target.value)}
                    className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-rose-300"
                    placeholder="Titlu"
                  />
                  <input
                    value={item.caption}
                    onChange={(event) => handleGalleryChange(index, "caption", event.target.value)}
                    className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-rose-300"
                    placeholder="Descriere"
                  />
                  <input
                    value={item.imageUrl}
                    onChange={(event) => handleGalleryChange(index, "imageUrl", event.target.value)}
                    className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-rose-300"
                    placeholder="URL imagine"
                  />
                  <label className="block w-full cursor-pointer rounded-lg border border-dashed border-rose-200 bg-rose-50/40 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50">
                    Alege poza din calculator
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => handleGalleryImageUpload(index, event.target.files?.[0])}
                    />
                  </label>
                  {uploadingTarget === `gallery-${index}` ? (
                    <p className="text-xs text-blue-700">Se incarca aceasta imagine...</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="albume-admin" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Albume</h2>
              <p className={siteConfig.theme.mutedText}>Adauga, editeaza sau sterge albume si fotografiile lor.</p>
            </div>
            <button
              onClick={handleAddAlbum}
              className="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Adauga album
            </button>
          </div>

          <div className="space-y-6">
            {content.albums.map((album) => (
              <article key={album.id} className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                <div className="space-y-4 p-6">
                  <div className="space-y-3">
                    <input
                      value={album.title}
                      onChange={(event) => handleAlbumChange(album.id, "title", event.target.value)}
                      className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm font-semibold outline-none placeholder:text-slate-400 focus:border-rose-300"
                      placeholder="Titlu album"
                    />
                    <input
                      value={album.description}
                      onChange={(event) => handleAlbumChange(album.id, "description", event.target.value)}
                      className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-rose-300"
                      placeholder="Descriere album"
                    />
                  </div>

                  <div className="border-t border-rose-100 pt-4">
                    <h4 className="mb-3 text-sm font-semibold text-slate-700">Fotografii album ({album.photos.length})</h4>

                    <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                      {album.photos.map((photo, photoIndex) => (
                        <div key={`${album.id}-photo-${photoIndex}`} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100">
                          {photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photo} alt={`${album.title} - ${photoIndex + 1}`} className="h-full w-full object-cover" />
                          ) : null}
                          <button
                            onClick={() => handleDeletePhotoFromAlbum(album.id, photoIndex)}
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white opacity-0 transition group-hover:opacity-100"
                            title="Sterge fotografie"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>

                    <label className="block w-full cursor-pointer rounded-lg border border-dashed border-rose-200 bg-rose-50/40 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50">
                      Adauga fotografie in album
                      <input
                        type="file"
                        accept="image/*,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        disabled={isUploading}
                        onChange={(event) => handlePhotoUploadToAlbum(album.id, event.target.files?.[0])}
                      />
                    </label>
                    {uploadingTarget === `album-${album.id}` ? (
                      <p className="text-xs text-blue-700">Se incarca fotografia in acest album...</p>
                    ) : null}
                  </div>

                  <button
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Sterge album
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="fotograf-admin" className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Fotograf</h2>
            <p className={siteConfig.theme.mutedText}>Actualizeaza imaginile folosite in sectiunea Fotograf.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {content.photographerPhotos.map((photo, index) => (
              <article key={`photographer-${index}`} className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                <div className="aspect-[4/5] border-b border-rose-100 bg-slate-50">
                  {photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo} alt={`Fotograf ${index + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <div className={`h-full w-full ${siteConfig.theme.softSurface}`} />
                  )}
                </div>
                <div className="space-y-3 p-4">
                  <input
                    value={photo}
                    onChange={(event) => handlePhotographerPhotoChange(index, event.target.value)}
                    className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-rose-300"
                    placeholder="URL poza fotograf"
                  />
                  <label className="block w-full cursor-pointer rounded-lg border border-dashed border-rose-200 bg-rose-50/40 px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50">
                    Alege poza din calculator
                    <input
                      type="file"
                      accept="image/*,.jpg,.jpeg,.png,.webp"
                      className="hidden"
                      disabled={isUploading}
                      onChange={(event) => handlePhotographerPhotoUpload(index, event.target.files?.[0])}
                    />
                  </label>
                  {uploadingTarget === `photographer-${index}` ? (
                    <p className="text-xs text-blue-700">Se incarca poza fotografului...</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
