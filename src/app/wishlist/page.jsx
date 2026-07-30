"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { useToast } from "@/context/ToastContext";
import { Heart, X } from "lucide-react";
import PropertyGridSkeleton from "@/components/skeletons/PropertyGridSkeleton";

export default function WishlistPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  function fetchWishlist() {
    setLoading(true);
    api
      .get("/wishlist")
      .then(({ data }) => setItems(data || []))
      .catch(() => showToast("Failed to load wishlist", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function handleRemove(propertyId) {
    setBusyId(propertyId);
    try {
      await api.delete(`/wishlist/${propertyId}`);
      setItems((prev) => prev.filter((i) => i.property?._id !== propertyId));
      showToast("Removed from wishlist");
    } catch (err) {
      showToast("Failed to remove item", "error");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <PropertyGridSkeleton count={6} className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">My wishlist</h1>
      <p className="mt-1 text-sm text-ink-800/60">{items.length} saved properties</p>

      {items.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={Heart} title="Your wishlist is empty" description="Tap the heart on any listing to save it here." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items
            .filter((i) => i.property)
            .map((i) => (
              <div key={i._id} className="relative">
                <PropertyCard property={i.property} />
                <button
                  onClick={() => handleRemove(i.property._id)}
                  disabled={busyId === i.property._id}
                  className="absolute right-3 top-3 rounded-full bg-ink-950/70 p-1.5 text-paper-50 hover:bg-rust-500"
                  aria-label="Remove from wishlist"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}