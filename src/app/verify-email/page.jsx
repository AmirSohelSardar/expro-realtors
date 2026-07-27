"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import Button from "@/components/Button";

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-email", { email, code });
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl italic text-ink-950">Verify your email</h1>
      <p className="mt-2 text-sm text-ink-800/60">Enter the 6-digit code we sent to your inbox.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Verification code</label>
          <input
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-center text-lg tracking-[0.5em] font-mono focus:border-brass-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-rust-500">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Verifying..." : "Verify"}
        </Button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailForm />
    </Suspense>
  );
}