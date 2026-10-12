"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

interface PatientProfileData {
  full_name?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  phone?: string | null;
  location?: string | null;
  preferred_language?: string | null;
  blood_group?: string | null;
  allergies?: string[] | null;
  existing_medical_conditions?: string[] | null;
  current_medications?: string[] | null;
  emergency_contact?: { name?: string; relationship?: string; phone?: string } | null;
}

export default function PatientProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    location: "",
    preferred_language: "English",
    blood_group: "",
    allergies: "",
    existing_medical_conditions: "",
    current_medications: "",
    emergency_contact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiClient.get<PatientProfileData>("/patients/me");
        if (data) {
          setFormData({
            full_name: data.full_name || "",
            date_of_birth: data.date_of_birth?.slice(0, 10) || "",
            gender: data.gender || "",
            phone: data.phone || "",
            location: data.location || "",
            preferred_language: data.preferred_language || "English",
            blood_group: data.blood_group || "",
            allergies: Array.isArray(data.allergies) ? data.allergies.join(", ") : "",
            existing_medical_conditions: Array.isArray(data.existing_medical_conditions)
              ? data.existing_medical_conditions.join(", ")
              : "",
            current_medications: Array.isArray(data.current_medications)
              ? data.current_medications.join(", ")
              : "",
            emergency_contact: {
              name: data.emergency_contact?.name || "",
              relationship: data.emergency_contact?.relationship || "",
              phone: data.emergency_contact?.phone || "",
            },
          });
        }
      } catch (error: unknown) {
        setLoadError(error instanceof Error ? error.message : "Unable to load your profile. Please retry.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("em_")) {
      const field = name.replace("em_", "");
      setFormData((prev) => ({
        ...prev,
        emergency_contact: {
          ...prev.emergency_contact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || loadError) return;
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const payload = {
        ...formData,
        full_name: formData.full_name.trim(),
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        blood_group: formData.blood_group || null,
        emergency_contact: Object.values(formData.emergency_contact).some(value => value.trim())
          ? formData.emergency_contact : null,
        allergies: formData.allergies
          ? formData.allergies
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        existing_medical_conditions: formData.existing_medical_conditions
          ? formData.existing_medical_conditions
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        current_medications: formData.current_medications
          ? formData.current_medications
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      await apiClient.put<PatientProfileData>("/patients/me", payload);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (loadError) return (
    <main className="mx-auto max-w-4xl p-6">
      <p role="alert" className="mb-4 rounded-lg bg-error-container p-4 text-on-error-container">{loadError} Your existing profile has not been changed.</p>
      <Button type="button" onClick={() => window.location.reload()}>Retry loading profile</Button>
    </main>
  );

  return (
    <main className="grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
      <div className="bg-surface-container-lowest rounded-xl p-6 sm:p-10 shadow-sm border border-outline-variant">
        <div className="border-b border-outline-variant pb-6 mb-8 text-left">
          <h1 className="text-headline-md sm:text-headline-lg font-headline-md sm:font-headline-lg text-on-surface font-bold tracking-tight">
            My Health Profile
          </h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-3xl">
            Keep your health information up to date for faster and more accurate
            teleconsultations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <fieldset disabled={saving} className="contents">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="col-span-1 md:col-span-2 text-title-lg font-title-lg text-on-surface border-b border-outline-variant pb-2 mt-4">
              Basic Information
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Full Name
              </label>
              <div className="relative subtle-ring rounded-lg">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">
                    person
                  </span>
                </span>
                <input
                  type="text"
                  name="full_name"
                  aria-label="Full Name"
                  required
                  maxLength={100}
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                  placeholder="e.g. Ramesh Kumar Verma"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Phone Number
              </label>
              <div className="relative subtle-ring rounded-lg">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">
                    smartphone
                  </span>
                </span>
                <input
                  type="tel"
                  name="phone"
                  aria-label="Phone Number"
                  maxLength={20}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Date of Birth
              </label>
              <div className="relative subtle-ring rounded-lg">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">
                    calendar_today
                  </span>
                </span>
                <input
                  type="date"
                  name="date_of_birth"
                  aria-label="Date of Birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Gender
              </label>
              <select
                name="gender"
                aria-label="Gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Location / District
              </label>
              <div className="relative subtle-ring rounded-lg">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">
                    location_on
                  </span>
                </span>
                <input
                  type="text"
                  name="location"
                  aria-label="Location / District"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                  placeholder="Village, District, State"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Preferred Language
              </label>
              <select
                name="preferred_language"
                aria-label="Preferred Language"
                value={formData.preferred_language}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Marathi">Marathi (मराठी)</option>
              </select>
            </div>

            {/* Health Info */}
            <div id="health-information" className="col-span-1 md:col-span-2 text-title-lg font-title-lg text-on-surface border-b border-outline-variant pb-2 mt-6">
              Health Information
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Blood Group
              </label>
              <select
                name="blood_group"
                aria-label="Blood Group"
                value={formData.blood_group}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
              >
                <option value="">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                aria-label="Allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                placeholder="Comma separated (e.g. Peanuts, Penicillin)"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Existing Medical Conditions
              </label>
              <input
                type="text"
                name="existing_medical_conditions"
                aria-label="Existing Medical Conditions"
                value={formData.existing_medical_conditions}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                placeholder="Comma separated (e.g. Diabetes, Hypertension)"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Current Medications
              </label>
              <input
                type="text"
                name="current_medications"
                aria-label="Current Medications"
                value={formData.current_medications}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                placeholder="Comma separated"
              />
            </div>

            {/* Emergency Contact */}
            <div className="col-span-1 md:col-span-2 text-title-lg font-title-lg text-on-surface border-b border-outline-variant pb-2 mt-6 text-error">
              Emergency Contact
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Contact Name
              </label>
              <input
                type="text"
                name="em_name"
                aria-label="Emergency Contact Name"
                maxLength={100}
                value={formData.emergency_contact.name}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                placeholder="Emergency Contact Name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Relationship
              </label>
              <input
                type="text"
                name="em_relationship"
                aria-label="Emergency Contact Relationship"
                maxLength={50}
                value={formData.emergency_contact.relationship}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                placeholder="e.g. Spouse, Parent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-label-md font-label-md text-on-surface font-semibold">
                Emergency Phone
              </label>
              <input
                type="tel"
                name="em_phone"
                aria-label="Emergency Phone"
                maxLength={20}
                value={formData.emergency_contact.phone}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-lg bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0"
                placeholder="Emergency Phone Number"
              />
            </div>
          </div>
          </fieldset>

          <div className="pt-6 border-t border-outline-variant">
            {message.text && (
              <p role={message.type === "error" ? "alert" : "status"}
                className={`mb-4 rounded-lg p-4 ${message.type === "success" ? "bg-tertiary-fixed text-on-tertiary-fixed-variant" : "bg-error-container text-on-error-container"}`}>
                {message.text}
              </p>
            )}
            <Button
              type="submit"
              isLoading={saving}
              className="w-full md:w-auto min-h-12.5 px-8 text-label-lg font-label-lg bg-primary hover:bg-primary-container text-on-primary rounded-lg"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
