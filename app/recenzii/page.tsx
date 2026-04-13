import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

const reviews = [
  {
    name: "Ana M.",
    text: "Foarte rabdatori si atenti. Am primit fotografii superbe.",
  },
  {
    name: "Ioana P.",
    text: "Atmosfera calma, studio curat si rezultat peste asteptari.",
  },
  {
    name: "Darius T.",
    text: "Comunicare excelenta, livrare rapida si albume foarte frumoase.",
  },
];

export default function RecenziiPage() {
  return (
    <SiteShell title="Recenzii" description="Feedback real de la familii care au lucrat cu noi.">
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {reviews.map((review) => (
          <article
            key={review.name}
            className={siteConfig.theme.card}
          >
            <p className={`text-sm ${siteConfig.theme.mutedText}`}>&quot;{review.text}&quot;</p>
            <p className="mt-4 text-sm font-semibold text-rose-700">{review.name}</p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
