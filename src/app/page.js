"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { Home } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import PropertyGridSkeleton from "@/components/skeletons/PropertyGridSkeleton";

const HOME_PAGE_SIZE = 6;

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [counts, setCounts] = useState({});

  const fetchHome = useCallback(() => {
    setLoading(true);
    setLoadError(false);
    api
      .get("/property")
      .then(({ data }) => setProperties(data.properties || []))
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
    api.get("/property/counts").then(({ data }) => setCounts(data.counts || {})).catch(() => {});
  }, []);

  useEffect(() => {
    fetchHome();
  }, [fetchHome]);

  function handleViewMore() {
    if (!user) {
      router.push("/login?redirect=/properties");
      return;
    }
    router.push("/properties");
  }

  return (
    <div>
     <section className="relative overflow-hidden border-b border-navy-800 bg-navy-900">
  <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass-400">
      Verified Listings • Trusted Agents • Zero Brokerage
    </p>
    <h1 className="mt-4 max-w-2xl font-display text-4xl italic leading-tight text-paper-50 sm:text-5xl lg:text-6xl">
      Every address has a plan.<br />
      <span className="not-italic text-brass-400">Find yours.</span>
    </h1>
    <p className="mt-5 max-w-md text-sm text-paper-100/70">
      Discover verified apartments, villas, plots, and commercial spaces listed by trusted owners and certified agents. Buy, sell, or rent with confidence through Expro Realtors.
    </p>
  </div>
  <div className="border-t border-navy-800">
    <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-navy-800 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
      {Object.entries(counts).slice(0, 4).map(([type, count]) => (
        <div key={type} className="px-4 py-4">
          <p className="font-mono text-2xl tabular-nums text-brass-400">{String(count).padStart(2, "0")}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-paper-100/60">{type}</p>
        </div>
      ))}
    </div>
  </div>
</section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl text-ink-950">Latest listings</h2>
        {loading ? (
          <PropertyGridSkeleton count={6} className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" />
        ) : loadError ? (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-sm border border-dashed border-ink-800/20 px-6 py-16 text-center">
            <p className="text-sm text-ink-800/70">
              Couldn&apos;t load listings right now — this can happen briefly on the very first
              request after the server has been idle. Please try again.
            </p>
            <button
              onClick={fetchHome}
              className="rounded-sm bg-brass-500 px-5 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 hover:bg-brass-400"
            >
              Retry
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="mt-8">
            <EmptyState icon={Home} title="No properties yet" description="New listings will show up here." />
          </div>
        ) : (
          <>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.slice(0, HOME_PAGE_SIZE).map((p, i) => (
                <RevealOnScroll key={p._id} index={i}>
                  <PropertyCard property={p} />
                </RevealOnScroll>
              ))}
            </div>
            {properties.length > HOME_PAGE_SIZE && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleViewMore}
                  className="rounded-sm bg-brass-500 px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-paper-50 hover:bg-brass-600"
                >
                  View more properties
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}