"use client";

import type { ReactNode } from "react";
import { siteConfig } from "@/app/layout/siteConfig";
import { useStudioContent } from '@/hooks/useStudioContent';
import SiteNav from "@/app/layout/SiteNav";
import Link from "next/link";

type SiteShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  containerClassName?: string;
  showHeader?: boolean;
};

export default function SiteShell({
  title,
  description,
  children,
  containerClassName,
  showHeader = true,
}: SiteShellProps) {
  const { content } = useStudioContent();
  const heroImage = content?.heroImage;
  return (
    <div className={siteConfig.theme.pageBackground}>
      <SiteNav />
      <main className={`${containerClassName || siteConfig.theme.contentWrap} pb-24 md:pb-32`}>
        {showHeader ? (
          <header className="mx-auto mb-10 max-w-6xl sm:mb-14">
            <div className="relative isolate min-h-[280px] overflow-hidden rounded-[1.5rem] sm:min-h-[340px] lg:min-h-[420px]">
              {/* Background image or fallback illustration */}
              {heroImage ? (
                <div
                  className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
              ) : (
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/60 via-transparent to-white/60" />
              )}

              {/* Gradient overlay for readability */}
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-black/60 to-black/25" />

              <div className="relative z-20 flex min-h-[280px] flex-col items-center text-top justify-center px-6 py-16 text-center sm:min-h-[340px] sm:py-20 lg:min-h-[420px] lg:py-28">

                <h1 className="mx-auto max-w-4xl text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {title}
                </h1>



              </div>
            </div>
          </header>
        ) : null}
        <div className="mx-auto w-full">{children}</div>
      </main>

      <footer className="bg-black text-white">
        <div className={`${siteConfig.theme.contentWrap} py-12`}>
          <div className="mx-auto w-full">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium">Andreea Albo</p>
                <p className="text-xs text-[#bfbfbf]">Fotograf • Timișoara</p>
              </div>

              <nav aria-label="Footer navigation" className="flex  items-start gap-3 sm:flex-row sm:items-center">
                <Link href="/" className="text-sm hover:underline">Acasă</Link>
                <Link href="/albume" className="text-sm hover:underline">Albume</Link>
                <Link href="/galerie" className="text-sm hover:underline">Galerie</Link>
                <Link href="/contact" className="text-sm hover:underline">Contact</Link>
                <Link href="/recenzii" className="text-sm hover:underline">Recenzii</Link>
                <Link href="/pachete" className="text-sm hover:underline">Pachete</Link>
              </nav>

              <div className="space-y-2 text-sm">
                <p className="text-sm">Email: <Link href="mailto:andreea.albo@gmail.com" className="underline">andreea.albo@gmail.com</Link></p>
                <p className="text-sm">Tel: <Link href="tel:+40724430533" className="underline">+40 724 430 533</Link></p>

                <div className="mt-2 flex items-center gap-3">
                  <a href="#" aria-label="Instagram" target="_blank" className="rounded-full bg-white/6 p-2 hover:bg-white/12">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>

                  <a href="#" aria-label="Facebook" target="_blank" className="rounded-full bg-white/6 p-2 hover:bg-white/12">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="https://www.facebook.com/AndreeaAlbo" className="text-white">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z" fill="currentColor" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6 text-sm text-[#bfbfbf] flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
              <p>© {new Date().getFullYear()} Andreea Albo. Toate drepturile rezervate.</p>
              <div className="flex gap-4">
                <Link href="/pachete" className="hover:underline">Politica de confidențialitate</Link>
                <Link href="/pachete" className="hover:underline">Termeni și condiții</Link>
                <Link href="/sitemap.xml" className="hover:underline">Sitemap</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
