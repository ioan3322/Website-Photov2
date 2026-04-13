"use client";

import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function FotografPage() {
  const { content } = useStudioContent();

  return (
    <SiteShell title="Fotograf" description="Fotografii de prezentare ale fotografului.">
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {content.photographerPhotos.map((photo, index) => (
          <article key={`photo-${index}`} className={`${siteConfig.theme.card} p-2`}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt={`Fotograf ${index + 1}`}
                className="max-h-[420px] max-w-[300px] object-contain"
              />
            ) : (
              <div className={`h-[320px] w-[260px] ${siteConfig.theme.softSurface}`} />
            )}
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
