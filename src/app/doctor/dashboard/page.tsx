"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";

export default function DoctorDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
      <p className="mb-4">Welcome back, Dr. {user?.name}!</p>
      <p className="mb-8 text-sm text-muted-foreground">Your role is {user?.role}.</p>
      <Button onClick={logout} variant="secondary">Log Out</Button>
    </div>
  );
}
