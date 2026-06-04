import Link from "next/link";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

// Map defaults: change these coordinates to the studio location
const MAP_LAT = 45.777045;
const MAP_LNG = 21.221449;
const MAP_ZOOM = 15;

export default function ContactPage() {
  return (
    <SiteShell
      title="Contact"

    >
      <section className="grid gap-6">
        <div className="rounded-[2rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm sm:p-8">

          <h2 className="mt-5 text-center text-3xl font-medium tracking-tight text-[#2B2B2B] sm:text-4xl">
            Scrie-ne pentru o experiență foto calmă, elegantă și bine ghidată.
          </h2>


          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row justify-center">
            <Link
              href="mailto:andreea.albo@gmail.com"
              className="inline-flex items-center  justify-center rounded-full bg-[#2B2B2B] px-6 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1f1f1f]"
            >
              Trimite email
            </Link>
            <Link
              href="tel:+40724430533"
              className="inline-flex items-center justify-center rounded-full border border-[rgba(203,184,169,0.42)] bg-white/70 px-6 py-3.5 text-sm font-medium text-[#2B2B2B] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
            >
              Sună acum
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="rounded-[2rem] border text-center border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm">
            <p className="text-md uppercase font-italic tracking-[0.24em] ">Email</p>
            <p className="mt-3 text-lg font-medium ">andreea.albo@gmail.com</p>

          </div>

          <div className="rounded-[2rem] border text-center border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm">
            <p className="text-md uppercase font-italic tracking-[0.24em]">Telefon</p>
            <p className="mt-3 text-lg font-italic ">+40724430533</p>

          </div>

          <div >

            <div className="mt-3 overflow-hidden ">
              <div className="relative h-56 w-full lg:h-[calc(100vh-6rem)]">
                <iframe
                  title="Studio location map"
                  src={`https://maps.google.com/maps?q=${MAP_LAT},${MAP_LNG}&z=${MAP_ZOOM}&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 flex items-center justify-between">

                <Link
                  href={`https://maps.google.com/?q=${MAP_LAT},${MAP_LNG}`}
                  className="text-sm text-[#2B2B2B] underline"
                  target="_blank"
                >
                  Deschide în Google Maps
                </Link>
              </div>
            </div>
          </div>



        </div>
      </section>
    </SiteShell>
  );
}