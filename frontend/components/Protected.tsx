"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "../lib/auth";
export default function Protected({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!getToken()) router.replace("/login");
  }, [router]);
  if (!getToken()) return <div className="p-8">Loading...</div>;
  return <>{children}</>;
}
