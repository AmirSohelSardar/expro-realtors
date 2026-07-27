"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import Button from "@/components/Button";
import { Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, otp, password });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl italic text-ink-950">Reset password</h1>
      <p className="mt-2 text-sm text-ink-800/60">
        Enter the 6-digit code we sent to your email, along with your new password.
      </p>

      {success ? (
        <p className="mt-8 text-sm text-sage-600">
          Password updated — redirecting you to sign in...
        </p>
      ) : (
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
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Reset code</label>
            <input
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-center text-lg tracking-[0.5em] font-mono focus:border-brass-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">New password</label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-ink-800/20 px-3 py-2.5 pr-10 text-sm focus:border-brass-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-800/50 hover:text-ink-900"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-rust-500">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Resetting..." : "Reset password"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink-800/60">
        Didn't get a code?{" "}
        <Link href="/forgot-password" className="text-brass-600 hover:underline">
          Request again
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}