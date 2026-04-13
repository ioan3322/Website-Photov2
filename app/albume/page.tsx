"use client";

import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function AlbumePage() {
  const { content } = useStudioContent();

  return (
    <SiteShell title="Albume" description="Albume foto organizate pe sedinte.">
      <div className="mt-8 space-y-8">
        {content.albums.map((album) => (
          <article
            key={album.id}
            className={`${siteConfig.theme.card} overflow-hidden`}
          >
            <h2 className="text-xl font-semibold">{album.title}</h2>
            <p className={`mt-2 text-sm ${siteConfig.theme.mutedText}`}>{album.description}</p>

            {album.photos[0] ? (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={album.photos[0]}
                  alt={`${album.title} coperta`}
                  className="max-h-[480px] max-w-full object-contain"
                />
              </div>
            ) : (
              <div className={`mt-4 rounded ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
                Albumul nu are inca fotografii.
              </div>
            )}
          </article>
        ))}
        {content.albums.length === 0 && (
          <p className={`rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu exista albume momentan.
          </p>
        )}
      </div>
    </SiteShell>
  );
}
