"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { useToast } from "@/context/ToastContext";
import { formatPrice, propertyUrl } from "@/lib/utils";
import { ClipboardCheck, Check, X } from "lucide-react";
import ListSkeleton from "@/components/skeletons/ListSkeleton";

export default function PendingPropertiesPage() {
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  function fetchPending() {
    setLoading(true);
    api
      .get("/admin/pending-properties")
      .then(({ data }) => setProperties(data.pendingProperties || []))
      .catch(() => showToast("Failed to load pending properties", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPending();
  }, []);

  async function handleApprove(id) {
    setBusyId(id);
    try {
      await api.patch(`/admin/approve-property/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      showToast("Property approved and is now live");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to approve property", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function handleReject(id) {
    if (!confirm("Reject and permanently delete this listing?")) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/reject-property/${id}`);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      showToast("Property rejected");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to reject property", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <ListSkeleton rows={3} withThumbnail />;

  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink-950">Pending property approvals</h1>
      <p className="mt-1 text-sm text-ink-800/60">{properties.length} awaiting review</p>

      {properties.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={ClipboardCheck} title="No pending properties" description="New listings awaiting verification will appear here." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {properties.map((p) => (
            <div key={p._id} className="flex flex-col gap-4 rounded-sm border border-ink-800/10 p-4 sm:flex-row sm:items-center">
              <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-sm bg-ink-900">
                {p.images?.[0] && <Image src={p.images[0]} alt={p.title} fill sizes="128px" className="object-cover" />}
              </div>

              <div className="flex-1">
                <Link href={propertyUrl(p)} className="font-display text-lg text-ink-950 hover:text-brass-600 hover:underline">
                  {p.title}
                </Link>
                <p className="mt-1 text-sm text-ink-800/60">
                  {p.area}, {p.city} — listed by {p.seller?.name}
                </p>
                <p className="mt-1 font-mono text-sm tabular-nums text-brass-600">{formatPrice(p.price)}</p>
                <p className="mt-1 text-xs text-ink-800/50">
                  Submitted {new Date(p.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  onClick={() => handleApprove(p._id)}
                  disabled={busyId === p._id}
                  className="flex items-center gap-1.5"
                >
                  <Check size={14} /> Approve
                </Button>
                <button
                  onClick={() => handleReject(p._id)}
                  disabled={busyId === p._id}
                  className="flex items-center gap-1.5 rounded-sm border border-rust-500/30 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-rust-500 hover:bg-rust-500/5"
                >
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}