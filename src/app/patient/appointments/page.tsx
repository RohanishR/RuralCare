"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Appointment,
  Doctor,
  apiClient,
} from "@/lib/api-client";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(null);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const [appointmentData, doctorData] = await Promise.all([
        apiClient.getPatientAppointments(),
        apiClient.getDoctors(),
      ]);

      setAppointments(
        appointmentData.filter(
          (app) => app.status !== "cancelled" && app.status !== "completed"
        )
      );
      setDoctors(doctorData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load appointments.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Cancel this appointment?")) {
      return;
    }

    try {
      setCancelling(id);
      setError("");

      await apiClient.updateAppointment(id, {
        status: "cancelled",
      });

      await loadAppointments();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel appointment.",
      );
    } finally {
      setCancelling(null);
    }
  };

  const getDoctor = (doctorId: string) => {
    return doctors.find((doctor) => doctor.id === doctorId);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusClasses = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">
            My appointments
          </h1>

          <p className="mt-1 text-on-surface-variant">
            Manage your RuralCare consultations.
          </p>
        </div>

        <Link
          href="/find-doctor"
          className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-on-primary"
        >
          Book appointment
        </Link>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-error bg-error-container p-4 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-xl border border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined animate-spin text-3xl text-primary">
            progress_activity
          </span>

          <p className="mt-3 text-on-surface-variant">
            Loading appointments...
          </p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-outline-variant p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-primary">
            calendar_month
          </span>

          <h2 className="mt-3 text-xl font-bold text-on-surface">
            No appointments yet
          </h2>

          <p className="mt-1 text-on-surface-variant">
            Book a consultation with a verified doctor to get started.
          </p>

          <Link
            href="/find-doctor"
            className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary"
          >
            Find doctors
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const doctor = getDoctor(appointment.doctor_id);

            return (
              <article
                key={appointment.id}
                className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold text-on-surface">
                        {doctor
                          ? `Dr. ${doctor.full_name}`
                          : "Doctor"}
                      </h2>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-bold capitalize ${getStatusClasses(
                          appointment.status,
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <p className="mt-1 text-primary">
                      {doctor?.specialization ||
                        "Medical consultation"}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-on-surface-variant">
                      <p>
                        <span className="font-semibold">
                          Date:
                        </span>{" "}
                        {formatDate(
                          appointment.appointment_date,
                        )}
                      </p>

                      <p>
                        <span className="font-semibold">
                          Time:
                        </span>{" "}
                        {formatTime(
                          appointment.appointment_date,
                        )}
                      </p>

                      {doctor?.hospital && (
                        <p>
                          <span className="font-semibold">
                            Hospital:
                          </span>{" "}
                          {doctor.hospital}
                        </p>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-on-surface-variant">
                      <span className="font-semibold">
                        Reason:
                      </span>{" "}
                      {appointment.reason}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    {appointment.status === "confirmed" && (
                      <Link
                        href={`/consultation/${appointment.id}`}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
                      >
                        Join Video Call
                      </Link>
                    )}
                    {["pending", "confirmed"].includes(
                      appointment.status,
                    ) && (
                      <button
                        onClick={() =>
                          handleCancel(appointment.id)
                        }
                        disabled={
                          cancelling === appointment.id
                        }
                        className="rounded-lg border border-error px-4 py-2 font-semibold text-error hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancelling === appointment.id
                          ? "Cancelling..."
                          : "Cancel appointment"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}