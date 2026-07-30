import Skeleton from "@/components/Skeleton";

export default function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-800/10 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-5 w-4/5" />
        <Skeleton className="mt-2 h-3 w-1/2" />
        <div className="mt-3 flex gap-4 border-y border-ink-800/10 py-3">
          <Skeleton className="h-3 w-14" />
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="mt-4 h-9 w-full" />
      </div>
    </div>
  );
}