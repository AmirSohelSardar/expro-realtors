import Skeleton from "@/components/Skeleton";

export default function ChatConversationSkeleton() {
  const widths = ["w-40", "w-56", "w-32", "w-48", "w-28"];
  return (
    <div className="flex flex-col gap-3 py-4">
      {widths.map((w, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
          <Skeleton className={`h-9 ${w}`} />
        </div>
      ))}
    </div>
  );
}