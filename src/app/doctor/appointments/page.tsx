"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Appointment,
  apiClient,
} from "@/lib/api-client";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadAppointments() {
    try {
      setLoading(true);
      setError("");

      const data = await apiClient.getDoctorAppointments();
      setAppointments(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function handleCancel(id: string) {
    if (
      !window.confirm(
        "Are you sure you want to cancel this appointment?",
      )
    ) {
      return;
    }

    try {
      await apiClient.updateAppointment(id, { status: "cancelled" });
      await loadAppointments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel appointment.",
      );
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-8">
      <div className="mb-8">
        <Link
          href="/doctor/dashboard"
          className="text-sm font-semibold text-primary"
        >
          ← Back to dashboard
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-on-surface">
          Patient appointments
        </h1>

        <p className="mt-1 text-on-surface-variant">
          View and manage your scheduled consultations.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg bg-error-container p-4 text-on-error-container"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-outline-variant p-10 text-center">
          Loading appointments...
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary">
            event_available
          </span>

          <h2 className="mt-3 text-xl font-bold text-on-surface">
            No appointments
          </h2>

          <p className="mt-1 text-on-surface-variant">
            Your scheduled patient consultations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <article
              key={appointment.id}
              className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-on-surface">
                      Patient consultation
                    </h2>

                    <span className="rounded-full bg-tertiary-fixed px-2 py-1 text-xs font-bold text-on-tertiary-fixed-variant">
                      {appointment.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-on-surface-variant">
                    {new Date(appointment.appointment_date).toLocaleString()}
                  </p>

                  {appointment.reason && (
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Reason: {appointment.reason}
                    </p>
                  )}
                </div>

                {appointment.status === "confirmed" && (
                  <button
                    onClick={() =>
                      handleCancel(appointment.id)
                    }
                    className="rounded-lg border border-error px-4 py-2 font-semibold text-error hover:bg-error-container"
                  >
                    Cancel appointment
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
