"use client";

import { useEffect, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export default function MessageList() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/messages", { credentials: "include" });
        if (res.status === 401) {
          setError("Acces restricționat. Autentificare admin necesară.");
          setMessages([]);
          return;
        }

        if (!res.ok) {
          setError(`Eroare la preluarea mesajelor (${res.status})`);
          return;
        }

        const payload = await res.json();
        if (mounted) setMessages(payload.messages || []);
      } catch (err) {
        setError("Eroare de rețea la preluarea mesajelor.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p>Se încarcă mesaje...</p>;
  if (error) return <p className="text-red-700">{error}</p>;
  if (!messages || messages.length === 0) return <p>Nu există mesaje.</p>;

  return (
    <div className="space-y-4">
      {messages.map((m) => (
        <article key={m.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-slate-600">{new Date(m.createdAt).toLocaleString()}</div>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{m.name || "Anonim"}</h3>
              <div className="mt-1 text-sm text-slate-700">{m.message}</div>
            </div>

            <div className="text-sm text-slate-600 text-right">
              <div className="font-medium text-slate-800">{m.phone || "-"}</div>
              <div className="mt-1">{m.email || "-"}</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
