"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { apiClient } from "@/lib/api-client";
import { availabilitySummary, Doctor } from "@/lib/doctor";
import {
  createAppointment,
  AppointmentMode,
} from "@/lib/patient-portal";

type DoctorListResponse = {
  doctors: Doctor[];
};

export default function FindDoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [language, setLanguage] = useState("All");
  const [maxFee, setMaxFee] = useState(500);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const specialties = useMemo(
    () =>
      [
        ...new Set(
          doctors.map((doctor) => doctor.specialization),
        ),
      ].sort(),
    [doctors],
  );

  const languages = useMemo(
    () =>
      [
        ...new Set(
          doctors.flatMap((doctor) => doctor.languages),
        ),
      ].sort(),
    [doctors],
  );

  const loadDoctors = async () => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();

    if (query.trim().length >= 2) {
      params.set("search", query.trim());
    }

    if (specialization !== "All") {
      params.set("specialization", specialization);
    }

    if (language !== "All") {
      params.set("language", language);
    }

    params.set("max_fee", String(maxFee));

    try {
      const queryString = params.toString();

      const data = await apiClient.get<DoctorListResponse>(
        queryString ? `/doctors?${queryString}` : "/doctors",
      );

      setDoctors(data.doctors);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load doctors.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(
      loadDoctors,
      query ? 350 : 0,
    );

    return () => window.clearTimeout(timer);
  }, [query, specialization, language, maxFee]);

  const resetFilters = () => {
    setQuery("");
    setSpecialization("All");
    setLanguage("All");
    setMaxFee(500);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const requestedSpecialization =
      params.get("specialization");

    const requestedLanguage = params.get("language");

    if (requestedSpecialization) {
      setSpecialization(requestedSpecialization);
    }

    if (requestedLanguage) {
      setLanguage(requestedLanguage);
    }
  }, []);

  const openBooking = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingError("");
    setBookingSuccess("");
  };

  const closeBooking = () => {
    if (booking) return;

    setSelectedDoctor(null);
    setBookingError("");
  };

  const bookAppointment = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedDoctor) {
      return;
    }

    setBooking(true);
    setBookingError("");
    setBookingSuccess("");

    const formData = new FormData(event.currentTarget);

    const appointmentDate = String(
      formData.get("date") || "",
    );

    const appointmentTime = String(
      formData.get("time") || "",
    );

    const mode =
      String(
        formData.get("mode") || "video",
      ) as AppointmentMode;

    const reason = String(
      formData.get("reason") || "",
    ).trim();

    try {
      await createAppointment({
        doctor_id: selectedDoctor.id,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        mode,
        reason: reason.length > 0 ? reason : undefined,
      });

      setBookingSuccess(
        `Your appointment with Dr. ${selectedDoctor.name} has been confirmed.`,
      );

      setSelectedDoctor(null);

      await loadDoctors();
    } catch (requestError: unknown) {
      setBookingError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to book this appointment.",
      );
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-outline-variant bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-primary"
          >
            <span className="material-symbols-outlined">
              local_hospital
            </span>
            RuralCare
          </Link>

          <div className="flex gap-2">
            <Link
              href="/patient/dashboard"
              className="rounded-lg px-3 py-2 text-sm text-primary hover:bg-surface-container"
            >
              Dashboard
            </Link>

            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <p className="mb-2 text-sm font-semibold text-secondary">
          VERIFIED RURAL TELEHEALTH NETWORK
        </p>

        <h1 className="text-3xl font-bold text-on-surface sm:text-4xl">
          Find the right doctor
        </h1>

        <p className="mt-2 max-w-2xl text-on-surface-variant">
          Search approved clinicians and view their
          qualifications, availability, and consultation
          fees.
        </p>

        {bookingSuccess && (
          <div
            role="status"
            className="mt-6 rounded-lg bg-tertiary-fixed p-4 text-on-tertiary-fixed-variant"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{bookingSuccess}</p>

              <Link
                href="/patient/appointments"
                className="font-bold underline"
              >
                View appointments
              </Link>
            </div>
          </div>
        )}

        <div className="mt-7 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
            <h2 className="font-bold text-on-surface">
              Filter doctors
            </h2>

            <label className="mt-5 block text-sm font-medium">
              Specialty

              <select
                value={specialization}
                onChange={(event) =>
                  setSpecialization(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface p-3"
              >
                <option>All</option>

                {specialization !== "All" &&
                  !specialties.includes(specialization) && (
                    <option>{specialization}</option>
                  )}

                {specialties.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium">
              Language

              <select
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
                className="mt-1 w-full rounded-lg border border-outline-variant bg-surface p-3"
              >
                <option>All</option>

                {language !== "All" &&
                  !languages.includes(language) && (
                    <option>{language}</option>
                  )}

                {languages.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-medium">
              Maximum consultation fee: ₹{maxFee}

              <input
                className="mt-3 w-full accent-primary"
                min="0"
                max="5000"
                step="50"
                type="range"
                value={maxFee}
                onChange={(event) =>
                  setMaxFee(Number(event.target.value))
                }
              />
            </label>

            <button
              onClick={resetFilters}
              className="mt-5 text-sm font-semibold text-primary underline"
            >
              Clear filters
            </button>
          </aside>

          <section>
            <label className="relative block">
              <span className="sr-only">
                Search doctors
              </span>

              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant">
                search
              </span>

              <input
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                placeholder="Search by specialty, qualification, location, or language"
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-3 pl-11 pr-4"
              />
            </label>

            {loading ? (
              <LoadingState message="Finding approved doctors..." />
            ) : error ? (
              <ErrorState
                title="Doctors could not be loaded"
                message={error}
                onRetry={loadDoctors}
              />
            ) : doctors.length === 0 ? (
              <EmptyState
                title="No doctors found"
                description="Try widening your search or changing the filters."
                actionLabel="Clear filters"
                onAction={resetFilters}
              />
            ) : (
              <>
                <p className="my-5 text-sm text-on-surface-variant">
                  {doctors.length} doctor
                  {doctors.length === 1 ? "" : "s"}{" "}
                  available for your preferences
                </p>

                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <article
                      key={doctor.id}
                      className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm"
                    >
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-bold text-on-surface">
                              Dr. {doctor.name}
                            </h2>

                            <span className="rounded bg-tertiary-fixed px-2 py-0.5 text-xs font-bold text-on-tertiary-fixed-variant">
                              Verified
                            </span>
                          </div>

                          <p className="mt-1 text-primary">
                            {doctor.specialization}
                          </p>

                          <p className="mt-1 text-sm text-on-surface-variant">
                            {doctor.qualification} ·{" "}
                            {doctor.experience} years experience
                          </p>

                          <p className="mt-3 text-sm text-on-surface-variant">
                            {doctor.languages.join(" · ")}
                          </p>

                          <p className="mt-3 text-sm">
                            <span className="font-semibold text-tertiary">
                              Availability:
                            </span>{" "}
                            {availabilitySummary(
                              doctor.availability,
                            )}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col justify-between gap-4 sm:items-end">
                          <p className="text-xl font-bold text-primary">
                            ₹{doctor.consultation_fee}
                          </p>

                          <div className="flex flex-col gap-2 sm:items-end">
                            <Link
                              href={`/find-doctor/${doctor.id}`}
                              className="rounded-lg border border-primary px-5 py-3 text-center font-semibold text-primary hover:bg-primary-container"
                            >
                              View profile
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                openBooking(doctor)
                              }
                              className="rounded-lg bg-primary px-5 py-3 text-center font-semibold text-on-primary hover:bg-primary-container"
                            >
                              Book appointment
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </section>

      {selectedDoctor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface-container-lowest p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2
                  id="booking-title"
                  className="text-2xl font-bold text-on-surface"
                >
                  Book appointment
                </h2>

                <p className="mt-1 text-primary">
                  Dr. {selectedDoctor.name}
                </p>

                <p className="mt-1 text-sm text-on-surface-variant">
                  {selectedDoctor.specialization}
                </p>
              </div>

              <button
                type="button"
                onClick={closeBooking}
                disabled={booking}
                aria-label="Close booking dialog"
                className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container disabled:opacity-50"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>
            </div>

            <div className="mt-5 rounded-lg bg-primary-container p-4 text-sm text-on-primary-container">
              <p>
                Consultation fee:{" "}
                <strong>
                  ₹{selectedDoctor.consultation_fee}
                </strong>
              </p>

              <p className="mt-1">
                Availability:{" "}
                {availabilitySummary(
                  selectedDoctor.availability,
                )}
              </p>
            </div>

            {bookingError && (
              <div
                role="alert"
                className="mt-5 rounded-lg bg-error-container p-4 text-sm text-on-error-container"
              >
                {bookingError}
              </div>
            )}

            <form
              onSubmit={bookAppointment}
              className="mt-6 space-y-5"
            >
              <div>
                <label
                  htmlFor="appointment-date"
                  className="block text-sm font-medium text-on-surface"
                >
                  Date
                </label>

                <input
                  id="appointment-date"
                  required
                  name="date"
                  min={today}
                  type="date"
                  className="mt-1 w-full rounded-lg border border-outline-variant bg-surface p-3"
                />
              </div>

              <div>
                <label
                  htmlFor="appointment-time"
                  className="block text-sm font-medium text-on-surface"
                >
                  Time
                </label>

                <input
                  id="appointment-time"
                  required
                  name="time"
                  type="time"
                  className="mt-1 w-full rounded-lg border border-outline-variant bg-surface p-3"
                />

                <p className="mt-1 text-xs text-on-surface-variant">
                  The server will verify that the selected
                  time falls within the doctor&apos;s
                  availability.
                </p>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-on-surface">
                  Consultation type
                </legend>

                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant p-3 hover:bg-surface-container">
                    <input
                      defaultChecked
                      name="mode"
                      type="radio"
                      value="video"
                    />

                    <span>
                      <span className="block font-semibold text-on-surface">
                        Video consultation
                      </span>

                      <span className="text-xs text-on-surface-variant">
                        Video will be available in the
                        consultation module.
                      </span>
                    </span>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-outline-variant p-3 hover:bg-surface-container">
                    <input
                      name="mode"
                      type="radio"
                      value="audio"
                    />

                    <span>
                      <span className="block font-semibold text-on-surface">
                        Audio only
                      </span>

                      <span className="text-xs text-on-surface-variant">
                        Audio-only consultation.
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>

              <div>
                <label
                  htmlFor="appointment-reason"
                  className="block text-sm font-medium text-on-surface"
                >
                  Reason for consultation
                </label>

                <textarea
                  id="appointment-reason"
                  name="reason"
                  rows={4}
                  maxLength={500}
                  placeholder="Briefly describe why you need a consultation..."
                  className="mt-1 w-full resize-none rounded-lg border border-outline-variant bg-surface p-3"
                />

                <p className="mt-1 text-xs text-on-surface-variant">
                  Maximum 500 characters.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeBooking}
                  disabled={booking}
                  className="rounded-lg border border-outline-variant px-5 py-3 font-semibold text-on-surface hover:bg-surface-container disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={booking}
                  className="rounded-lg bg-primary px-5 py-3 font-semibold text-on-primary hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {booking
                    ? "Confirming..."
                    : "Confirm appointment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}