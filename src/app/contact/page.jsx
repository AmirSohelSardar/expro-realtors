"use client";

import { useState } from "react";
import api from "@/lib/api";
import Button from "@/components/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "buyer", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", role: "buyer", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl italic text-ink-950">Get in touch</h1>
      <p className="mt-2 text-sm text-ink-800/60">Questions about a listing or your account? Send us a message.</p>

      {sent ? (
        <div className="mt-8 rounded-sm border border-sage-500/30 bg-sage-500/5 p-5 text-sm text-sage-600">
          Thanks — your message has been sent. We&apos;ll get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">I am a</label>
            <div className="mt-1.5 flex gap-3">
              {["buyer", "seller"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`flex-1 rounded-sm border px-3 py-2.5 text-xs font-mono uppercase tracking-widest ${
                    form.role === r ? "border-brass-500 bg-brass-500/10 text-brass-600" : "border-ink-800/20 text-ink-800/60"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-rust-500">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Sending..." : "Send message"}
          </Button>
        </form>
      )}
    </div>
  );
}