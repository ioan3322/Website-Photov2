import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

export default function ContactPage() {
  return (
    <SiteShell title="Contact" containerClassName="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-14">
      <section className={`${siteConfig.theme.card} rounded-3xl p-8 text-center sm:p-10`}>
        <p className={`text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
          Scrie-ne la andreea.albo@gmail.com sau suna la 0724430533.
        </p>
      </section>
    </SiteShell>
  );
}
