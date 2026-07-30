import Skeleton from "@/components/Skeleton";

export default function PropertyDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-3 w-52" />
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <Skeleton className="aspect-[4/3] w-full sm:row-span-2 sm:aspect-auto" />
        <Skeleton className="aspect-[16/9] w-full" />
        <Skeleton className="aspect-[16/9] w-full" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="mt-3 h-4 w-1/2" />
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
          <Skeleton className="mt-8 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="mt-4 h-64 w-full" />
        </div>
      </div>
    </div>
  );
}