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
      <main className={`${containerClassName || siteConfig.theme.contentWrap} pb-24 md:pb-12`}>
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description ? (
            <p className={`mt-2 ${siteConfig.theme.mutedText}`}>{description}</p>
          ) : null}
        </header>
        {children}
      </main>
    </div>
  );
}
