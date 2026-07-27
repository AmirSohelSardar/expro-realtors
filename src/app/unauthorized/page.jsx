import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <ShieldAlert size={40} className="text-rust-500" />
      <h1 className="mt-4 font-display text-2xl italic text-ink-950">Access denied</h1>
      <p className="mt-2 text-sm text-ink-800/60">
        You don&apos;t have permission to view this page.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-sm bg-brass-500 px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 hover:bg-brass-400"
      >
        Back home
      </Link>
    </div>
  );
}