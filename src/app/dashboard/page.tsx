"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/ui/LoadingState";

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading) router.replace(user && ["patient", "doctor", "admin"].includes(user.role) ? `/${user.role}/dashboard` : "/login");
  }, [user, isLoading, router]);
  return <LoadingState fullScreen message="Opening your workspace…" />;
}
