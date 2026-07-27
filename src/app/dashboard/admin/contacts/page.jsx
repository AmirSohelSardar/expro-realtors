"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import { Mail, Search, Phone } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminContactsPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  useEffect(() => {
    api
      .get("/contact")
      .then(({ data }) => setContacts(data.contacts || []))
      .catch(() => showToast("Failed to load contact messages", "error"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  if (loading) return <Spinner />;

  const filtered = contacts.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-ink-950">Contact messages</h1>
          <p className="mt-1 text-sm text-ink-800/60">{filtered.length} of {contacts.length} total</p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40" />
          <input
            placeholder="Search name, email, message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 rounded-sm border border-ink-800/20 py-2 pl-8 pr-3 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Mail} title="No messages yet" description="Messages submitted through the contact form will appear here." />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3">
            {paginated.map((c) => (
              <div key={c._id} className="rounded-sm border border-ink-800/10 p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-base text-ink-950">{c.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-800/50">
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {c.email}
                      </span>
                      {c.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {c.phone}
                        </span>
                      )}
                      <span className="rounded-sm bg-brass-500/10 px-2 py-0.5 font-mono uppercase tracking-widest text-brass-600">
                        {c.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-ink-800/40">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-sm text-ink-800/80">{c.message}</p>
              </div>
            ))}
            {paginated.length === 0 && (
              <p className="py-8 text-center text-ink-800/50">No messages match &ldquo;{query}&rdquo;</p>
            )}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}