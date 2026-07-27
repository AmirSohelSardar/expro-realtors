"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { formatPrice } from "@/lib/utils";
import { Home, Pencil, Trash2, Plus, Clock } from "lucide-react";

export default function MyPropertiesPage() {
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  function fetchMine() {
    setLoading(true);
    api
      .get("/property/my")
      .then(({ data }) => setProperties(data.properties || []))
      .catch(() => showToast("Failed to load your properties", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchMine();
  }, []);

  async function toggleStatus(p) {
    setBusyId(p._id);
    try {
      const newStatus = p.status === "sale" ? "sold" : "sale";
      await api.patch(`/property/${p._id}/status`, { status: newStatus });
      setProperties((prev) => prev.map((x) => (x._id === p._id ? { ...x, status: newStatus } : x)));
      showToast(`Marked as ${newStatus}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await api.delete(`/property/${id}`);
      setProperties((prev) => prev.filter((x) => x._id !== id));
      showToast("Property deleted");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete property", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl italic text-ink-950">My properties</h1>
        <Link
          href="/dashboard/seller/properties/new"
          className="flex items-center gap-1.5 rounded-sm bg-brass-500 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 hover:bg-brass-400"
        >
          <Plus size={14} /> Add property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Home} title="No properties yet" description="Add your first listing to get started." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {properties.map((p) => (
            <div key={p._id} className="flex flex-col gap-4 rounded-sm border border-ink-800/10 p-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-sm bg-ink-900">
                {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill sizes="128px" className="object-cover" />}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-lg text-ink-950">{p.title}</h3>
                  <span
                    className={`rounded-sm px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${
                      p.status === "sale" ? "bg-sage-500/10 text-sage-600" : "bg-rust-500/10 text-rust-500"
                    }`}
                  >
                    {p.status}
                  </span>
                  {!p.isVerified && (
                    <span className="flex items-center gap-1 rounded-sm bg-brass-500/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-brass-600">
                      <Clock size={10} /> Pending verification
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-ink-800/60">
                  {p.area}, {p.city}
                </p>
                <p className="mt-1 font-mono text-sm tabular-nums text-brass-600">{formatPrice(p.price)}</p>
                <p className="mt-1 text-xs text-ink-800/50">{p.views} views</p>
                {!p.isVerified && (
                  <p className="mt-1 text-xs text-ink-800/50">
                    This listing is hidden from buyers until an admin approves it.
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => toggleStatus(p)}
                  disabled={busyId === p._id}
                  className="rounded-sm border border-ink-800/20 px-3 py-2 text-xs font-mono uppercase tracking-widest hover:border-brass-500"
                >
                  Mark {p.status === "sale" ? "sold" : "for sale"}
                </button>
                <Link
                  href={`/dashboard/seller/properties/${p._id}/edit`}
                  className="rounded-sm border border-ink-800/20 p-2 hover:border-brass-500"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={busyId === p._id}
                  className="rounded-sm border border-ink-800/20 p-2 hover:border-rust-500"
                >
                  <Trash2 size={16} className="text-rust-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}