import Skeleton from "@/components/Skeleton";

export default function ChatListSkeleton() {
  return (
    <div className="mt-8 flex flex-col divide-y divide-ink-800/10 rounded-sm border border-ink-800/10">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4">
          <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="mt-2 h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}