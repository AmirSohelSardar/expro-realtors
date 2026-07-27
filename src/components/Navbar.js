"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, MessageCircle, Home, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cx } from "@/lib/utils";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const loggedOutLinks = [
    { href: "/", label: "Browse Properties" },
    { href: "/about", label: "About" },
  ];

  const baseLoggedInLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Property" },
    { href: "/about", label: "About" },
    { href: "/wishlist", label: "Wishlist", icon: Heart },
    { href: "/chat", label: "Message", icon: MessageCircle },
  ];

  const loggedInLinks =
    user?.role === "admin"
      ? [...baseLoggedInLinks, { href: "/dashboard/admin", label: "Admin", icon: LayoutDashboard }]
      : user?.role === "seller"
      ? [...baseLoggedInLinks, { href: "/dashboard/seller/properties", label: "My Listings", icon: Home }]
      : baseLoggedInLinks;
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/10 bg-paper-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
  <Image
    src="/logo.png"
    alt="Expro Realtors"
    width={180}
    height={48}
    priority
    className="h-10 w-auto sm:h-11"
  />
</Link>

        <nav className="hidden items-center gap-7 md:flex">
          {(user ? loggedInLinks : loggedOutLinks).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cx(
                "flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest transition-colors",
                pathname === l.href ? "text-brass-600" : "text-ink-900/60 hover:text-ink-900"
              )}
            >
              {l.icon && <l.icon size={14} />}
              {l.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="rounded-sm bg-brass-500 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white hover:bg-brass-600 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/profile"
                className="font-mono text-xs uppercase tracking-widest text-ink-900 border border-ink-800 rounded-sm px-3 py-1.5 hover:border-brass-500 hover:text-brass-600 transition-colors"
              >
                {user.name?.split(" ")[0]}
              </Link>
              <button
                onClick={logout}
                className="font-mono text-xs uppercase tracking-widest text-ink-900/50 hover:text-rust-500 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/login" className="font-mono text-xs uppercase tracking-widest text-ink-900/60 hover:text-ink-900">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-sm bg-brass-500 px-4 py-2 font-mono text-xs uppercase tracking-widest text-white hover:bg-brass-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        <button className="text-ink-900 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-800/10 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {(user ? loggedInLinks : loggedOutLinks).map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-2 text-ink-900 py-1">
                {l.icon && <l.icon size={16} />}
                {l.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/contact" onClick={() => setOpen(false)} className="text-brass-600 py-1">Contact Us</Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="text-ink-900 py-1">Profile</Link>
                <button onClick={logout} className="text-left text-rust-500 py-1">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="text-ink-900 py-1">Login</Link>
                <Link href="/register" onClick={() => setOpen(false)} className="text-brass-600 py-1">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}