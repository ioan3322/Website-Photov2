import Link from "next/link";

const links = [
  { href: "/acasa", label: "Acasa" },
  { href: "/galerie", label: "Galerie" },
  { href: "/albume", label: "Albume" },
  { href: "/recenzii", label: "Recenzii" },
  { href: "/politici", label: "Pachete" },
  { href: "/fotograf", label: "Fotograf" },
  { href: "/contact", label: "Contact" },
];

export default function StudioNav() {
  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-black/90">
      <div className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-3 sm:px-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-full border border-transparent px-4 py-2 text-sm font-semibold text-gray-800 transition hover:border-gray-300 hover:bg-gray-100 dark:text-gray-100 dark:hover:border-gray-700 dark:hover:bg-gray-900"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
