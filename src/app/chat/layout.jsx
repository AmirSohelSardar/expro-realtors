"use client";

import RequireAuth from "@/components/RequireAuth";

export default function ChatLayout({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}