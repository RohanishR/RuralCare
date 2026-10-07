"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPatientMedicalRecords,
  MedicalRecord,
} from "@/lib/api-client";

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecords() {
      try {
        setLoading(true);
        setError("");

        const data = await getPatientMedicalRecords();
        setRecords(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load medical records.");
      } finally {
        setLoading(false);
      }
    }

    loadRecords();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/patient/dashboard"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Medical Records
            </h1>

            <p className="mt-1 text-slate-600">
              Your medical history and consultation records.
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Loading medical records...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && records.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">🩺</div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No medical records yet
            </h2>

            <p className="mt-2 text-slate-500">
              Your records will appear here after a consultation.
            </p>
          </div>
        )}

        {!loading && !error && records.length > 0 && (
          <div className="space-y-5">
            {records.map((record) => (
              <div
                key={record.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {record.diagnosis}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(
                        record.created_at,
                      ).toLocaleString()}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Medical Record
                  </span>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">
                      Symptoms
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {record.symptoms}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-700">
                      Doctor Notes
                    </h3>

                    <p className="mt-2 text-slate-600">
                      {record.notes || "No additional notes."}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}