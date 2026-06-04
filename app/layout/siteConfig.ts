export const siteConfig = {
  appName: "Andreea Albo- Photography",
  theme: {
    pageBackground:
      "min-h-screen bg-[#FAF8F5] text-[#2B2B2B] [background-image:radial-gradient(circle_at_top,_rgba(203,184,169,0.18)_0,_transparent_32%),linear-gradient(180deg,#FAF8F5_0%,#F8F5F1_100%)]",
    navWrap: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",
    card:
      "rounded-[1.75rem] border border-[rgba(203,184,169,0.24)] bg-white/78 p-5 shadow-[0_18px_50px_rgba(43,43,43,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_64px_rgba(43,43,43,0.1)] sm:p-6",
    navItem:
      "rounded-full border border-transparent px-4 py-2 text-sm font-medium tracking-wide text-[#3b342f] transition-all duration-300 hover:border-[rgba(203,184,169,0.45)] hover:bg-white/75 hover:text-[#2B2B2B]",
    navItemActive:
      "border-[rgba(203,184,169,0.6)] bg-white/85 text-[#2B2B2B] shadow-[0_10px_30px_rgba(43,43,43,0.06)]",
    mobileMenuButton:
      "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(203,184,169,0.35)] bg-white/80 text-[#2B2B2B] shadow-sm transition hover:bg-white md:hidden",
    mobileMenuPanel: "mt-3 rounded-[1.5rem] border border-[rgba(203,184,169,0.24)] bg-white/90 p-2 shadow-lg md:hidden",
    contentWrap: "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8",

    mutedText: "text-[#5d5851] leading-relaxed",
    softSurface: "bg-gradient-to-br from-[#F8F5F1] via-white to-[#FAF8F5]",
    badge:
      "inline-flex rounded-full border border-[rgba(203,184,169,0.4)] bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7b6959] shadow-[0_10px_30px_rgba(43,43,43,0.04)]",
  },
  navigation: [
    { href: "/acasa", label: "Acasa" },
    { href: "/galerie", label: "Galerie" },
    { href: "/albume", label: "Albume" },
    { href: "/recenzii", label: "Recenzii" },
    { href: "/pachete", label: "Pachete" },
    { href: "/fotograf", label: "Fotograf" },
    { href: "/contact", label: "Contact" },
  ],
} as const;
