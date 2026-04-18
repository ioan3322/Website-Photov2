import Container from "@/app/components/ui/Container";
import RevealOnScroll from "@/app/components/ui/RevealOnScroll";
import SurfaceCard from "@/app/components/ui/SurfaceCard";
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
      <Container>
        <RevealOnScroll>
          {/* Elevate trust by spacing testimonials as premium cards. */}
          <div className="mt-10 grid gap-5 md:grid-cols-3 md:gap-6">
            {reviews.map((review) => (
              <SurfaceCard key={review.name} className="flex h-full flex-col justify-between">
                <p className={`text-base ${siteConfig.theme.mutedText}`}>&quot;{review.text}&quot;</p>
                <p className="mt-6 text-sm font-semibold text-rose-700">{review.name}</p>
              </SurfaceCard>
            ))}
          </div>
        </RevealOnScroll>
      </Container>
    </SiteShell>
  );
}
