"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-sm border border-ink-800/20 p-2 hover:border-brass-500 disabled:opacity-30"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="font-mono text-xs uppercase tracking-widest text-ink-800/60">
        Page {page} of {totalPages}
      </span>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-sm border border-ink-800/20 p-2 hover:border-brass-500 disabled:opacity-30"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}