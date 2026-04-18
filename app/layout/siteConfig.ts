export const siteConfig = {
  appName: "Little Lights Studio",
  theme: {
    pageBackground:
      "min-h-screen bg-[radial-gradient(circle_at_top,_#fff7f7_0%,_#fff_40%,_#fff8f3_100%)] text-slate-800",
    nav:
      "sticky bottom-0 z-40 border-b border-rose-100/80 bg-white/90 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80",
    navWrap: "mx-auto w-full max-w-6xl px-4 py-4 sm:px-8",
    card:
      "rounded-2xl border border-rose-100/90 bg-white/95 p-4 shadow-md shadow-rose-100/40 transition-all duration-300 hover:shadow-lg hover:shadow-rose-100/60 sm:p-5",
    navItem:
      "rounded-full border border-rose-100 px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700",
    navItemActive:
      "border-rose-300 bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 shadow-sm",
    mobileMenuButton:
      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-700 shadow-sm transition hover:bg-rose-50 md:hidden",
    mobileMenuPanel: "mt-3 rounded-2xl border border-rose-100 bg-white p-2 shadow-lg md:hidden",
    contentWrap: "mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:py-16",

    mutedText: "text-slate-600 leading-relaxed",
    softSurface: "bg-gradient-to-br from-rose-50 via-white to-amber-50",
    badge:
      "inline-flex rounded-full border border-rose-200 bg-rose-50/90 px-4 py-1 text-sm font-semibold tracking-wide text-rose-700 shadow-sm",
  },
  navigation: [
    { href: "/acasa", label: "Acasa" },
    { href: "/galerie", label: "Galerie" },
    { href: "/albume", label: "Albume" },
    { href: "/recenzii", label: "Recenzii" },
    { href: "/politici", label: "Politici" },
    { href: "/fotograf", label: "Fotograf" },
    { href: "/contact", label: "Contact" },
  ],
} as const;
