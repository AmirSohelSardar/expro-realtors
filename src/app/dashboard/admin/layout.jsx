"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/utils";
import RequireAuth from "@/components/RequireAuth";

const links = [
  { href: "/dashboard/admin", label: "Overview" },
  { href: "/dashboard/admin/users", label: "Users" },
  { href: "/dashboard/admin/pending-sellers", label: "Pending Sellers" },
  { href: "/dashboard/admin/pending-properties", label: "Pending Properties" },
  { href: "/dashboard/admin/properties", label: "All Properties" },
  { href: "/dashboard/seller/properties", label: "My Listings" },
  { href: "/dashboard/admin/inquiries", label: "Inquiries" },
  { href: "/dashboard/admin/site-visits", label: "Site Visits" },
  { href: "/dashboard/admin/contacts", label: "Contact Messages" },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  return (
    <RequireAuth roles={["admin"]}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="flex gap-1 overflow-x-auto border-b border-ink-800/10 pb-px">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cx(
                "shrink-0 border-b-2 px-3 py-2.5 font-mono text-xs uppercase tracking-widest",
                pathname === l.href
                  ? "border-brass-500 text-brass-600"
                  : "border-transparent text-ink-800/50 hover:text-ink-900"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="pt-8">{children}</div>
      </div>
    </RequireAuth>
  );
}