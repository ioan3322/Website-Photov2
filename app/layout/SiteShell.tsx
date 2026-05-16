import type { ReactNode } from "react";
import SiteNav from "@/app/layout/SiteNav";
import { siteConfig } from "@/app/layout/siteConfig";

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
  return (
    <div className={siteConfig.theme.pageBackground}>
      <SiteNav />
      <main className={`${containerClassName || siteConfig.theme.contentWrap} pb-24 md:pb-32`}>
        {showHeader ? (
          <header className="mx-auto mb-10 max-w-4xl text-center sm:mb-14">
            <p className={`${siteConfig.theme.badge} mb-4`}>Little Lights Studio</p>
            <h1 className="text-4xl font-medium tracking-tight text-[#2B2B2B] sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className={`mx-auto mt-4 max-w-2xl text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
                {description}
              </p>
            ) : null}
          </header>
        ) : null}
        <div className="mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
