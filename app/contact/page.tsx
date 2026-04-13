import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

export default function ContactPage() {
  return (
    <SiteShell title="Contact" containerClassName="mx-auto justify-right w-full max-w-3xl px-6 py-12">
      <section className={`${siteConfig.theme.card} rounded-3xl text-center`}>
        <p className={`mt-4 ${siteConfig.theme.mutedText}`}>
          Scrie-ne la andreea.albo@gmail.com sau suna la 0724430533.
        </p>
      </section>
    </SiteShell>
  );
}
