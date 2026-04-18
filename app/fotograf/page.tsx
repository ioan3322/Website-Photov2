"use client";

import Image from "next/image";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function FotografPage() {
  const { content, loading } = useStudioContent();
  const photos = content.photographerPhotos.filter((photo) => photo.trim().length > 0);

  return (
    <SiteShell title="Fotograf" description="Fotografii de prezentare ale fotografului.">
      <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8">
        {photos.length > 0
          ? photos.map((photo, index) => (
              <article key={`photo-${index}`} className={`${siteConfig.theme.card} p-2 transition-all duration-300 hover:-translate-y-1`}>
                <Image
                  src={photo}
                  alt={`Fotograf ${index + 1}`}
                  width={620}
                  height={880}
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 310px"
                  className="max-h-[440px] max-w-[310px] rounded-xl object-cover shadow-sm transition-all duration-300 hover:scale-[1.02]"
                />
              </article>
            ))
          : loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <article key={`photo-skeleton-${index}`} className={`${siteConfig.theme.card} p-2`}>
                  <div className={`h-[340px] w-[260px] rounded-xl ${siteConfig.theme.softSurface} animate-pulse`} />
                </article>
              ))
            : (
                <p className={`rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
                  Nu exista inca fotografii pentru aceasta sectiune.
                </p>
              )}
      </div>
    </SiteShell>
  );
}
