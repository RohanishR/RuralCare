"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { saveAppointment } from "@/lib/patient-portal";

type Doctor = { id: string; name: string; qualifications: string; specialty: string; fee: number; experience: number; languages: string[]; rating: number; nextSlot: string };

const doctors: Doctor[] = [
  { id: "priya", name: "Dr. Priya Sharma", qualifications: "MD, AIIMS New Delhi", specialty: "General Medicine", fee: 150, experience: 8, languages: ["Hindi", "English", "Punjabi"], rating: 4.9, nextSlot: "Today, 2:30 PM" },
  { id: "rajesh", name: "Dr. Rajesh Kulkarni", qualifications: "MBBS, MD", specialty: "Pediatrics", fee: 200, experience: 14, languages: ["Marathi", "Hindi", "English"], rating: 4.8, nextSlot: "Today, 4:00 PM" },
  { id: "anita", name: "Dr. Anita Desai", qualifications: "MBBS, DGO", specialty: "Obstetrics & Gynecology", fee: 180, experience: 11, languages: ["Gujarati", "Hindi", "English"], rating: 4.9, nextSlot: "Tomorrow, 10:00 AM" },
  { id: "arun", name: "Dr. Arun Menon", qualifications: "MBBS, MD", specialty: "Dermatology", fee: 220, experience: 9, languages: ["Tamil", "English", "Hindi"], rating: 4.7, nextSlot: "Tomorrow, 1:30 PM" },
];

export default function FindDoctorPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [language, setLanguage] = useState("All");
  const [maxFee, setMaxFee] = useState(500);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [message, setMessage] = useState("");

  const filteredDoctors = useMemo(() => doctors.filter((doctor) => {
    const searchable = `${doctor.name} ${doctor.specialty} ${doctor.languages.join(" ")}`.toLowerCase();
    return searchable.includes(query.toLowerCase()) && (specialty === "All" || doctor.specialty === specialty) && (language === "All" || doctor.languages.includes(language)) && doctor.fee <= maxFee;
  }), [language, maxFee, query, specialty]);

  const bookAppointment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedDoctor) return;
    const form = new FormData(event.currentTarget);
    saveAppointment({ id: crypto.randomUUID(), doctorName: selectedDoctor.name, specialty: selectedDoctor.specialty, date: String(form.get("date")), time: String(form.get("time")), mode: String(form.get("mode")) as "video" | "audio", status: "confirmed" });
    setSelectedDoctor(null);
    setMessage(`Your appointment with ${selectedDoctor.name} is confirmed.`);
  };

  return <main className="min-h-screen bg-background">
    <header className="sticky top-0 z-20 border-b border-outline-variant bg-surface/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6"><Link href="/" className="flex items-center gap-2 font-bold text-primary"><span className="material-symbols-outlined">local_hospital</span>RuralCare</Link><div className="flex gap-2"><Link href="/patient/dashboard" className="rounded-lg px-3 py-2 text-sm text-primary hover:bg-surface-container">Dashboard</Link><Link href="/login" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary">Login</Link></div></div></header>
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><p className="mb-2 text-sm font-semibold text-secondary">VERIFIED RURAL TELEHEALTH NETWORK</p><h1 className="text-3xl font-bold text-on-surface sm:text-4xl">Find the right doctor</h1><p className="mt-2 max-w-2xl text-on-surface-variant">Search verified clinicians, compare availability, and book a video or low-data audio consultation.</p>
      {message && <div role="status" className="mt-5 rounded-lg bg-tertiary-fixed p-4 text-on-tertiary-fixed-variant">{message} <Link className="ml-2 font-bold underline" href="/patient/appointments">View appointments</Link></div>}
      <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]"><aside className="h-fit rounded-xl border border-outline-variant bg-surface-container-lowest p-5"><h2 className="font-bold text-on-surface">Filter doctors</h2><label className="mt-5 block text-sm font-medium">Specialty<select value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface p-3"><option>All</option>{[...new Set(doctors.map((doctor) => doctor.specialty))].map((value) => <option key={value}>{value}</option>)}</select></label><label className="mt-4 block text-sm font-medium">Language<select value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-lg border border-outline-variant bg-surface p-3"><option>All</option>{[...new Set(doctors.flatMap((doctor) => doctor.languages))].map((value) => <option key={value}>{value}</option>)}</select></label><label className="mt-4 block text-sm font-medium">Maximum consultation fee: ₹{maxFee}<input className="mt-3 w-full accent-primary" min="100" max="500" step="50" type="range" value={maxFee} onChange={(e) => setMaxFee(Number(e.target.value))} /></label><button onClick={() => { setQuery(""); setSpecialty("All"); setLanguage("All"); setMaxFee(500); }} className="mt-5 text-sm font-semibold text-primary underline">Clear filters</button></aside>
        <section><label className="relative block"><span className="sr-only">Search doctors</span><span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">search</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by doctor, specialty, or language" className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-3 pl-11 pr-4" /></label><p className="my-5 text-sm text-on-surface-variant">{filteredDoctors.length} doctor{filteredDoctors.length === 1 ? "" : "s"} available for your preferences</p><div className="space-y-4">{filteredDoctors.length ? filteredDoctors.map((doctor) => <article key={doctor.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"><div className="flex flex-col justify-between gap-5 sm:flex-row"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold text-on-surface">{doctor.name}</h2><span className="rounded bg-tertiary-fixed px-2 py-0.5 text-xs font-bold text-on-tertiary-fixed-variant">Verified</span></div><p className="mt-1 text-primary">{doctor.specialty}</p><p className="mt-1 text-sm text-on-surface-variant">{doctor.qualifications} · {doctor.experience} years experience</p><p className="mt-3 text-sm text-on-surface-variant">{doctor.languages.join(" · ")} · <span className="font-semibold text-on-surface">★ {doctor.rating}</span></p><p className="mt-3 text-sm"><span className="font-semibold text-tertiary">Next available:</span> {doctor.nextSlot}</p></div><div className="flex shrink-0 flex-col justify-between gap-4 sm:items-end"><p className="text-xl font-bold text-primary">₹{doctor.fee}</p><button onClick={() => setSelectedDoctor(doctor)} className="rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-container">Book appointment</button></div></div></article>) : <div className="rounded-xl border border-dashed border-outline-variant p-10 text-center text-on-surface-variant">No doctors match these filters. Try widening your search.</div>}</div></section></div>
    </section>
    <Modal isOpen={Boolean(selectedDoctor)} onClose={() => setSelectedDoctor(null)} title={selectedDoctor ? `Book with ${selectedDoctor.name}` : "Book appointment"}><form onSubmit={bookAppointment} className="space-y-4"><p className="text-sm text-on-surface-variant">Choose a preferred consultation time. A confirmation will be shown in your appointments.</p><label className="block text-sm font-medium">Date<input required name="date" min={new Date().toISOString().slice(0, 10)} type="date" className="mt-1 w-full rounded-lg border border-outline-variant p-3" /></label><label className="block text-sm font-medium">Time<select required name="time" defaultValue="" className="mt-1 w-full rounded-lg border border-outline-variant p-3"><option value="" disabled>Select a time</option><option>10:00 AM</option><option>2:30 PM</option><option>4:00 PM</option></select></label><fieldset><legend className="text-sm font-medium">Consultation type</legend><label className="mr-4 inline-flex gap-2 pt-2"><input defaultChecked name="mode" type="radio" value="video" /> Video</label><label className="inline-flex gap-2"><input name="mode" type="radio" value="audio" /> Audio only</label></fieldset><button className="w-full rounded-lg bg-primary py-3 font-semibold text-on-primary hover:bg-primary-container">Confirm booking</button></form></Modal>
  </main>;
}
