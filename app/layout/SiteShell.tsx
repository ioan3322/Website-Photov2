import type { ReactNode } from "react";
import SiteNav from "@/app/layout/SiteNav";
import { siteConfig } from "@/app/layout/siteConfig";

type SiteShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
  containerClassName?: string;
};

export default function SiteShell({
  title,
  description,
  children,
  containerClassName,
}: SiteShellProps) {
  return (
    <div className={siteConfig.theme.pageBackground}>
      <SiteNav />
      <main className={`${containerClassName || siteConfig.theme.contentWrap} pb-24 md:pb-14`}>
        {/* Keep one strong, centered page intro to improve hierarchy across all pages. */}
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">{title}</h1>
          {description ? (
            <p className={`mx-auto mt-3 max-w-2xl text-base sm:text-lg ${siteConfig.theme.mutedText}`}>{description}</p>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
