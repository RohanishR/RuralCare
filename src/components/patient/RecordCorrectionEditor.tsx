"use client";

import { useId, useState } from "react";
import { updatePatientRecordCorrection, type MedicalRecord } from "@/lib/api-client";

export function RecordCorrectionEditor({ record, onSaved }: { record: MedicalRecord; onSaved: (record: MedicalRecord) => void }) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record.patient_note || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const updated = await updatePatientRecordCorrection(record.id, draft);
      onSaved(updated);
      setEditing(false);
      setSaved(true);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save your correction. Please retry.");
    } finally { setSaving(false); }
  }

  return (
    <section className="mt-6 border-t border-slate-200 pt-4">
      <h3 className="font-semibold text-slate-800">Your correction notes</h3>
      <p className="mt-1 text-sm text-slate-600">Clarify information for your doctor. The original clinical record is preserved.</p>
      {editing ? (
        <form onSubmit={save} className="mt-3 space-y-3">
          <label htmlFor={id} className="block text-sm font-medium text-slate-700">Correction or additional information</label>
          <textarea id={id} value={draft} onChange={event => setDraft(event.target.value)} maxLength={2000}
            rows={4} disabled={saving} className="w-full rounded-lg border border-slate-300 p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary" />
          <p className="text-xs text-slate-500">{draft.length}/2000 characters. Previous saved corrections are retained.</p>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="rounded-lg bg-primary px-4 py-2 font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save correction"}</button>
            <button type="button" disabled={saving} onClick={() => setEditing(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700">Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">{record.patient_note || "No correction notes added."}</p>
          <button type="button" onClick={() => { setDraft(record.patient_note || ""); setError(""); setSaved(false); setEditing(true); }}
            className="mt-3 rounded-lg border border-primary px-4 py-2 font-semibold text-primary hover:bg-primary/10">
            {record.patient_note ? "Edit correction notes" : "Add correction notes"}
          </button>
        </>
      )}
      {saved && <p role="status" className="mt-2 text-sm text-green-800">Correction saved successfully.</p>}
    </section>
  );
}
