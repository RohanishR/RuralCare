"use client";

import { useEffect, useId, useState } from "react";
import {
  createMedicalRecord,
  getAppointmentMedicalRecord,
  type Appointment,
  type MedicalRecord,
} from "@/lib/api-client";

export function MedicalRecordButton({
  appointment,
  onSaved,
}: {
  appointment: Appointment;
  onSaved?: (record: MedicalRecord) => void;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [loadingRecord, setLoadingRecord] = useState(false);
  const [existingRecord, setExistingRecord] = useState<MedicalRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const [diagnosis, setDiagnosis] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");

  if (!["confirmed", "completed"].includes(appointment.status)) return null;

  const handleOpen = async () => {
    const nextState = !open;
    setOpen(nextState);
    setSaved(false);
    setError("");

    if (nextState && !existingRecord) {
      setLoadingRecord(true);
      try {
        const record = await getAppointmentMedicalRecord(appointment.id);
        if (record) {
          setExistingRecord(record);
          setDiagnosis(record.diagnosis || "");
          setSymptoms(record.symptoms || "");
          setNotes(record.notes || "");
        } else {
          setDiagnosis("General consultation");
          setSymptoms(appointment.reason || "General health consultation");
          setNotes(appointment.notes || "");
        }
      } catch {
        // Fallback to appointment defaults
        setDiagnosis("General consultation");
        setSymptoms(appointment.reason || "General health consultation");
        setNotes(appointment.notes || "");
      } finally {
        setLoadingRecord(false);
      }
    }
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const record = await createMedicalRecord({
        appointment_id: appointment.id,
        diagnosis: diagnosis.trim(),
        symptoms: symptoms.trim(),
        notes: notes.trim(),
      });
      setExistingRecord(record);
      setSaved(true);
      setOpen(false);
      onSaved?.(record);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : "Unable to save medical record. Please retry."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        disabled={saving}
        onClick={handleOpen}
        className="w-full rounded-lg border border-primary/80 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <span className="material-symbols-outlined text-base">clinical_notes</span>
        {open
          ? "Close medical record form"
          : existingRecord
          ? "Edit medical record"
          : "Add medical record"}
      </button>

      {saved && (
        <p role="status" className="mt-2 text-sm text-green-800 font-medium">
          ✓ Medical record saved. It is now visible to {appointment.patient_name || "the patient"} under Medical Records.
        </p>
      )}

      {open && (
        <form
          id={id}
          onSubmit={submit}
          className="mt-3 space-y-3 rounded-lg border border-outline-variant bg-surface p-4 text-on-surface text-left"
        >
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <p className="text-sm font-semibold text-on-surface">
              {existingRecord ? "Edit Medical Record" : "Create Medical Record"}
            </p>
            <span className="text-xs text-on-surface-variant">
              For {appointment.patient_name || "Patient"}
            </span>
          </div>

          {loadingRecord ? (
            <p className="text-sm text-on-surface-variant py-2">Loading existing record details...</p>
          ) : (
            <>
              <div>
                <label
                  htmlFor={`${id}-diagnosis`}
                  className="mb-1 block text-sm font-medium text-on-surface"
                >
                  Clinical Diagnosis <span className="text-error">*</span>
                </label>
                <input
                  id={`${id}-diagnosis`}
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  minLength={2}
                  maxLength={500}
                  disabled={saving}
                  placeholder="e.g. Acute viral infection, Hypertension, Wellness check..."
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor={`${id}-symptoms`}
                  className="mb-1 block text-sm font-medium text-on-surface"
                >
                  Reported Symptoms <span className="text-error">*</span>
                </label>
                <textarea
                  id={`${id}-symptoms`}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  required
                  minLength={2}
                  maxLength={2000}
                  rows={2}
                  disabled={saving}
                  placeholder="Patient symptoms observed or discussed..."
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor={`${id}-notes`}
                  className="mb-1 block text-sm font-medium text-on-surface"
                >
                  Doctor Clinical Findings / Notes (optional)
                </label>
                <textarea
                  id={`${id}-notes`}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={5000}
                  rows={3}
                  disabled={saving}
                  placeholder="Treatment advice, vital signs, clinical observations..."
                  className="w-full rounded-lg border border-outline-variant bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={saving || !diagnosis.trim() || !symptoms.trim()}
                className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:bg-primary/90 transition shadow-sm"
              >
                {saving
                  ? "Saving medical record..."
                  : existingRecord
                  ? "Update medical record"
                  : "Save medical record"}
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
