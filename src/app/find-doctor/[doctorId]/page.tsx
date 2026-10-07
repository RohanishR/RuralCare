"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Clock,
  Languages,
  MapPin,
  Stethoscope,
} from "lucide-react";

import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { apiClient, Doctor } from "@/lib/api-client";

export default function DoctorDetailsPage() {
  const params = useParams<{ doctorId: string }>();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [error, setError] = useState("");

  const loadDoctor = async () => {
    try {
      setError("");

      const data = await apiClient.getDoctor(params.doctorId);
      setDoctor(data);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load this doctor.",
      );
    }
  };

  useEffect(() => {
    if (params.doctorId) {
      loadDoctor();
    }
  }, [params.doctorId]);

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <ErrorState
          title="Doctor not available"
          message={error}
          onRetry={loadDoctor}
        />
      </main>
    );
  }

  if (!doctor) {
    return <LoadingState fullScreen message="Loading doctor profile..." />;
  }

  return (
    <main className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/find-doctor"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to doctors
        </Link>

        <article className="mt-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary-container text-3xl font-bold text-primary">
              {doctor.full_name.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold text-on-surface">
                  {doctor.full_name}
                </h1>

                <span className="inline-flex items-center gap-1 rounded bg-tertiary-fixed px-2 py-1 text-xs font-bold text-on-tertiary-fixed-variant">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              </div>

              <p className="mt-2 text-lg text-primary">
                {doctor.specialization}
              </p>

              <p className="mt-1 text-on-surface-variant">
                {doctor.qualification}
              </p>
            </div>

            <div className="sm:text-right">
              <p className="text-sm text-on-surface-variant">
                Consultation fee
              </p>

              <p className="mt-1 text-xl font-bold text-primary">
                {doctor.consultation_fee != null
                  ? `₹${doctor.consultation_fee}`
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 border-y border-outline-variant py-6 sm:grid-cols-2">
            <Detail
              icon={<Stethoscope className="h-5 w-5" />}
              label="Experience"
              value={`${doctor.experience_years} years`}
            />

            <Detail
              icon={<Languages className="h-5 w-5" />}
              label="Languages"
              value={
                doctor.languages.length > 0
                  ? doctor.languages.join(", ")
                  : "Not specified"
              }
            />

            <Detail
              icon={<MapPin className="h-5 w-5" />}
              label="Location"
              value={doctor.location || "Not specified"}
            />

            <Detail
              icon={<Clock className="h-5 w-5" />}
              label="Availability"
              value={
                doctor.is_available
                  ? "Available"
                  : "Currently unavailable"
              }
            />

            <Detail
              icon={<Calendar className="h-5 w-5" />}
              label="Hospital"
              value={doctor.hospital || "Not specified"}
            />

            <Detail
              icon={<BadgeCheck className="h-5 w-5" />}
              label="Medical registration"
              value={doctor.license_number || "Not specified"}
            />
          </div>

          {doctor.bio && (
            <section className="mt-6">
              <h2 className="text-lg font-bold text-on-surface">
                About {doctor.full_name}
              </h2>

              <p className="mt-2 whitespace-pre-line text-on-surface-variant">
                {doctor.bio}
              </p>
            </section>
          )}

          {doctor.languages.length > 0 && (
            <section className="mt-6">
              <h2 className="text-lg font-bold text-on-surface">
                Languages spoken
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.languages.map((language) => (
                  <span
                    key={language}
                    className="rounded-full bg-secondary-container px-3 py-1.5 text-sm font-medium text-on-secondary-container"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-6">
            <h2 className="text-lg font-bold text-on-surface">
              Consultation availability
            </h2>

            <div className="mt-3 rounded-lg bg-surface-container p-4">
              <div className="flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    doctor.is_available
                      ? "bg-green-500"
                      : "bg-gray-400"
                  }`}
                />

                <p className="font-medium text-on-surface">
                  {doctor.is_available
                    ? "Currently accepting appointments"
                    : "Currently unavailable"}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8">
            {doctor.is_available ? (
              <Link
                href={`/find-doctor?doctor=${doctor.id}`}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3 font-semibold text-on-primary transition hover:opacity-90"
              >
                Book an appointment
              </Link>
            ) : (
              <button
                disabled
                className="w-full cursor-not-allowed rounded-xl bg-surface-container px-5 py-3 font-semibold text-on-surface-variant"
              >
                Doctor currently unavailable
              </button>
            )}
          </div>
        </article>
      </div>
    </main>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 text-primary">{icon}</div>

      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>

        <p className="mt-1 font-semibold text-on-surface">{value}</p>
      </div>
    </div>
  );
}