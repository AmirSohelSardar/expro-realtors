"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import Pagination from "@/components/Pagination";
import { useToast } from "@/context/ToastContext";
import { formatPrice, propertyUrl } from "@/lib/utils";
import { Trash2, Search } from "lucide-react";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

const PAGE_SIZE = 10;

export default function AdminPropertiesPage() {
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  function fetchProperties() {
    setLoading(true);
    api
      .get("/admin/properties")
      .then(({ data }) => setProperties(data.properties || []))
      .catch(() => showToast("Failed to load properties", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  async function handleDelete(id) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/properties/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      showToast("Property deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete property", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <TableSkeleton rows={6} cols={4} />;

  const filtered = properties.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      p.title?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q) ||
      p.seller?.name?.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-ink-950">All properties</h1>
          <p className="mt-1 text-sm text-ink-800/60">{filtered.length} of {properties.length} total</p>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-800/40" />
          <input
            placeholder="Search title, city, seller..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64 rounded-sm border border-ink-800/20 py-2 pl-8 pr-3 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-sm border border-ink-800/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-800/10 bg-paper-100/60 font-mono text-xs uppercase tracking-widest text-ink-800/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Seller</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-800/10">
            {paginated.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3">
                <Link href={propertyUrl(p)} className="hover:text-brass-600 hover:underline">
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-800/60">{p.seller?.name}</td>
                <td className="px-4 py-3 font-mono tabular-nums">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-sm px-2 py-0.5 text-xs capitalize ${
                      p.status === "sale" ? "bg-sage-500/10 text-sage-600" : "bg-rust-500/10 text-rust-500"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={busyId === p._id}
                    className="rounded-sm border border-ink-800/20 p-1.5 hover:border-rust-500"
                  >
                    <Trash2 size={14} className="text-rust-500" />
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink-800/50">
                  No properties match &ldquo;{query}&rdquo;
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}