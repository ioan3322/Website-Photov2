"use client";

import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function GaleriePage() {
  const { content } = useStudioContent();
  const visibleItems = content.gallery.filter((item) => item.imageUrl.trim().length > 0 || item.title || item.caption);

  return (
    <SiteShell title="Galerie" description="Fotografii mari de prezentare.">
      {visibleItems.length > 0 ? (
        <div className="mt-8 columns-1 gap-6 sm:columns-2 lg:columns-3">
          {visibleItems.map((item, index) => (
            <article key={item.id || `${item.title}-${index}`} className="mb-6 break-inside-avoid space-y-2">
              <div className={`${siteConfig.theme.card} overflow-hidden p-0`}>
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Fotografie"}
                    className="h-auto w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className={`h-[240px] w-full ${siteConfig.theme.softSurface}`} />
                )}
              </div>
              <h2 className="text-lg font-semibold text-slate-900">{item.title || `Fotografie ${index + 1}`}</h2>
              <p className={`text-sm ${siteConfig.theme.mutedText}`}>{item.caption || "Cadru de prezentare"}</p>
            </article>
          ))}
        </div>
      ) : (
        <p className={`mt-8 rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
          Nu exista inca fotografii in galerie.
        </p>
      )}
    </SiteShell>
  );
}
