import PropertyCardSkeleton from "./PropertyCardSkeleton";

export default function PropertyGridSkeleton({ count = 6, className = "" }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}