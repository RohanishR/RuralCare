"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4">Welcome back, {user?.name}!</p>
      <p className="mb-8 text-sm text-muted-foreground">
        Your role is {user?.role}.
      </p>
      <Button onClick={logout} variant="secondary">
        Log Out
      </Button>
    </div>
  );
}
