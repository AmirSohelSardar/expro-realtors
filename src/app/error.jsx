"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/Button";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <AlertTriangle size={40} className="text-rust-500" />
      <h1 className="mt-4 font-display text-2xl italic text-ink-950">Something went wrong</h1>
      <p className="mt-2 text-sm text-ink-800/60">
        An unexpected error occurred while loading this page.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link
          href="/"
          className="rounded-sm border border-ink-800/20 px-5 py-2.5 font-mono text-xs uppercase tracking-widest hover:border-brass-500"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}