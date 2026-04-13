export const siteConfig = {
  appName: "Little Lights Studio",
  theme: {
    pageBackground: "min-h-screen bg-white text-slate-800",
    nav:
      "sticky top-0 z-40 border-b border-black-600 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85",
    navWrap: "mx-auto w-full max-w-4xl px-4 py-3 sm:px-8",
    card: "rounded-2xl border border-rose-100 bg-white shadow-sm",
    navItem:
      "rounded-full border border-green-600 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700",
    navItemActive:
      "border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 shadow-sm",
    mobileMenuButton:
      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-700 shadow-sm transition hover:bg-rose-50 md:hidden",
    mobileMenuPanel: "mt-3 rounded-2xl border border-rose-100 bg-white p-2 shadow-lg md:hidden",
    contentWrap: "mx-auto w-full max-w-6xl px-6 py-12",

    mutedText: "text-slate-600",
    softSurface: "bg-gradient-to-br from-rose-50 via-white to-amber-50",
    badge: "inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-sm font-medium text-rose-700",
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
