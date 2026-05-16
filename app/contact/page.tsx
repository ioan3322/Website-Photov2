import Link from "next/link";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

export default function ContactPage() {
  return (
    <SiteShell
      title="Contact"
      description="Rezervă o ședință foto sau cere detalii despre disponibilitate și pachete."
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="rounded-[2rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm sm:p-8">
          <p className={siteConfig.theme.badge}>Rezervări</p>
          <h2 className="mt-5 text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
            Scrie-ne pentru o experiență foto calmă, elegantă și bine ghidată.
          </h2>
          <p className={`mt-6 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
            Pentru programări, întrebări despre pachete sau detalii despre ședințele pentru nou-născuți și familie, poți folosi canalele de mai jos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="mailto:andreea.albo@gmail.com"
              className="inline-flex items-center justify-center rounded-full bg-[#2B2B2B] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f1f1f]"
            >
              Trimite email
            </Link>
            <Link
              href="tel:0724430533"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(203,184,169,0.42)] bg-white/70 px-6 py-3.5 text-sm font-medium text-[#2B2B2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Sună acum
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-[2rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Email</p>
            <p className="mt-3 text-lg font-medium text-[#2B2B2B]">andreea.albo@gmail.com</p>
            <p className={`mt-3 text-sm ${siteConfig.theme.mutedText}`}>
              Recomandat pentru programări, disponibilitate și detalii despre pachete.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Telefon</p>
            <p className="mt-3 text-lg font-medium text-[#2B2B2B]">0724430533</p>
            <p className={`mt-3 text-sm ${siteConfig.theme.mutedText}`}>
              Pentru răspuns rapid și confirmarea unei ferestre de programare.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8b7c6f]">Program</p>
            <p className="mt-3 text-lg font-medium text-[#2B2B2B]">Pe bază de programare</p>
            <p className={`mt-3 text-sm ${siteConfig.theme.mutedText}`}>
              Spune-ne ce tip de ședință îți dorești și îți răspundem cu pașii următori.
            </p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}