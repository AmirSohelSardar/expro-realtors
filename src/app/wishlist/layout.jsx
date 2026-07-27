"use client";

import RequireAuth from "@/components/RequireAuth";

export default function WishlistLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}