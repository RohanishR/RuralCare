"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Appointment, getAppointments } from "@/lib/patient-portal";
import { useAuth } from "@/contexts/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [symptomOpen, setSymptomOpen] = useState(false);
  const [symptomNote, setSymptomNote] = useState("");
  const [summary, setSummary] = useState("");

  useEffect(() => {
    const load = () => setAppointments(getAppointments().filter((item) => item.status === "confirmed"));
    load();
    window.addEventListener("ruralcare:appointments-changed", load);
    return () => window.removeEventListener("ruralcare:appointments-changed", load);
  }, []);

  const nextAppointment = appointments[0];
  const createSummary = () => {
    const trimmed = symptomNote.trim();
    if (!trimmed) return;
    setSummary(`Symptoms noted: ${trimmed}. This is a patient-entered summary to share with your clinician; it is not a diagnosis or emergency assessment.`);
  };

  return <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
    <section className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:flex-row sm:items-center"><div><h1 className="text-2xl font-bold text-on-surface">Welcome back, {user?.name?.split(" ")[0] || "Patient"}</h1><p className="mt-1 text-on-surface-variant">Manage your appointments and health information in one place.</p></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary-container px-3 py-2 text-sm font-semibold text-on-secondary-container"><span className="h-2 w-2 rounded-full bg-tertiary" />Low-bandwidth ready</span></section>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Upcoming appointments" value={String(appointments.length)} icon="event" /><Stat label="Profile" value="Health details" icon="person" href="/patient/profile" /><Stat label="Prescriptions" value="View records" icon="medication" href="/patient/prescriptions" /><Stat label="Medical records" value="Private & secure" icon="clinical_notes" href="/patient/records" /></section>
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-semibold text-secondary">NEXT CONSULTATION</p>{nextAppointment ? <><h2 className="mt-1 text-xl font-bold text-on-surface">{nextAppointment.doctorName}</h2><p className="text-on-surface-variant">{nextAppointment.specialty} · {nextAppointment.date} at {nextAppointment.time} · {nextAppointment.mode === "audio" ? "Audio only" : "Video"}</p></> : <><h2 className="mt-1 text-xl font-bold text-on-surface">No appointment booked</h2><p className="text-on-surface-variant">Find a verified doctor and select a time that works for you.</p></>}</div>{nextAppointment ? <Link href="/patient/appointments" className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-on-primary hover:bg-primary-container">View appointment</Link> : <Link href="/find-doctor" className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-on-primary hover:bg-primary-container">Find a doctor</Link>}</div></section>
    <section className="rounded-xl border border-secondary-fixed-dim bg-secondary-container/50 p-6"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><div><p className="text-sm font-bold text-secondary">SYMPTOM NOTES</p><h2 className="text-xl font-bold text-on-surface">Prepare for your consultation</h2><p className="mt-1 max-w-2xl text-sm text-on-surface-variant">Capture symptoms in your own words. RuralCare only organizes your notes for a clinician—it does not diagnose conditions.</p></div><button onClick={() => setSymptomOpen(true)} className="rounded-lg bg-secondary px-5 py-3 font-semibold text-on-secondary hover:bg-primary">Add symptom notes</button></div></section>
    <section><h2 className="mb-3 text-lg font-bold text-on-surface">Quick actions</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Action href="/find-doctor" icon="person_search" title="Find a doctor" text="Search verified specialists" /><Action href="/patient/appointments" icon="calendar_add_on" title="Appointments" text="View or cancel bookings" /><Action href="/patient/prescriptions" icon="receipt_long" title="Prescriptions" text="View available prescriptions" /><Action href="/patient/profile" icon="person" title="My profile" text="Update health information" /></div></section>
    <Modal isOpen={symptomOpen} onClose={() => { setSymptomOpen(false); setSummary(""); }} title="Symptom notes"><div className="space-y-4"><p className="text-sm text-on-surface-variant">If this may be an emergency, call 112 or seek urgent care instead of waiting for an online consultation.</p><label className="block text-sm font-medium">What would you like your doctor to know?<textarea value={symptomNote} onChange={(event) => setSymptomNote(event.target.value)} className="mt-1 min-h-28 w-full rounded-lg border border-outline-variant p-3" placeholder="For example: fever since yesterday, cough, and tiredness." /></label><button onClick={createSummary} className="rounded-lg bg-primary px-4 py-2 font-semibold text-on-primary">Prepare summary</button>{summary && <div role="status" className="rounded-lg bg-surface-container p-4 text-sm text-on-surface">{summary}</div>}</div></Modal>
  </main>;
}

function Stat({ label, value, icon, href }: { label: string; value: string; icon: string; href?: string }) { const content = <><span className="material-symbols-outlined rounded-lg bg-secondary-container p-2 text-primary">{icon}</span><p className="mt-4 text-sm text-on-surface-variant">{label}</p><p className="mt-1 font-semibold text-on-surface">{value}</p></>; return href ? <Link href={href} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition hover:border-primary">{content}</Link> : <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">{content}</div>; }
function Action({ href, icon, title, text }: { href: string; icon: string; title: string; text: string }) { return <Link href={href} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 transition hover:border-primary hover:shadow-sm"><span className="material-symbols-outlined text-primary">{icon}</span><h3 className="mt-3 font-bold text-on-surface">{title}</h3><p className="mt-1 text-sm text-on-surface-variant">{text}</p></Link>; }
