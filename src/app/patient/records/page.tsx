import Link from "next/link";

export default function RecordsPage() {
  return <main className="mx-auto w-full max-w-5xl p-4 sm:p-8"><h1 className="text-3xl font-bold text-on-surface">Medical records</h1><p className="mt-1 text-on-surface-variant">Your clinical records are private and are shared only with authorized care providers.</p><section className="mt-6 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center"><span className="material-symbols-outlined text-4xl text-primary">folder_shared</span><h2 className="mt-3 text-xl font-bold text-on-surface">No medical records available</h2><p className="mt-1 text-on-surface-variant">Consultation notes and records will appear here after your clinician adds them.</p><Link href="/patient/profile" className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary">Review my profile</Link></section></main>;
}
