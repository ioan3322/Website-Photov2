"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  showOnHome?: boolean;
};

type AlbumItem = {
  id: string;
  title: string;
  description: string;
  photos: string[];
  showOnHome?: boolean;
};









export default function AdminPage() {
  const router = useRouter();
  const { content, setContent, saveContent } = useStudioContent();
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(true);

  const isUploading = uploadingTarget !== null;

  const getErrorMessage = (error: unknown) =>
    error instanceof Error && error.message
      ? error.message
      : "A aparut o eroare la incarcarea imaginii.";

  const uploadImageToServer = async (file: File, folder: string, fileName?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    if (fileName && fileName.trim()) {
      formData.append("fileName", fileName.trim());
    }

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

  const handleAddGalleryItem = () => {
    setContent((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: `gallery-${Date.now()}`,
          title: `Fotografie ${prev.gallery.length + 1}`,
          caption: "Descriere fotografie",
          imageUrl: "",
          showOnHome: true,
        },
      ],
    }));
  };

  const handleGalleryHomeToggle = (index: number, checked: boolean) => {
    setContent((prev) => {
      const next = { ...prev };
      next.gallery = [...prev.gallery];
      next.gallery[index] = { ...next.gallery[index], showOnHome: checked };
      return next;
    });
  };

  const handleDeleteGalleryItem = (index: number) => {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleGalleryImageUpload = async (index: number, file?: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    const target = `gallery-${index}`;
    setUploadingTarget(target);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const photoName = content.gallery[index]?.title || `fotografie-${index + 1}`;
      const url = await uploadImageToServer(file, "gallery", photoName);
      handleGalleryChange(index, "imageUrl", url);
      setUploadSuccess("Imaginea din galerie a fost incarcata cu succes.");
    } catch (error) {
      setUploadError(getErrorMessage(error));
      console.error("Gallery image upload failed:", error);
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleBulkGalleryUpload = async (files?: FileList | File[]) => {
    const selectedFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (selectedFiles.length === 0) return;

    setUploadingTarget("gallery-bulk");
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const uploadedItems: GalleryItem[] = [];

      for (const [index, file] of selectedFiles.entries()) {
        const baseName = file.name.replace(/\.[^/.]+$/, "").trim() || `fotografie-${index + 1}`;
        const url = await uploadImageToServer(file, "gallery", `${baseName}-${Date.now()}-${index + 1}`);

        uploadedItems.push({
          id: `gallery-${Date.now()}-${index}`,
          title: baseName,
          caption: "Descriere fotografie",
          imageUrl: url,
          showOnHome: true,
        });
      }

      setContent((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedItems],
      }));

      setUploadSuccess(
        uploadedItems.length === 1
          ? "Fotografia a fost adaugata in galerie."
          : `${uploadedItems.length} fotografii au fost adaugate in galerie.`,
      );
    } catch (error) {
      setUploadError(getErrorMessage(error));
      console.error("Bulk gallery upload failed:", error);
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
          showOnHome: true,
        },
      ],
    }));
  };

  const handleAlbumHomeToggle = (id: string, checked: boolean) => {
    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((album) =>
        album.id === id ? { ...album, showOnHome: checked } : album
      ),
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

  const handleAddPhotosToAlbum = (albumId: string, photoUrls: string[]) => {
    if (photoUrls.length === 0) return;

    setContent((prev) => ({
      ...prev,
      albums: prev.albums.map((album) =>
        album.id === albumId
          ? { ...album, photos: [...album.photos, ...photoUrls] }
          : album
      ),
    }));
  };

  const handlePhotoUploadToAlbum = async (albumId: string, files?: FileList | File[]) => {
    const selectedFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
    if (selectedFiles.length === 0) return;

    const target = `album-${albumId}`;
    setUploadingTarget(target);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const album = content.albums.find((item) => item.id === albumId);
      const baseIndex = album?.photos.length ?? 0;
      const uploadedUrls: string[] = [];

      for (const [index, file] of selectedFiles.entries()) {
        const photoName = album?.title
          ? `${album.title}-foto-${baseIndex + index + 1}`
          : `album-${Date.now()}-${index + 1}`;

        const url = await uploadImageToServer(file, "albums", photoName);
        uploadedUrls.push(url);
      }

      handleAddPhotosToAlbum(albumId, uploadedUrls);
      setUploadSuccess(
        uploadedUrls.length === 1
          ? "Fotografia a fost adaugata in album."
          : `${uploadedUrls.length} fotografii au fost adaugate in album.`,
      );
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
      const url = await uploadImageToServer(file, "photographer", `fotograf-${index + 1}`);
      handlePhotographerPhotoChange(index, url);
      setUploadSuccess("Poza fotografului a fost incarcata cu succes.");
    } catch (error) {
      setUploadError(getErrorMessage(error));
      console.error("Photographer image upload failed:", error);
    } finally {
      setUploadingTarget(null);
    }
  };

  const handleAddPhotographerPhoto = () => {
    setContent((prev) => ({
      ...prev,
      photographerPhotos: [...prev.photographerPhotos, ""],
    }));
  };

  const handleDeletePhotographerPhoto = (index: number) => {
    setContent((prev) => ({
      ...prev,
      photographerPhotos: prev.photographerPhotos.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      router.replace("/admin-auth");
      router.refresh();
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

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
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
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Logout
              </button>
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Galerie</h2>
            <div className="flex flex-wrap items-center gap-3">
              <p className={siteConfig.theme.mutedText}>Editeaza titlu, descriere, URL sau incarca imagine noua.</p>
              <button
                type="button"
                onClick={() => setIsGalleryExpanded((prev) => !prev)}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              >
                {isGalleryExpanded ? "Strange fotografiile" : "Extinde fotografiile"}
              </button>
            </div>
          </div>

          {isGalleryExpanded ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {content.gallery.map((item, index) => (
                <article key={item.id || `${item.title}-${index}`} className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                  <div className="aspect-[4/5] border-b border-rose-100 bg-slate-50">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.title || `Imagine galerie ${index + 1}`} className="h-full w-full object-cover" />
                    ) : (
                      <div className={`h-full w-full ${siteConfig.theme.softSurface}`} />
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <label className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={item.showOnHome ?? true}
                        onChange={(event) => handleGalleryHomeToggle(index, event.target.checked)}
                        className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-300"
                      />
                      Afiseaza pe Home
                    </label>
                    <label className="space-y-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                      Nume fotografie
                      <input
                        value={item.title}
                        onChange={(event) => handleGalleryChange(index, "title", event.target.value)}
                        className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-rose-300"
                        placeholder="Ex: Portret la lumina naturala"
                      />
                    </label>
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
                    <button
                      onClick={() => handleDeleteGalleryItem(index)}
                      className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    >
                      Sterge fotografia
                    </button>
                  </div>
                </article>
              ))}

              <button
                type="button"
                onClick={handleAddGalleryItem}
                className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
                aria-label="Adauga fotografie"
                title="Adauga fotografie"
              >
                <span className="text-5xl font-light leading-none">+</span>
                <span className="text-sm font-semibold text-rose-700">Adauga fotografie</span>
              </button>

              <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-sky-200 bg-white text-sky-500 transition hover:border-sky-300 hover:bg-sky-50">
                <span className="text-5xl font-light leading-none">+</span>
                <span className="text-sm font-semibold text-sky-700">Adauga mai multe fotografii</span>
                <input
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                  onChange={(event) => handleBulkGalleryUpload(event.target.files || undefined)}
                />
              </label>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-rose-200 bg-white/70 p-5 text-sm text-slate-600">
              Galerie ascunsa. Apasa pe butonul „Extinde fotografiile” ca sa revii la lista completa.
            </div>
          )}
        </section>

        <section id="albume-admin" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Albume</h2>
              <p className={siteConfig.theme.mutedText}>Adauga, editeaza sau sterge albume si fotografiile lor.</p>
            </div>
          </div>

          <div className="space-y-6">
            {content.albums.map((album) => (
              <article key={album.id} className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                <div className="space-y-4 p-6">
                  <label className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={album.showOnHome ?? true}
                      onChange={(event) => handleAlbumHomeToggle(album.id, event.target.checked)}
                      className="h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-300"
                    />
                    Afiseaza albumul pe Home
                  </label>
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

                    <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-rose-200 bg-rose-50/40 text-rose-500 transition hover:border-rose-300 hover:bg-rose-100/50">
                        <span className="text-4xl font-light leading-none">+</span>
                        <span className="px-2 text-center text-xs font-semibold text-rose-700">Adauga fotografie</span>
                        <input
                          type="file"
                          accept="image/*,.jpg,.jpeg,.png,.webp"
                          multiple
                          className="hidden"
                          disabled={isUploading}
                          onChange={(event) => handlePhotoUploadToAlbum(album.id, event.target.files || undefined)}
                        />
                      </label>
                    </div>
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

            <button
              type="button"
              onClick={handleAddAlbum}
              className="flex min-h-[180px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
              aria-label="Adauga album"
              title="Adauga album"
            >
              <span className="text-5xl font-light leading-none">+</span>
              <span className="text-sm font-semibold text-rose-700">Adauga album</span>
            </button>
          </div>
        </section>

        <section id="fotograf-admin" className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
                    value={photo ?? ""}
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
                  <button
                    onClick={() => handleDeletePhotographerPhoto(index)}
                    className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Sterge poza
                  </button>
                </div>
              </article>
            ))}

            <button
              type="button"
              onClick={handleAddPhotographerPhoto}
              className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-rose-200 bg-white text-rose-500 transition hover:border-rose-300 hover:bg-rose-50"
              aria-label="Adauga poza"
              title="Adauga poza"
            >
              <span className="text-5xl font-light leading-none">+</span>
              <span className="text-sm font-semibold text-rose-700">Adauga fotografie</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
