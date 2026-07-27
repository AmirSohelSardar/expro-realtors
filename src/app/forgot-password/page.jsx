"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Button from "@/components/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl italic text-ink-950">Forgot password</h1>
      <p className="mt-2 text-sm text-ink-800/60">
        Enter your account email and we'll send you a 6-digit reset code.
      </p>

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

        {error && <p className="text-sm text-rust-500">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Sending code..." : "Send reset code"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-800/60">
        Remembered your password?{" "}
        <Link href="/login" className="text-brass-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}