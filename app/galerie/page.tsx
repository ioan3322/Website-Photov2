"use client";

import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function GaleriePage() {
  const { content } = useStudioContent();

  return (
    <SiteShell title="Galerie" description="Fotografii mari de prezentare.">
      <div className="mt-8 flex flex-wrap justify-center gap-6">
        {content.gallery.map((item, index) => (
          <article key={`${item.title}-${index}`} className="max-w-[300px] space-y-2">
            <div className={`${siteConfig.theme.card} overflow-hidden p-0`}>
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.title || "Fotografie"}
                  className="max-h-[420px] w-full object-contain"
                />
              ) : (
                <div className={`h-[300px] w-[300px] ${siteConfig.theme.softSurface}`} />
              )}
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{item.title || "Titlu"}</h2>
            <p className={`text-sm ${siteConfig.theme.mutedText}`}>{item.caption || "Cadru de prezentare"}</p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
