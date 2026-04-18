import SiteShell from "@/app/layout/SiteShell";
import { siteConfig } from "@/app/layout/siteConfig";

const policies = [
  "Programarile se confirma cu avans.",
  "Reprogramarea se face cu minimum 48h inainte.",
  "Fisierele finale se livreaza digital, in termenul comunicat.",
  "Datele personale si imaginile sunt tratate confidential.",
];

export default function PoliticiPage() {
  return (
    <SiteShell title="Politici" description="Reguli simple pentru programari si livrare.">
      <div className={`${siteConfig.theme.card} mx-auto mt-10 max-w-3xl`}>
        <ul className={`space-y-4 text-base ${siteConfig.theme.mutedText}`}>
          {policies.map((policy) => (
            <li key={policy} className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-rose-400" />
              <span>{policy}</span>
            </li>
          ))}
        </ul>
      </div>
    </SiteShell>
  );
}
