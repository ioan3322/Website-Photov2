"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

export default function FotografPage() {
  const { content, loading } = useStudioContent();
  const photos = content.photographerPhotos.filter((photo) => photo.trim().length > 0);

  const leadPhoto = photos[0] || "";
  const secondaryPhotos = photos.slice(1, 4);

  return (
    <SiteShell
      title="Fotograf"
      description="O prezentare calmă și editorială a fotografului, cu accent pe portret și atmosferă."
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <section className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="max-w-2xl">
          <p className={siteConfig.theme.badge}>Despre fotograf</p>
          <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl lg:text-5xl">
            Portrete naturale, direcție blândă și o estetică elegantă.
          </h2>
          <p className={`mt-6 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
            Această pagină păstrează aceeași sursă de date, dar o transformă într-un spațiu mai cald și mai personal,
            cu spațiu amplu și imagini de prezentare aerisite.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-[rgba(203,184,169,0.22)] bg-white/65 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Stil</p>
              <p className="mt-2 text-sm font-medium text-[#2B2B2B]">Lumină moale și compoziție rafinată</p>
            </div>
            <div className="rounded-[1.5rem] border border-[rgba(203,184,169,0.22)] bg-white/65 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Experiență</p>
              <p className="mt-2 text-sm font-medium text-[#2B2B2B]">Ritm calm și ghidaj atent</p>
            </div>
          </div>
        </div>

        {photos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <motion.article
              className="relative overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/70 shadow-[0_18px_48px_rgba(43,43,43,0.06)] sm:row-span-2"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-[4/5] min-h-[28rem] overflow-hidden">
                <Image
                  src={leadPhoto || photos[0]}
                  alt="Fotograf"
                  fill
                  sizes="(max-width: 1024px) 92vw, 40vw"
                  className="object-cover"
                />
              </div>
            </motion.article>

            {secondaryPhotos.map((photo, index) => (
              <motion.article
                key={`${photo}-${index}`}
                className="relative overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/70 shadow-[0_18px_48px_rgba(43,43,43,0.06)]"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                <div className="relative aspect-[4/3] min-h-[14rem] overflow-hidden">
                  <Image
                    src={photo}
                    alt={`Fotograf ${index + 2}`}
                    fill
                    sizes="(max-width: 1024px) 92vw, 20vw"
                    className="object-cover transition-all duration-500 hover:scale-[1.04]"
                  />
                </div>
              </motion.article>
            ))}
          </div>
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="relative overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/70 shadow-[0_18px_48px_rgba(43,43,43,0.05)] sm:row-span-2">
              <div className={`relative aspect-[4/5] min-h-[28rem] ${siteConfig.theme.softSurface} animate-pulse`} />
            </article>
            {Array.from({ length: 3 }).map((_, index) => (
              <article
                key={`photo-skeleton-${index}`}
                className="relative overflow-hidden rounded-[2rem] border border-[rgba(203,184,169,0.18)] bg-white/70 shadow-[0_18px_48px_rgba(43,43,43,0.05)]"
              >
                <div className={`relative aspect-[4/3] min-h-[14rem] ${siteConfig.theme.softSurface} animate-pulse`} />
              </article>
            ))}
          </div>
        ) : (
          <p className={`rounded-[1.5rem] border border-[rgba(203,184,169,0.2)] bg-white/65 p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu există încă fotografii pentru această secțiune.
          </p>
        )}
      </section>
    </SiteShell>
  );
}