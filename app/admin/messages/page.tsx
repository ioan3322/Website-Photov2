import MessageList from "./MessageList";
import { siteConfig } from "@/app/layout/siteConfig";

export default function AdminMessagesPage() {
  return (
    <div className={`${siteConfig.theme.pageBackground} relative overflow-hidden`}>      
      <main className="relative mx-auto w-full max-w-4xl px-4 py-10 text-left sm:px-6 lg:px-8 lg:py-12">
        <header className="mb-6">
          <p className={siteConfig.theme.badge}>Panou admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Mesaje primite de la clienți</h1>
          <p className={`mt-2 text-sm ${siteConfig.theme.mutedText}`}>Aici apar mesajele trimise prin formularul de contact.</p>
        </header>

        <section>
          <MessageList />
        </section>
      </main>
    </div>
  );
}
