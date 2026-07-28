"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ExploreCTAButton() {
  const router = useRouter();
  const { user } = useAuth();

  function handleClick() {
    if (!user) {
      router.push("/login?redirect=/properties");
      return;
    }
    router.push("/properties");
  }

  return (
    <button
      onClick={handleClick}
      className="mt-10 rounded-full bg-paper-50 px-8 py-4 font-bold text-brass-600 transition hover:scale-105"
    >
      Explore Properties
    </button>
  );
}