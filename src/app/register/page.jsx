"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/Button";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl italic text-ink-950">Create an account</h1>
      <p className="mt-2 text-sm text-ink-800/60">List properties or browse as a buyer.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1.5 w-full rounded-sm border border-ink-800/20 px-3 py-2.5 text-sm focus:border-brass-500 focus:outline-none"
          />
        </div>
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
              minLength={6}
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
        <div>
          <label className="font-mono text-xs uppercase tracking-widest text-ink-800/70">I am a</label>
          <div className="mt-1.5 flex gap-3">
            {["buyer", "seller"].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setForm({ ...form, role: r })}
                className={`flex-1 rounded-sm border px-3 py-2.5 text-xs font-mono uppercase tracking-widest ${
                  form.role === r
                    ? "border-brass-500 bg-brass-500/10 text-brass-600"
                    : "border-ink-800/20 text-ink-800/60"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          {form.role === "seller" && (
            <p className="mt-1.5 text-xs text-ink-800/50">
              Seller accounts require admin approval before listings go live.
            </p>
          )}
        </div>

        {error && <p className="text-sm text-rust-500">{error}</p>}

        <Button type="submit" disabled={loading} className="mt-2">
          {loading ? "Creating account..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-800/60">
        Already have an account?{" "}
        <Link href="/login" className="text-brass-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}