"use client";

import RequireAuth from "@/components/RequireAuth";

export default function SellerLayout({ children }) {
  return <RequireAuth roles={["seller", "admin"]}>{children}</RequireAuth>;
}