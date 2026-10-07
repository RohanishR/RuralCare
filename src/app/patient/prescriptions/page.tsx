"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getPatientPrescriptions,
  Prescription,
} from "@/lib/api-client";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<
    Prescription[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrescriptions() {
      try {
        setLoading(true);
        setError("");

        const data = await getPatientPrescriptions();
        setPrescriptions(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load prescriptions.");
      } finally {
        setLoading(false);
      }
    }

    loadPrescriptions();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <Link
            href="/patient/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-slate-900">
            Prescriptions
          </h1>

          <p className="mt-1 text-slate-600">
            View medicines prescribed by your doctors.
          </p>
        </div>

        {loading && (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Loading prescriptions...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && prescriptions.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <div className="text-4xl">💊</div>

            <h2 className="mt-4 text-xl font-semibold text-slate-900">
              No prescriptions yet
            </h2>

            <p className="mt-2 text-slate-500">
              Prescriptions from your consultations will appear here.
            </p>
          </div>
        )}

        {!loading && !error && prescriptions.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2">
            {prescriptions.map((prescription) => (
              <div
                key={prescription.id}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {prescription.medicine}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Prescribed on{" "}
                      {new Date(
                        prescription.created_at,
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Active
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Dosage
                    </p>

                    <p className="mt-1 text-slate-800">
                      {prescription.dosage}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Frequency
                    </p>

                    <p className="mt-1 text-slate-800">
                      {prescription.frequency}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 text-slate-800">
                      {prescription.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Instructions
                    </p>

                    <p className="mt-1 text-slate-600">
                      {prescription.instructions ||
                        "No additional instructions."}
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