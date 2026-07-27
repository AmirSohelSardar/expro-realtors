"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import { MessageSquare } from "lucide-react";
import { propertyUrl } from "@/lib/utils";

export default function SellerInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/inquiry/seller")
      .then(({ data }) => setInquiries(data.inquiries || []))
      .finally(() => setLoading(false));
  }, []);

  async function markRead(id) {
    try {
      await api.patch(`/inquiry/${id}/read`);
      setInquiries((prev) => prev.map((i) => (i._id === id ? { ...i, isRead: true } : i)));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl italic text-ink-950">Inquiries</h1>

      {inquiries.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={MessageSquare} title="No inquiries yet" description="Buyer inquiries will show up here." />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {inquiries.map((inq) => (
            <div
              key={inq._id}
              onClick={() => !inq.isRead && markRead(inq._id)}
              className={`cursor-pointer rounded-sm border p-4 ${
                inq.isRead ? "border-ink-800/10" : "border-brass-500 bg-brass-500/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-base text-ink-950">{inq.buyer?.name}</p>
                {!inq.isRead && <span className="rounded-full bg-brass-500 px-2 py-0.5 text-[10px] font-mono uppercase text-ink-950">New</span>}
              </div>
              <p className="text-xs text-ink-800/50">{inq.buyer?.email}</p>
              <Link href={inq.property ? propertyUrl(inq.property) : "#"} className="mt-1 inline-block text-xs text-brass-600 hover:underline">
                {inq.property?.title} — ₹{inq.property?.price?.toLocaleString("en-IN")}
              </Link>
              <p className="mt-2 text-sm text-ink-800/80">{inq.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}