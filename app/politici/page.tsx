"use client";

import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function PoliticiPage() {
  const { content, loading } = useStudioContent();
  const visiblePackages = content.packages.filter((pkg) => (pkg.showOnPolicies ?? true));

  return (
    <SiteShell title="Pachete" description="Reguli simple pentru programari si livrare.">
      {visiblePackages.length > 0 ? (
        <section className="mx-auto mt-10 max-w-5xl space-y-5">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-900">Pachete</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {visiblePackages.map((pkg) => (
              <article key={pkg.id} className={`${siteConfig.theme.card} space-y-3`}>
                <div className="flex flex-col items-center justify-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900">{pkg.title}</h3>
                  <p className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700">{pkg.price}</p>
                </div>
                <p className={`text-sm ${siteConfig.theme.mutedText}`}>{pkg.description}</p>
                {pkg.features.length > 0 ? (
                  <ul className={`space-y-2 text-sm ${siteConfig.theme.mutedText}`}>
                    {pkg.features.map((feature, index) => (
                      <li key={`${pkg.id}-feature-${index}`} className="flex items-center justify-center gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : loading ? (
        <section className="mx-auto mt-10 max-w-5xl">
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <article key={`package-skeleton-${index}`} className={`${siteConfig.theme.card} space-y-3 animate-pulse`}>
                <div className={`h-6 w-2/3 rounded ${siteConfig.theme.softSurface}`} />
                <div className={`h-4 w-1/3 rounded ${siteConfig.theme.softSurface}`} />
                <div className={`h-4 w-full rounded ${siteConfig.theme.softSurface}`} />
                <div className={`h-4 w-5/6 rounded ${siteConfig.theme.softSurface}`} />
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
