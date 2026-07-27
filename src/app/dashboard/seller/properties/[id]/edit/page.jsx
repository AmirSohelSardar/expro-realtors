
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import PropertyForm from "@/components/PropertyForm";
import { useAuth } from "@/context/AuthContext";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/property/${id}`)
      .then(({ data }) => setProperty(data.property))
      .catch(() => setError("Failed to load this property."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;

  if (error || !property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-ink-800/60">{error || "Property not found."}</p>
      </div>
    );
  }

  const isOwner = user && property.seller?._id === user._id;
  const isAdmin = user?.role === "admin";

  if (!isOwner && !isAdmin) {
    router.replace("/unauthorized");
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">Edit property</h1>
      <p className="mt-1 text-sm text-ink-800/60">Update the details below and save your changes.</p>
      <PropertyForm initialData={property} propertyId={property._id} />
    </div>
  );
}