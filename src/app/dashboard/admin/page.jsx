"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Skeleton from "@/components/Skeleton";
import { Users, Home, Eye, CheckCircle } from "lucide-react";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data.stats))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users },
    { label: "Total Properties", value: stats?.totalProperties ?? 0, icon: Home },
    { label: "Active Listings", value: stats?.activeListings ?? 0, icon: Eye },
    { label: "Sold Properties", value: stats?.soldProperties ?? 0, icon: CheckCircle },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink-950">Admin Overview</h1>
      <p className="mt-1 text-sm text-ink-800/60">Platform stats at a glance.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-sm border border-ink-800/10 p-5">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="mt-3 h-7 w-16" />
                <Skeleton className="mt-2 h-3 w-24" />
              </div>
            ))
          : cards.map((c) => (
              <div key={c.label} className="rounded-sm border border-ink-800/10 p-5">
                <c.icon size={20} className="text-brass-500" />
                <p className="mt-3 font-mono text-2xl tabular-nums text-ink-950">{c.value}</p>
                <p className="mt-1 text-xs text-ink-800/60">{c.label}</p>
              </div>
            ))}
      </div>
    </div>
  );
}