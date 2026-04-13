"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/app/layout/siteConfig";

export default function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={siteConfig.theme.nav}>
      <div className={siteConfig.theme.navWrap}>
        <div className="flex items-center justify-between md:justify-center">
          <p className="text-sm font-semibold tracking-wide text-rose-700 md:hidden">{siteConfig.appName}</p>
          <button
            type="button"
            className={siteConfig.theme.mobileMenuButton}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-label="Deschide navigarea"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        <div className="hidden flex-wrap justify-center gap-2 md:flex">
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

        {isOpen ? (
          <div className={siteConfig.theme.mobileMenuPanel}>
            <div className="grid gap-2">
              {siteConfig.navigation.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${siteConfig.theme.navItem} text-center ${isActive ? siteConfig.theme.navItemActive : ""}`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
