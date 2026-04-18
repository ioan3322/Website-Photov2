"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/app/layout/siteConfig";

export default function AdminAuthPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error || "Autentificare esuata.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Autentificare esuata.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={`${siteConfig.theme.pageBackground} min-h-screen px-4 py-10 sm:px-6 sm:py-16`}>
      <div className="mx-auto w-full max-w-md">
        <section className={`${siteConfig.theme.card} rounded-3xl p-6 sm:p-8`}>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Admin Login</h1>
          <p className={`mt-2 text-sm ${siteConfig.theme.mutedText}`}>
            Introdu user si parola pentru acces in panoul admin.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              User
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                required
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Parola
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-300 focus:ring-2 focus:ring-rose-100"
                required
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Se autentifica..." : "Conectare"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
