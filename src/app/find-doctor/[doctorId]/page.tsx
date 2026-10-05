"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { apiClient } from "@/lib/api-client";
import { availabilitySummary, Doctor, WEEKDAYS } from "@/lib/doctor";

export default function DoctorDetailsPage() {
  const params = useParams<{ doctorId: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState("");
  const loadDoctor = async () => { try { setError(""); setDoctor(await apiClient.get<Doctor>(`/doctors/${params.doctorId}`)); } catch (requestError: unknown) { setError(requestError instanceof Error ? requestError.message : "Unable to load this doctor."); } };
  useEffect(() => { loadDoctor(); }, [params.doctorId]);
  if (error) return <main className="mx-auto max-w-3xl p-6"><ErrorState title="Doctor not available" message={error} onRetry={loadDoctor} /></main>;
  if (!doctor) return <LoadingState fullScreen message="Loading doctor profile..." />;
  return <main className="min-h-screen bg-background p-4 sm:p-8"><div className="mx-auto max-w-4xl"><Link href="/find-doctor" className="text-sm font-semibold text-primary">← Back to doctors</Link><article className="mt-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-8"><div className="flex flex-col gap-6 sm:flex-row sm:items-start"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary-container text-3xl font-bold text-primary">{doctor.name.charAt(0)}</div><div className="flex-1"><div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold text-on-surface">Dr. {doctor.name}</h1><span className="rounded bg-tertiary-fixed px-2 py-1 text-xs font-bold text-on-tertiary-fixed-variant">Verified</span></div><p className="mt-2 text-lg text-primary">{doctor.specialization}</p><p className="mt-1 text-on-surface-variant">{doctor.qualification}</p></div><p className="text-xl font-bold text-primary">₹{doctor.consultation_fee}</p></div><div className="mt-8 grid gap-5 border-y border-outline-variant py-6 sm:grid-cols-2"><Detail label="Experience" value={`${doctor.experience} years`} /><Detail label="Languages" value={doctor.languages.join(", ")} /><Detail label="Location" value={doctor.location} /><Detail label="Registration" value={doctor.registration_number} /><Detail label="Availability" value={availabilitySummary(doctor.availability)} /></div>{doctor.about && <section className="mt-6"><h2 className="text-lg font-bold text-on-surface">About Dr. {doctor.name}</h2><p className="mt-2 whitespace-pre-line text-on-surface-variant">{doctor.about}</p></section>}<section className="mt-6"><h2 className="text-lg font-bold text-on-surface">Weekly availability</h2><div className="mt-3 grid gap-2 sm:grid-cols-2">{WEEKDAYS.map((day) => { const slot = doctor.availability?.[day]; return <p key={day} className="rounded-lg bg-surface-container p-3 text-sm"><span className="font-semibold capitalize">{day}</span><span className="float-right text-on-surface-variant">{slot?.enabled ? `${slot.start}–${slot.end}` : "Unavailable"}</span></p>; })}</div></section><p className="mt-8 rounded-lg bg-secondary-container p-4 text-sm text-on-secondary-container">Appointment booking will be available in a future RuralCare update.</p></article></div></main>;
}
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-sm text-on-surface-variant">{label}</p><p className="mt-1 font-semibold text-on-surface">{value}</p></div>; }
