import Skeleton from "@/components/Skeleton";

export default function ListSkeleton({ rows = 4, withThumbnail = false }) {
  return (
    <div className="mt-8 flex flex-col gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-sm border border-ink-800/10 p-4">
          {withThumbnail && <Skeleton className="h-24 w-32 shrink-0 rounded-sm" />}
          <div className="flex-1">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="mt-2 h-3 w-1/3" />
            <Skeleton className="mt-2 h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}