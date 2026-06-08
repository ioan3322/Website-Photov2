"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Eroare la trimitere");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err: any) {
      setError(err?.message || "Eroare necunoscuta");
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-3">
      <input
        placeholder="Nume"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none"
        />
        <input
          placeholder="Telefon"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none"
        />
      </div>

      <textarea
        placeholder="Mesaj"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full min-h-[120px] rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-sm outline-none"
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center justify-center rounded-full bg-rose-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          {status === "sending" ? "Se trimite..." : "Trimite mesaj"}
        </button>
        {status === "success" ? (
          <p className="text-sm text-emerald-700">Mesaj trimis — îți mulțumim!</p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-red-700">Eroare: {error}</p>
        ) : null}
      </div>
    </form>
  );
}
