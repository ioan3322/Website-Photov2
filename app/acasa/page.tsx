"use client";

import Link from "next/link";
import { useMemo } from "react";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from "@/hooks/useStudioContent";

type HomeCard = {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  kind: "photo" | "album";
  href?: string;
};

export default function AcasaPage() {
  const { content } = useStudioContent();

  const cards = useMemo<HomeCard[]>(() => {
    const galleryCards = content.gallery
      .filter((item) => (item.showOnHome ?? true) && item.imageUrl.trim().length > 0)
      .map((item) => ({
        id: `gallery-${item.id}`,
        imageUrl: item.imageUrl,
        title: item.title || "Fotografie",
        caption: item.caption || "Fotografie selectata din galerie",
        kind: "photo" as const,
      }));

    const albumCards = content.albums
      .filter((album) => (album.showOnHome ?? true) && album.photos.some((photo) => photo.trim().length > 0))
      .map((album) => ({
        id: `album-${album.id}`,
        imageUrl: album.photos.find((photo) => photo.trim().length > 0) || "",
        title: album.title || "Album",
        caption: album.description || "Album selectat pentru pagina Home",
        kind: "album" as const,
        href: "/albume",
      }));

    return [...galleryCards, ...albumCards];
  }, [content]);

  return (
    <SiteShell
      title="Acasa"
      description="Studio foto pentru bebelusi, cu sedinte in siguranta si cadre naturale."
      containerClassName="mx-auto w-full max-w-6xl px-6 py-12"
    >
      <section className="space-y-5">
        <p className={siteConfig.theme.badge}>
          Studio foto pentru bebelusi
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Momente mici, amintiri pentru o viata
        </h1>
        <p className={`text-lg ${siteConfig.theme.mutedText}`}>
          Sedinte foto cu setup profesional, lumina blanda si mult confort pentru bebelus.
        </p>
      </section>

      <section className="mt-8">
        {cards.length > 0 ? (
          <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
            {cards.map((card) => {
              const CardBody = (
                <article className="mb-6 break-inside-avoid overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm">
                  <div className="relative overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.imageUrl} alt={card.title} className="h-auto w-full object-cover" loading="lazy" />
                    {card.kind === "album" ? (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-rose-700">
                        Album
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1 p-4">
                    <h2 className="text-lg font-semibold text-slate-900">{card.title}</h2>
                    <p className={`text-sm ${siteConfig.theme.mutedText}`}>{card.caption}</p>
                  </div>
                </article>
              );

              if (card.href) {
                return (
                  <Link key={card.id} href={card.href} className="block">
                    {CardBody}
                  </Link>
                );
              }

              return <div key={card.id}>{CardBody}</div>;
            })}
          </div>
        ) : (
          <p className={`rounded-xl ${siteConfig.theme.softSurface} p-4 text-sm ${siteConfig.theme.mutedText}`}>
            Nu exista inca elemente bifate pentru Home. Selecteaza fotografii sau albume din panoul Admin.
          </p>
        )}
      </section>
    </SiteShell>
  );
}
