"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "@/components/Spinner";

export default function RequireAuth({ roles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (roles && !roles.includes(user.role)) {
      router.replace("/unauthorized");
    }
  }, [user, loading, roles, router, pathname]);

  if (loading) return <Spinner />;
  if (!user) return <Spinner />;
  if (roles && !roles.includes(user.role)) return <Spinner />;

  return children;
}