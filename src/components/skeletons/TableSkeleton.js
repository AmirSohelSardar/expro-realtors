import Skeleton from "@/components/Skeleton";

export default function TableSkeleton({ rows = 6, cols = 4 }) {
  return (
    <div className="mt-8 overflow-hidden rounded-sm border border-ink-800/10">
      <div className="border-b border-ink-800/10 bg-paper-100/60 px-4 py-3">
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="divide-y divide-ink-800/10">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 px-4 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Skeleton key={c} className={`h-3 ${c === 0 ? "w-1/4" : "w-1/6"}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}