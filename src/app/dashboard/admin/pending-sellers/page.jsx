"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import { useToast } from "@/context/ToastContext";
import { UserCheck } from "lucide-react";
import ListSkeleton from "@/components/skeletons/ListSkeleton";

export default function PendingSellersPage() {
  const { showToast } = useToast();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  function fetchPending() {
    setLoading(true);
    api
      .get("/admin/pending-sellers")
      .then(({ data }) => setSellers(data.pendingSellers || []))
      .catch(() => showToast("Failed to load pending sellers", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPending();
  }, []);

  async function handleApprove(id) {
    setBusyId(id);
    try {
      await api.patch(`/admin/approve-seller/${id}`);
      setSellers((prev) => prev.filter((s) => s._id !== id));
      showToast("Seller approved");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to approve seller", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <ListSkeleton rows={3} withThumbnail />;

  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink-950">Pending seller approvals</h1>

      {sellers.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={UserCheck} title="No pending sellers" description="New seller signups awaiting approval will appear here." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {sellers.map((s) => (
            <div key={s._id} className="flex items-center justify-between rounded-sm border border-ink-800/10 p-4">
              <div>
                <p className="font-display text-base text-ink-950">{s.name}</p>
                <p className="text-xs text-ink-800/50">{s.email}</p>
              </div>
              <Button onClick={() => handleApprove(s._id)} disabled={busyId === s._id}>
                {busyId === s._id ? "Approving..." : "Approve"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}