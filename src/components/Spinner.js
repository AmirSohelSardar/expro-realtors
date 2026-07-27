export default function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink-800/20 border-t-brass-500" />
    </div>
  );
}