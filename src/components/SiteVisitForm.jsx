"use client";

import { useState } from "react";
import api from "@/lib/api";
import Button from "@/components/Button";
import { CalendarCheck } from "lucide-react";

export default function SiteVisitForm({ propertyId }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", preferredDate: "", message: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/site-visit", { propertyId, ...form });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to book site visit");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-sm border border-brass-500 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-brass-600 hover:bg-brass-500/5"
      >
        <CalendarCheck size={14} /> Book a site visit
      </button>
    );
  }

  return (
    <div className="mt-4 border-t border-ink-800/10 pt-4">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-800/50">Book a site visit</p>

      {sent ? (
        <p className="mt-2 text-sm text-sage-600">
          Request sent — the team will confirm your visit soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
          <input
            required
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
          />
          <input
            required
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
          />
          <input
            required
            type="datetime-local"
            value={form.preferredDate}
            onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
            className="w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
          />
          <textarea
            rows={2}
            placeholder="Anything specific you'd like to check? (optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-sm border border-ink-800/20 px-3 py-2 text-sm focus:border-brass-500 focus:outline-none"
          />
          {error && <p className="text-xs text-rust-500">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Booking..." : "Confirm request"}
          </Button>
        </form>
      )}
    </div>
  );
}