"use client";

import { motion } from "framer-motion";
import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

const reviews = [
  {
    name: "Ana M.",
    text: "Foarte răbdători și atenți. Am primit fotografii superbe.",
  },
  {
    name: "Ioana P.",
    text: "Atmosfera calmă, studio curat și rezultat peste așteptări.",
  },
  {
    name: "Darius T.",
    text: "Comunicare excelentă, livrare rapidă și albume foarte frumoase.",
  },
];

export default function RecenziiPage() {
  return (
    <SiteShell
      title="Recenzii"
      description="Feedback real de la familii care au lucrat cu noi."
      containerClassName="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <section className="space-y-8">
        <div className="max-w-3xl">
          <p className={siteConfig.theme.badge}>Încredere</p>
          <p className={`mt-5 text-base sm:text-lg ${siteConfig.theme.mutedText}`}>
            Am transformat recenziile într-un ritm vizual calm, cu carduri spațiate generos și accent pe citat.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <motion.article
              key={review.name}
              className="rounded-[1.75rem] border border-[rgba(203,184,169,0.22)] bg-white/75 p-6 shadow-[0_16px_44px_rgba(43,43,43,0.05)] backdrop-blur-sm"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <p className="text-4xl leading-none text-[#c7b39f]">“</p>
              <p className={`mt-4 text-base ${siteConfig.theme.mutedText}`}>{review.text}</p>
              <p className="mt-6 text-sm font-medium tracking-wide text-[#2B2B2B]">{review.name}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}