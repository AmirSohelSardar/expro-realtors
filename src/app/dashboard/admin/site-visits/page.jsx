"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { propertyUrl } from "@/lib/utils";
import { CalendarCheck, Phone } from "lucide-react";

const STATUS_STYLES = {
  pending: "bg-brass-500/10 text-brass-600",
  confirmed: "bg-sage-500/10 text-sage-600",
  cancelled: "bg-rust-500/10 text-rust-500",
  completed: "bg-ink-800/10 text-ink-800/70",
};

export default function AdminSiteVisitsPage() {
  const { showToast } = useToast();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api
      .get("/admin/site-visits")
      .then(({ data }) => setVisits(data.siteVisits || []))
      .catch(() => showToast("Failed to load site visits", "error"))
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id, status) {
    setBusyId(id);
    try {
      await api.patch(`/admin/site-visits/${id}/status`, { status });
      setVisits((prev) => prev.map((v) => (v._id === id ? { ...v, status } : v)));
      showToast("Status updated");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink-950">Site visit requests</h1>
      <p className="mt-1 text-sm text-ink-800/60">{visits.length} total</p>

      {visits.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={CalendarCheck} title="No site visits yet" description="Buyer-requested visits will show up here." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {visits.map((v) => (
            <div key={v._id} className="rounded-sm border border-ink-800/10 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-display text-base text-ink-950">{v.name}</p>
                  <p className="flex items-center gap-1 text-xs text-ink-800/50">
                    <Phone size={11} /> {v.phone}
                  </p>
                </div>
                <span className={`rounded-sm px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest ${STATUS_STYLES[v.status]}`}>
                  {v.status}
                </span>
              </div>

              <Link href={v.property ? propertyUrl(v.property) : "#"} className="mt-2 inline-block text-xs text-brass-600 hover:underline">
                {v.property?.title}
              </Link>

              <p className="mt-1 text-xs text-ink-800/50">
                Preferred: {new Date(v.preferredDate).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-ink-800/50">
                Buyer: {v.buyer?.name} ({v.buyer?.email}) — Seller: {v.seller?.name}
              </p>
              {v.message && <p className="mt-2 text-sm text-ink-800/80">{v.message}</p>}

              <div className="mt-3 flex flex-wrap gap-2">
                {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => updateStatus(v._id, s)}
                    disabled={busyId === v._id || v.status === s}
                    className={`rounded-sm border px-3 py-1.5 text-xs font-mono uppercase tracking-widest ${
                      v.status === s ? "border-ink-800/10 bg-ink-800/5 text-ink-800/40" : "border-ink-800/20 hover:border-brass-500"
                    }`}
                  >
                    Mark {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}