export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-ink-800/20 px-6 py-16 text-center">
      {Icon && <Icon className="mb-4 text-ink-800/30" size={32} />}
      <p className="font-display text-lg text-ink-900">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-800/60">{description}</p>}
    </div>
  );
}