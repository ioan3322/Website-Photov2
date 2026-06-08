"use client";

import { useEffect, useState } from "react";

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
};

export default function ContactMessages() {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch("/api/messages", { credentials: "include" });
        if (!res.ok) {
          // not authorized or no messages
          return;
        }
        const data = await res.json();
        if (!mounted) return;
        setMsgs(data.messages || []);
      } catch (err: any) {
        setError(err?.message || "Eroare la încărcare");
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (!msgs || msgs.length === 0) return null;

  return (
    <div className="mt-4 rounded-[1rem] border border-[rgba(203,184,169,0.14)] bg-white/85 p-4 text-left">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Mesaje primite</h3>
      <div className="max-h-64 overflow-auto space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className=" rounded-lg border border-rose-100 bg-rose-50/40 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="text-slate-800 font-medium">{m.name || "Anonim"}</div>
              <div className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleString()}</div>
            </div>
            <div className="mt-1 text-xs text-slate-600">{m.phone || m.email}</div>
            <div className="mt-2 text-slate-700">{m.message}</div>
          </div>
        ))}
      </div>
      {error ? <p className="mt-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
