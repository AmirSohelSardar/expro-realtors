"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      const redirect = searchParams.get("redirect");
      router.push(redirect || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl italic text-ink-950">Welcome back</h1>
      <p className="mt-2 text-sm text-ink-800/60">Sign in to manage your listings and messages.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Password</label>
          <div className="relative mt-1.5">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-sm border border-ink-800/20 px-3 py-2.5 pr-10 text-sm focus:border-brass-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-800/50 hover:text-ink-900"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-rust-500">{error}</p>}

        <div className="flex items-center justify-between text-xs">
          <Link href="/forgot-password" className="text-ink-800/60 hover:text-brass-600">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-800/60">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-brass-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}