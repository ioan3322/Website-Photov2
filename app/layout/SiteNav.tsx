"use client";

import Link from "next/link";
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
    case "/politici":
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

  return (
    <>
      <nav className="sticky top-0 z-40 hidden border-b border-rose-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 md:block">
        <div className={siteConfig.theme.navWrap}>
          <div className="flex flex-wrap justify-center gap-2">
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
        </div>
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-rose-100 bg-white/95 px-2 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/85 md:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-7 gap-1">
          {siteConfig.navigation.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-label={link.label}
                title={link.label}
                className={`flex h-11 w-full items-center justify-center rounded-xl border text-slate-700 transition ${
                  isActive
                    ? "border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700"
                    : "border-transparent hover:border-rose-200 hover:bg-rose-50"
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
