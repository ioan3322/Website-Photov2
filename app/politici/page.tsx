"use client";

import { motion } from "framer-motion";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function PoliticiPage() {
  const { content, loading } = useStudioContent();
  const visiblePackages = content.packages.filter((pkg) => (pkg.showOnPolicies ?? true));

  return (
    <SiteShell
      title="Pachete"
      description="Reguli simple pentru programări, livrare și opțiunile disponibile."
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <section className="space-y-8">
        <div className="max-w-3xl">
          <p className={siteConfig.theme.badge}>Pachete curatoriate</p>
          <p className={`mt-5 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
            Folosim exact datele existente din backend și le prezentăm într-o grilă aerisită, cu ierarhie clară și detalii ușor de citit.
          </p>
        </div>

        {visiblePackages.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {visiblePackages.map((pkg, index) => (
              <motion.article
                key={pkg.id}
                className="rounded-[1.75rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <div className="flex flex-col gap-3 border-b border-[rgba(203,184,169,0.14)] pb-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Pachet</p>
                    <h2 className="mt-2 text-2xl font-medium tracking-tight text-[#2B2B2B]">{pkg.title}</h2>
                  </div>
                  <p className="inline-flex rounded-full border border-[rgba(203,184,169,0.32)] bg-white/80 px-3 py-1 text-sm font-medium text-[#2B2B2B]">
                    {pkg.price}
                  </p>
                </div>

                <p className={`mt-5 text-sm ${siteConfig.theme.mutedText}`}>{pkg.description}</p>

                {pkg.features.length > 0 ? (
                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={`${pkg.id}-feature-${featureIndex}`} className="flex items-start gap-3 text-sm text-[#4b4540]">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c7b39f]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </motion.article>
            ))}
          </div>
        ) : loading ? (
          <div className="grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <article
                key={`package-skeleton-${index}`}
                className="rounded-[1.75rem] border border-[rgba(203,184,169,0.18)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)]"
              >
                <div className={`h-6 w-1/3 rounded ${siteConfig.theme.softSurface} animate-pulse`} />
                <div className={`mt-4 h-5 w-1/4 rounded ${siteConfig.theme.softSurface} animate-pulse`} />
                <div className={`mt-6 h-4 w-full rounded ${siteConfig.theme.softSurface} animate-pulse`} />
                <div className={`mt-3 h-4 w-5/6 rounded ${siteConfig.theme.softSurface} animate-pulse`} />
              </article>
            ))}
          </div>
        ) : (
          <p className={`rounded-[1.5rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu există încă pachete afișate pentru această pagină.
          </p>
        )}
      </section>
    </SiteShell>
  );
}