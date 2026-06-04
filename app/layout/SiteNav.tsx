"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/app/layout/siteConfig";

function NavIcon({ href }: { href: string }) {
  switch (href) {
    case "/acasa":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5 12 4l9 7.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 10.5V20h14v-9.5" />
        </svg>
      );
    case "/galerie":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="8.5" cy="9" r="1.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 16-5-5-6 6" />
        </svg>
      );
    case "/albume":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18" />
        </svg>
      );
    case "/recenzii":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 18l-5.8 3 1.1-6.5L2.6 9.8l6.5-.9z" />
        </svg>
      );
    case "/pachete":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 4h10l2 3v13H5V7z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 11h6M9 15h6" />
        </svg>
      );
    case "/fotograf":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <circle cx="12" cy="13.5" r="3.5" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7 9.5 4h5L16 7" />
        </svg>
      );
    case "/contact":
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m4 7 8 6 8-6" />
        </svg>
      );
    default:
      return (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

export default function SiteNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 12);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <>
      <nav
        className={`sticky top-0 z-50 hidden border-b backdrop-blur-xl transition-all duration-500 supports-[backdrop-filter]:backdrop-blur-xl md:block ${isScrolled
            ? "border-[rgba(203,184,169,0.28)] bg-white/86 shadow-[0_18px_50px_rgba(43,43,43,0.08)]"
            : "border-transparent bg-transparent shadow-none"
          }`}
      >
        <div className={`${siteConfig.theme.navWrap} py-4 lg:py-5`}>
          <div className="flex items-center justify-between gap-6">
            <Link href="/acasa" className="flex flex-col gap-0.5 text-left">
              <span className="text-xs uppercase tracking-[0.34em] text-[#8b7c6f]">Studio foto premium</span>
              <span className="text-lg font-medium tracking-tight text-[#2B2B2B]">{siteConfig.appName}</span>
            </Link>

            <div className="flex flex-1 flex-wrap items-center justify-center gap-2 lg:gap-3">
              {siteConfig.navigation.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${siteConfig.theme.navItem} ${isActive ? siteConfig.theme.navItemActive : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-[rgba(203,184,169,0.4)] bg-[#2B2B2B] px-5 py-2.5 text-sm font-medium text-white shadow-[0_12px_28px_rgba(43,43,43,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f1f1f]"
            >
              Rezervă ședința
            </Link>
          </div>
        </div>
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[rgba(203,184,169,0.24)] bg-white/92 px-2 py-2 shadow-[0_-18px_40px_rgba(43,43,43,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-7 gap-1.5">
          {siteConfig.navigation.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                title={link.label}
                className={`flex h-11 w-full items-center justify-center rounded-xl border text-slate-700 transition-all duration-300 ${isActive
                    ? "border-[rgba(203,184,169,0.55)] bg-white text-[#2B2B2B] shadow-sm"
                    : "border-transparent hover:border-[rgba(203,184,169,0.32)] hover:bg-[#FAF8F5] active:scale-95"
                  }`}
              >
                <NavIcon href={link.href} />
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
