"use client";

import PropertyForm from "@/components/PropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">List a new property</h1>
      <p className="mt-1 text-sm text-ink-800/60">Fill in the details below. Listings go live immediately unless your account is pending approval.</p>
      <PropertyForm />
    </div>
  );
}