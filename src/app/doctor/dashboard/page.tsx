"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LogOut } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Appointment, Doctor } from "@/lib/api-client";

const statusVariant = {
  pending: "warning",
  confirmed: "success",
  completed: "success",
  cancelled: "error",
} as const;

export default function DoctorDashboard() {
  const { user, logout } = useAuth();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [doctorProfile, doctorAppointments] = await Promise.all([
        apiClient.getMyDoctorProfile(),
        apiClient.getDoctorAppointments(),
      ]);

      setDoctor(doctorProfile);
      setAppointments(doctorAppointments);
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load your doctor dashboard.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateStatus = async (
    appointmentId: string,
    status: Appointment["status"]
  ) => {
    try {
      const updated = await apiClient.updateAppointment(appointmentId, {
        status,
      });

      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === updated.id ? updated : appointment
        )
      );
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to update appointment.";

      setError(message);
    }
  };

  if (loading) {
    return (
      <LoadingState
        fullScreen
        message="Loading your doctor dashboard..."
      />
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <ErrorState
          title="Doctor dashboard could not be loaded"
          message={error}
          onRetry={loadDashboard}
        />
      </main>
    );
  }

  if (!doctor) {
    return (
      <main className="mx-auto max-w-3xl p-6 sm:p-10">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

        <EmptyState
          title="Create your professional profile"
          description="Add your professional information before managing appointments."
          actionLabel="Create profile"
          onAction={() => {
            window.location.href = "/doctor/profile";
          }}
        />
      </main>
    );
  }

  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending"
  );

  const confirmedAppointments = appointments.filter(
    (appointment) => appointment.status === "confirmed"
  );

  return (
    <main className="mx-auto w-full max-w-6xl p-4 sm:p-8">
      <section className="flex flex-col justify-between gap-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-semibold text-secondary">
            DOCTOR DASHBOARD
          </p>

          <h1 className="mt-1 text-3xl font-bold text-on-surface">
            Welcome, {doctor.full_name || user?.name}
          </h1>

          <p className="mt-2 text-on-surface-variant">
            Manage your appointments and professional profile.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/doctor/profile"
            className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-on-primary"
          >
            Edit profile
          </Link>

          <button
            type="button"
            onClick={logout}
            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Specialization" value={doctor.specialization} />

        <Stat
          label="Experience"
          value={`${doctor.experience_years} years`}
        />

        <Stat
          label="Consultation fee"
          value={`₹${doctor.consultation_fee ?? 0}`}
        />

        <Stat
          label="Pending appointments"
          value={pendingAppointments.length}
        />
      </section>

      <section className="mt-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-on-surface">
              Appointments
            </h2>

            <p className="mt-1 text-sm text-on-surface-variant">
              Review and manage your patient appointments.
            </p>
          </div>

          <div className="text-sm text-on-surface-variant">
            {appointments.length} total appointment
            {appointments.length !== 1 ? "s" : ""}
          </div>
        </div>

        {appointments.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-outline-variant p-8 text-center">
            <p className="font-semibold text-on-surface">
              No appointments yet
            </p>

            <p className="mt-1 text-sm text-on-surface-variant">
              New patient appointments will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onStatusChange={updateStatus}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface">
            Professional information
          </h2>

          <dl className="mt-5 space-y-4">
            <Row
              label="Qualification"
              value={doctor.qualification}
            />

            <Row
              label="License"
              value={doctor.license_number || "Not provided"}
            />

            <Row
              label="Languages"
              value={doctor.languages.join(", ") || "Not provided"}
            />

            <Row
              label="Location"
              value={doctor.location || "Not provided"}
            />

            <Row
              label="Hospital"
              value={doctor.hospital || "Not provided"}
            />
          </dl>
        </article>

        <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface">
            Availability
          </h2>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`h-3 w-3 rounded-full ${
                doctor.is_available ? "bg-green-500" : "bg-gray-400"
              }`}
            />

            <span className="font-semibold text-on-surface">
              {doctor.is_available
                ? "Available"
                : "Currently unavailable"}
            </span>
          </div>

          {doctor.bio && (
            <p className="mt-5 text-sm leading-6 text-on-surface-variant">
              {doctor.bio}
            </p>
          )}

          <Link
            href="/doctor/profile"
            className="mt-6 inline-block font-semibold text-primary underline"
          >
            Update profile
          </Link>
        </article>
      </section>

      {confirmedAppointments.length > 0 && (
        <section className="mt-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="text-xl font-bold text-on-surface">
            Upcoming confirmed appointments
          </h2>

          <p className="mt-1 text-sm text-on-surface-variant">
            You currently have {confirmedAppointments.length} confirmed
            appointment
            {confirmedAppointments.length !== 1 ? "s" : ""}.
          </p>
        </section>
      )}
    </main>
  );
}

function AppointmentCard({
  appointment,
  onStatusChange,
}: {
  appointment: Appointment;
  onStatusChange: (
    appointmentId: string,
    status: Appointment["status"]
  ) => void;
}) {
  const appointmentDate = new Date(appointment.appointment_date);

  return (
    <article className="rounded-lg border border-outline-variant p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Appointment
          </p>

          <h3 className="mt-1 text-lg font-bold text-on-surface">
            Patient consultation
          </h3>

          <p className="mt-2 text-sm text-on-surface-variant">
            {appointmentDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {" • "}
            {appointmentDate.toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>

        <Badge variant={statusVariant[appointment.status]}>
          {appointment.status}
        </Badge>
      </div>

      <div className="mt-4 rounded-lg bg-surface-container-low p-4">
        <p className="text-sm font-semibold text-on-surface">
          Reason for consultation
        </p>

        <p className="mt-1 text-sm text-on-surface-variant">
          {appointment.reason}
        </p>
      </div>

      {appointment.status === "pending" && (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              onStatusChange(appointment.id, "confirmed")
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Confirm appointment
          </button>

          <button
            type="button"
            onClick={() =>
              onStatusChange(appointment.id, "cancelled")
            }
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface"
          >
            Cancel
          </button>
        </div>
      )}

      {appointment.status === "confirmed" && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() =>
              onStatusChange(appointment.id, "completed")
            }
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Mark as completed
          </button>
        </div>
      )}
    </article>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      <p className="text-sm text-on-surface-variant">{label}</p>

      <div className="mt-2 text-lg font-semibold text-on-surface">
        {value}
      </div>
    </article>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-sm text-on-surface-variant">{label}</dt>

      <dd className="mt-1 font-semibold text-on-surface">{value}</dd>
    </div>
  );
}