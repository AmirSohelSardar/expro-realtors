"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import PropertyCard from "@/components/PropertyCard";
import { User as UserIcon, Home, Calendar } from "lucide-react";

export default function PublicSellerProfilePage() {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [profileRes, propertiesRes] = await Promise.all([
          api.get(`/user/public/${id}`),
          api.get("/property", { params: { seller: id } }),
        ]);
        setSeller(profileRes.data.user);
        setProperties(propertiesRes.data.properties || []);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <Spinner />;

  if (notFound || !seller) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-ink-800/60">Seller not found.</p>
        <Link href="/properties" className="mt-3 inline-block text-brass-600 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4 border-b border-ink-800/10 pb-8 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-ink-900">
          {seller.profilePic ? (
            <Image src={seller.profilePic} alt={seller.name} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-paper-100/40">
              <UserIcon size={32} />
            </div>
          )}
        </div>

        <div className="text-center sm:text-left">
          <h1 className="font-display text-2xl italic text-ink-950">{seller.name}</h1>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-ink-800/50 sm:justify-start">
            <span className="rounded-sm bg-brass-500/10 px-2 py-0.5 font-mono uppercase tracking-widest text-brass-600">
              {seller.role}
            </span>
          </p>
          {seller.createdAt && (
            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-800/50 sm:justify-start">
              <Calendar size={12} /> Member since {new Date(seller.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl text-ink-950">
          {properties.length} active listing{properties.length !== 1 ? "s" : ""}
        </h2>

        {properties.length === 0 ? (
          <div className="mt-6">
            <EmptyState icon={Home} title="No active listings" description="This seller doesn't have any properties for sale right now." />
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}