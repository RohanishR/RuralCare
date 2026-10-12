"use client";

import { useId, useState } from "react";
import { createPrescription, type Appointment } from "@/lib/api-client";

export function PrescriptionButton({ appointment }: { appointment: Appointment }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  if (!["confirmed", "completed"].includes(appointment.status)) return null;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await createPrescription({
        appointment_id: appointment.id,
        medicine: String(data.get("medicine") || "").trim(),
        dosage: String(data.get("dosage") || "").trim(),
        frequency: String(data.get("frequency") || "").trim(),
        duration: String(data.get("duration") || "").trim(),
        instructions: String(data.get("instructions") || "").trim(),
      });
      setSaved(true);
      form.reset();
      setOpen(false);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save prescription. Please retry.");
    } finally { setSaving(false); }
  }

  return (
    <div className="w-full">
      <button type="button" aria-expanded={open} aria-controls={id} disabled={saving}
        onClick={() => { setOpen(!open); setSaved(false); }}
        className="w-full rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-50">
        {open ? "Close prescription form" : "Add prescription"}
      </button>
      {saved && <p role="status" className="mt-2 text-sm text-green-800">Prescription saved. It is available to the patient.</p>}
      {open && (
        <form id={id} onSubmit={submit} className="mt-3 space-y-3 rounded-lg border border-outline-variant bg-surface p-4 text-on-surface">
          <p className="text-sm font-semibold">Prescription for {appointment.patient_name || "this patient"}</p>
          {(["medicine", "dosage", "frequency", "duration"] as const).map(field => (
            <div key={field}>
              <label htmlFor={`${id}-${field}`} className="mb-1 block text-sm font-medium capitalize">{field}</label>
              <input id={`${id}-${field}`} name={field} required minLength={field === "medicine" ? 2 : 1}
                maxLength={field === "medicine" ? 200 : 100} disabled={saving}
                className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          ))}
          <label htmlFor={`${id}-instructions`} className="block text-sm font-medium">Instructions (optional)</label>
          <textarea id={`${id}-instructions`} name="instructions" maxLength={1000} disabled={saving}
            className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? "Saving prescription..." : "Save prescription"}
          </button>
        </form>
      )}
    </div>
  );
}
