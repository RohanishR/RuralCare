"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api-client";
import { availabilitySummary, Doctor } from "@/lib/doctor";

const statusVariant = { pending: "warning", approved: "success", rejected: "error" } as const;
export default function DoctorDashboard() {
  const { user } = useAuth(); const [doctor, setDoctor] = useState<Doctor | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState("");
  const loadProfile = async () => { setLoading(true); setError(""); try { setDoctor(await apiClient.get<Doctor>("/doctors/me")); } catch (requestError: unknown) { const message = requestError instanceof Error ? requestError.message : "Unable to load your doctor profile."; if (!message.includes("Doctor profile not found")) setError(message); } finally { setLoading(false); } };
  useEffect(() => { loadProfile(); }, []);
  if (loading) return <LoadingState fullScreen message="Loading your doctor dashboard..." />;
  if (error) return <main className="p-6"><ErrorState title="Doctor profile could not be loaded" message={error} onRetry={loadProfile} /></main>;
  if (!doctor) return <main className="mx-auto max-w-3xl p-6 sm:p-10"><EmptyState title="Create your professional profile" description="Add your credentials and availability before RuralCare can review your profile." actionLabel="Create profile" onAction={() => { window.location.href = "/doctor/profile"; }} /></main>;
  return <main className="mx-auto w-full max-w-6xl p-4 sm:p-8"><section className="flex flex-col justify-between gap-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-secondary">DOCTOR MANAGEMENT</p><h1 className="mt-1 text-3xl font-bold text-on-surface">Welcome, Dr. {doctor.name || user?.name}</h1><p className="mt-2 text-on-surface-variant">Manage your professional profile and availability. Appointment statistics will arrive with Module 5.</p></div><Link href="/doctor/profile" className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-on-primary">Edit profile</Link></section><section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Verification" value={<Badge variant={statusVariant[doctor.verification_status]}>{doctor.verification_status}</Badge>} /><Stat label="Specialization" value={doctor.specialization} /><Stat label="Experience" value={`${doctor.experience} years`} /><Stat label="Consultation fee" value={`₹${doctor.consultation_fee}`} /></section><section className="mt-6 grid gap-6 lg:grid-cols-2"><article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"><h2 className="text-xl font-bold text-on-surface">Professional information</h2><dl className="mt-5 space-y-4"><Row label="Qualification" value={doctor.qualification} /><Row label="Registration" value={doctor.registration_number} /><Row label="Languages" value={doctor.languages.join(", ")} /><Row label="Location" value={doctor.location} /></dl></article><article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"><h2 className="text-xl font-bold text-on-surface">Availability</h2><p className="mt-3 text-on-surface-variant">{availabilitySummary(doctor.availability)}</p><p className="mt-5 text-sm text-on-surface-variant">Your profile is {doctor.verification_status}. Only approved profiles appear in public doctor discovery.</p><Link href="/doctor/profile" className="mt-6 inline-block font-semibold text-primary underline">Update availability</Link></article></section></main>;
}
function Stat({ label, value }: { label: string; value: ReactNode }) { return <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"><p className="text-sm text-on-surface-variant">{label}</p><div className="mt-2 text-lg font-semibold text-on-surface">{value}</div></article>; }
function Row({ label, value }: { label: string; value: string }) { return <div><dt className="text-sm text-on-surface-variant">{label}</dt><dd className="mt-1 font-semibold text-on-surface">{value}</dd></div>; }
