"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Doctor } from "@/lib/api-client";

type FormData = {
  full_name: string;
  specialization: string;
  qualification: string;
  license_number: string;
  experience_years: string;
  languages: string;
  consultation_fee: string;
  hospital: string;
  location: string;
  bio: string;
  is_available: boolean;
};

const blankForm = (): FormData => ({
  full_name: "",
  specialization: "",
  qualification: "",
  license_number: "",
  experience_years: "",
  languages: "",
  consultation_fee: "",
  hospital: "",
  location: "",
  bio: "",
  is_available: true,
});

export default function DoctorProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState<FormData>(blankForm());
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const doctor = await apiClient.getMyDoctorProfile();

      setHasProfile(true);

      setForm({
        full_name: doctor.full_name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        license_number: doctor.license_number || "",
        experience_years: String(doctor.experience_years),
        languages: doctor.languages.join(", "),
        consultation_fee:
          doctor.consultation_fee !== null &&
          doctor.consultation_fee !== undefined
            ? String(doctor.consultation_fee)
            : "",
        hospital: doctor.hospital || "",
        location: doctor.location || "",
        bio: doctor.bio || "",
        is_available: doctor.is_available,
      });
    } catch (requestError: unknown) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Unable to load your profile.";

      if (message.includes("Doctor profile not found")) {
        setHasProfile(false);

        setForm((current) => ({
          ...current,
          full_name: user?.name || current.full_name,
        }));
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const setField = <K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const experienceYears = Number(form.experience_years);
    const consultationFee = Number(form.consultation_fee);

    if (Number.isNaN(experienceYears) || experienceYears < 0) {
      setError("Please enter a valid experience value.");
      setSaving(false);
      return;
    }

    if (Number.isNaN(consultationFee) || consultationFee < 0) {
      setError("Please enter a valid consultation fee.");
      setSaving(false);
      return;
    }

    const payload = {
      full_name: form.full_name.trim(),
      specialization: form.specialization.trim(),
      qualification: form.qualification.trim(),
      license_number: form.license_number.trim() || null,
      experience_years: experienceYears,
      languages: form.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      consultation_fee: consultationFee,
      hospital: form.hospital.trim() || null,
      location: form.location.trim() || null,
      bio: form.bio.trim() || null,
      is_available: form.is_available,
    };

    try {
      const doctor = hasProfile
        ? await apiClient.updateMyDoctorProfile(payload)
        : await apiClient.post<Doctor>("/doctors/me", payload);

      setHasProfile(true);

      setForm({
        full_name: doctor.full_name,
        specialization: doctor.specialization,
        qualification: doctor.qualification,
        license_number: doctor.license_number || "",
        experience_years: String(doctor.experience_years),
        languages: doctor.languages.join(", "),
        consultation_fee:
          doctor.consultation_fee !== null &&
          doctor.consultation_fee !== undefined
            ? String(doctor.consultation_fee)
            : "",
        hospital: doctor.hospital || "",
        location: doctor.location || "",
        bio: doctor.bio || "",
        is_available: doctor.is_available,
      });

      setSuccess("Your professional profile has been saved successfully.");
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <LoadingState
        fullScreen
        message="Loading doctor profile..."
      />
    );
  }

  if (error && !hasProfile) {
    return (
      <main className="p-6">
        <ErrorState
          title="Doctor profile could not be loaded"
          message={error}
          onRetry={loadProfile}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl p-4 sm:p-8">
      <div className="mb-7">
        <h1 className="text-3xl font-bold text-on-surface">
          Professional profile
        </h1>

        <p className="mt-1 text-on-surface-variant">
          Keep your professional information accurate for RuralCare patients.
        </p>
      </div>

      {success && (
        <p className="mb-5 rounded-lg bg-tertiary-fixed p-4 text-on-tertiary-fixed-variant">
          {success}
        </p>
      )}

      {error && (
        <p className="mb-5 rounded-lg bg-error-container p-4 text-on-error-container">
          {error}
        </p>
      )}

      <form
        onSubmit={save}
        className="space-y-7 rounded-xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm sm:p-8"
      >
        <section>
          <h2 className="text-xl font-bold text-on-surface">
            Professional information
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              value={form.full_name}
              onChange={(value) => setField("full_name", value)}
              required
            />

            <Field
              label="Specialization"
              value={form.specialization}
              onChange={(value) => setField("specialization", value)}
              required
            />

            <Field
              label="Qualification"
              value={form.qualification}
              onChange={(value) => setField("qualification", value)}
              required
            />

            <Field
              label="License number"
              value={form.license_number}
              onChange={(value) => setField("license_number", value)}
            />

            <Field
              label="Experience (years)"
              type="number"
              min="0"
              value={form.experience_years}
              onChange={(value) => setField("experience_years", value)}
              required
            />

            <Field
              label="Consultation fee (₹)"
              type="number"
              min="0"
              value={form.consultation_fee}
              onChange={(value) => setField("consultation_fee", value)}
              required
            />

            <Field
              label="Languages"
              value={form.languages}
              onChange={(value) => setField("languages", value)}
              placeholder="English, Hindi, Tamil"
              required
            />

            <Field
              label="Hospital"
              value={form.hospital}
              onChange={(value) => setField("hospital", value)}
            />

            <Field
              label="Location"
              value={form.location}
              onChange={(value) => setField("location", value)}
            />
          </div>
        </section>

        <section>
          <label className="block text-sm font-medium text-on-surface">
            Bio

            <textarea
              value={form.bio}
              onChange={(event) =>
                setField("bio", event.target.value)
              }
              className="mt-1 min-h-32 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3"
              maxLength={2000}
              placeholder="Tell patients briefly about your professional experience..."
            />
          </label>
        </section>

        <section className="rounded-xl border border-outline-variant p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Availability
              </h2>

              <p className="mt-1 text-sm text-on-surface-variant">
                Control whether patients can see you as available for
                consultation.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(event) =>
                  setField("is_available", event.target.checked)
                }
                className="h-5 w-5"
              />

              <span className="font-semibold text-on-surface">
                {form.is_available ? "Available" : "Unavailable"}
              </span>
            </label>
          </div>
        </section>

        <Button type="submit" isLoading={saving}>
          {hasProfile ? "Save profile" : "Create profile"}
        </Button>
      </form>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  min,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  min?: string;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm font-medium text-on-surface">
      {label}

      <input
        type={type}
        min={min}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-lg border border-outline-variant bg-surface px-4 py-3"
      />
    </label>
  );
}