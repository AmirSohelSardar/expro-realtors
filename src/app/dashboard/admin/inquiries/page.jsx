"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import { MessageSquare } from "lucide-react";
import { propertyUrl } from "@/lib/utils";
import TableSkeleton from "@/components/skeletons/TableSkeleton";

const PAGE_SIZE = 10;

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get("/admin/inquiries")
      .then(({ data }) => setInquiries(data.inquiries || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <TableSkeleton rows={6} cols={4} />;

  const totalPages = Math.max(1, Math.ceil(inquiries.length / PAGE_SIZE));
  const paginated = inquiries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <h1 className="font-display text-3xl italic text-ink-950">All inquiries</h1>
      <p className="mt-1 text-sm text-ink-800/60">{inquiries.length} total</p>

      {inquiries.length === 0 ? (
        <div className="mt-10">
          <EmptyState icon={MessageSquare} title="No inquiries yet" />
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-3">
            {paginated.map((inq) => (
              <div key={inq._id} className="rounded-sm border border-ink-800/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-800/50">
                  <span>
                    <strong className="text-ink-900">{inq.buyer?.name}</strong> → <strong className="text-ink-900">{inq.seller?.name}</strong>
                  </span>
                  <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                </div>
                <Link href={inq.property ? propertyUrl(inq.property) : "#"} className="mt-1 inline-block text-xs text-brass-600 hover:underline">
                  {inq.property?.title}
                </Link>
                <p className="mt-2 text-sm text-ink-800/80">{inq.message}</p>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
}