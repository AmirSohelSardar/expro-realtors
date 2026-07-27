import { cx } from "@/lib/utils";

const variants = {
  primary: "bg-brass-500 text-ink-950 hover:bg-brass-400 disabled:bg-brass-500/40",
  dark: "bg-ink-900 text-paper-50 hover:bg-ink-800 disabled:bg-ink-900/40",
  outline: "border border-ink-800 text-ink-900 hover:border-brass-500 hover:text-brass-600",
};

export default function Button({ as: Tag = "button", variant = "primary", className, children, ...props }) {
  return (
    <Tag
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-sm px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors disabled:cursor-not-allowed",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}