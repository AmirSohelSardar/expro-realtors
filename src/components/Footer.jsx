"use client";

import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Mail, Phone, MapPin, ChevronUp, Home } from "lucide-react";

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}>
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.5-1.5H16.5V4.3c-.27-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08z" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}>
    <path d="M22 5.9c-.63.28-1.3.47-2 .55.72-.43 1.28-1.12 1.54-1.94-.67.4-1.42.68-2.22.84A3.5 3.5 0 0 0 12.9 8.6c0 .27.03.53.09.79-2.9-.15-5.48-1.54-7.2-3.66-.3.52-.47 1.12-.47 1.76 0 1.22.62 2.29 1.56 2.92-.57-.02-1.11-.18-1.58-.44v.04c0 1.7 1.21 3.12 2.82 3.44-.3.08-.6.12-.92.12-.23 0-.44-.02-.66-.06.45 1.4 1.75 2.42 3.3 2.45A7.03 7.03 0 0 1 3 17.55 9.93 9.93 0 0 0 8.29 19c6.34 0 9.81-5.26 9.81-9.82v-.45c.67-.48 1.25-1.08 1.9-1.83z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" {...props}>
    <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1s2.48 1.1 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-6.9c0-1.65-.03-3.77-2.3-3.77-2.3 0-2.65 1.8-2.65 3.65V23h-4V8z" />
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-ink-800/10 bg-paper-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top: brand + socials */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass-500 text-white">
              <Home size={18} />
            </span>
            <span className="font-display italic text-2xl text-ink-900">Expro Realtors</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-ink-900/60">
            A plainer way to find, list, and inquire about a place to live —
            browse, connect, and move in without the noise.
          </p>

          <div className="mt-5 flex items-center gap-5">
            <a href="#" aria-label="Facebook" className="text-ink-900/40 transition hover:text-brass-500">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="Twitter" className="text-ink-900/40 transition hover:text-brass-500">
              <TwitterIcon />
            </a>
            <a href="#" aria-label="Instagram" className="text-ink-900/40 transition hover:text-brass-500">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-ink-900/40 transition hover:text-brass-500">
              <LinkedinIcon />
            </a>
          </div>
        </div>

        {/* Middle: link columns */}
        <div className="mt-12 grid gap-10 border-t border-ink-900/10 pt-10 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-500">Company</p>
            <ul className="mt-4 space-y-2 text-sm text-ink-900/70">
              <li><Link href="/" className="hover:text-ink-900">Home</Link></li>
               <li><Link href="/about" className="hover:text-ink-900">About</Link></li>
              <li><Link href="/" className="hover:text-ink-900">Property</Link></li>
              <li><Link href="/wishlist" className="hover:text-ink-900">Wishlist</Link></li>
              <li><Link href="/contact" className="hover:text-ink-900">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-500">Support</p>
            <ul className="mt-4 space-y-3 text-sm text-ink-900/70">
              <li className="flex items-center gap-2">
                <Mail size={14} className="text-brass-500" />
                <a href="mailto:contact@exprorealtors.com" className="hover:text-ink-900">
                  contact@exprorealtors.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="text-brass-500" />
                <a href="tel:+911234567890" className="hover:text-ink-900">
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-brass-500" />
                <span>123 Business Hub, India</span>
              </li>
            </ul>
          </div>

          <div className="sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-500">Newsletter</p>
            <p className="mt-4 text-sm text-ink-900/60">
              Subscribe to get the latest listings and market insights directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex overflow-hidden rounded-lg border border-ink-900/15 bg-white">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-900/40 outline-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 bg-brass-500 px-5 text-sm font-medium text-white transition hover:bg-brass-400 disabled:opacity-60"
              >
                {loading ? "..." : "Join"}
              </button>
            </form>
            {subscribed && (
              <p className="mt-2 text-xs text-sage-600">Thanks — you're subscribed!</p>
            )}
            {error && (
              <p className="mt-2 text-xs text-rust-500">{error}</p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-ink-900/10 pt-6 text-center text-xs text-ink-900/40 sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-wrap justify-center gap-4 sm:justify-start">
            <Link href="/privacy" className="hover:text-ink-900">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink-900">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-ink-900">Cookies Settings</Link>
          </div>
          <p>© {new Date().getFullYear()} Expro Realtors. Buy, Sell & Invest in Properties Across Kolkata.</p>
        </div>
      </div>

      {/* Back to top */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className="absolute -top-5 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-brass-500 text-white shadow-md transition hover:bg-brass-400"
      >
        <ChevronUp size={18} />
      </button>
    </footer>
  );
}