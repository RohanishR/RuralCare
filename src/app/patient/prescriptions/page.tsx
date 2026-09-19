import Link from "next/link";

export default function PrescriptionsPage() {
  return <main className="mx-auto w-full max-w-5xl p-4 sm:p-8"><h1 className="text-3xl font-bold text-on-surface">Prescriptions</h1><p className="mt-1 text-on-surface-variant">Prescriptions issued by your doctor will appear here after a consultation.</p><section className="mt-6 rounded-xl border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center"><span className="material-symbols-outlined text-4xl text-primary">medication</span><h2 className="mt-3 text-xl font-bold text-on-surface">No prescriptions available</h2><p className="mt-1 text-on-surface-variant">You have no digital prescriptions yet.</p><Link href="/find-doctor" className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary">Book a consultation</Link></section></main>;
}
