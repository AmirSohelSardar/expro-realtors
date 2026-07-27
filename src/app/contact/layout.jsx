"use client";

import RequireAuth from "@/components/RequireAuth";

export default function ContactLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}