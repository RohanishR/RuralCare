"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  User,
  Pill,
  FileText,
  Clock,
  ChevronRight,
  Activity,
  PlusCircle,
  Stethoscope,
  HeartPulse,
} from "lucide-react";

import { Appointment, apiClient } from "@/lib/api-client";
import { useAuth } from "@/contexts/AuthContext";

export default function PatientDashboard() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getPatientAppointments();
        const now = new Date();
        setAppointments(
          data.filter(
            (appointment) => 
              (appointment.status === "confirmed" || appointment.status === "pending") &&
              new Date(appointment.appointment_date) > now
          ),
        );
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Appointments could not be loaded.");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const nextAppointment = [...appointments].sort((a, b) => Date.parse(a.appointment_date) - Date.parse(b.appointment_date))[0];


  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-container p-8 text-on-primary shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},{" "}
              <span className="text-primary-fixed">{user?.name?.split(" ")[0] || "Patient"}</span>
            </h1>
            <p className="mt-2 text-lg text-primary-fixed-dim max-w-xl">
              Your health journey is in good hands. Manage your consultations and medical records seamlessly.
            </p>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-tertiary-fixed"></span>
              </span>
              Network Connected
            </span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl"></div>
      </section>

      {/* Stats Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Upcoming"
          value={loading ? "..." : `${appointments.length} Consultations`}
          icon={<Calendar className="h-6 w-6" />}
          href="/patient/appointments"
          colorClass="bg-blue-50 text-blue-700"
        />
        <StatCard
          label="Profile"
          value="Health Details"
          icon={<User className="h-6 w-6" />}
          href="/patient/profile"
          colorClass="bg-purple-50 text-purple-700"
        />
        <StatCard
          label="Prescriptions"
          value="View Records"
          icon={<Pill className="h-6 w-6" />}
          href="/patient/prescriptions"
          colorClass="bg-green-50 text-green-700"
        />
        <StatCard
          label="Medical Records"
          value="Private & Secure"
          icon={<FileText className="h-6 w-6" />}
          href="/patient/medical-records"
          colorClass="bg-orange-50 text-orange-700"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Next consultation (Takes up 2 columns) */}
        <section className="lg:col-span-2 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-md transition-all hover:shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Next Consultation
            </h2>
          </div>

          {loadError ? <p role="alert" className="rounded-lg bg-error-container p-4 text-sm text-on-error-container">{loadError} <Link href="/patient/appointments" className="underline">Open appointments to retry</Link></p> : nextAppointment ? (
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between rounded-xl bg-surface-container-low p-5 border border-outline-variant/50">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Doctor Consultation</h3>
                  <p className="text-sm font-medium text-on-surface-variant mt-1">
                    {formatDate(nextAppointment.appointment_date)} at {formatTime(nextAppointment.appointment_date)}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant bg-surface px-3 py-1.5 rounded-md inline-block border border-outline-variant/30">
                    <span className="font-semibold">Reason:</span> {nextAppointment.reason}
                  </p>
                </div>
              </div>
              {nextAppointment.status === "confirmed" ? (
                <Link
                  href={`/consultation/${nextAppointment.id}`}
                  className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition-all hover:bg-primary-container hover:shadow-md"
                >
                  Join Call
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <button
                  disabled
                  className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-surface-variant px-5 py-2.5 font-semibold text-on-surface-variant cursor-not-allowed"
                >
                  Pending Confirmation
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/50 bg-surface p-8 text-center">
              <div className="mb-4 rounded-full bg-secondary-container p-3 text-on-secondary-container">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2">No upcoming appointments</h3>
              <p className="mb-6 max-w-sm text-on-surface-variant text-sm">
                Get the care you need by finding a verified specialist and booking a consultation time that works for you.
              </p>
              <Link
                href="/patient/find-doctor"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                <PlusCircle className="h-5 w-5" />
                Find a Doctor
              </Link>
            </div>
          )}
        </section>

        {/* AI Symptom Assistant */}
        <section className="relative overflow-hidden rounded-2xl border border-secondary/20 bg-gradient-to-b from-secondary-container/80 to-surface-container-lowest p-6 shadow-md transition-all hover:shadow-lg">
          <div className="relative z-10 flex h-full flex-col justify-between gap-6">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-secondary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
                <Activity className="h-3.5 w-3.5" />
                AI Assistant
              </div>
              <h2 className="text-xl font-bold text-on-surface">Symptom Assistant</h2>
              <p className="mt-3 text-sm text-on-surface-variant">
                Organize your symptoms for a conversation with your doctor. Assistive information only, not a diagnosis.
              </p>
            </div>

            <Link
              href="/patient/symptom-assistant"
              className="group flex w-full items-center justify-between rounded-xl bg-secondary px-5 py-3.5 font-semibold text-white shadow-sm transition-all hover:bg-secondary/90 hover:shadow-md"
            >
              Organize symptoms
              <HeartPulse className="h-5 w-5 transition-transform group-hover:scale-110" />
            </Link>
          </div>
          
          <div className="absolute -bottom-10 -right-10 opacity-5">
            <HeartPulse className="h-48 w-48" />
          </div>
        </section>
      </div>


    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
  href,
  colorClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  href?: string;
  colorClass: string;
}) {
  const content = (
    <>
      <div className={`mb-4 inline-flex rounded-xl p-3 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-lg font-bold text-on-surface">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
      >
        <div className="absolute right-4 top-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
          <ChevronRight className="h-5 w-5 text-on-surface-variant" />
        </div>
        {content}
      </Link>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm">
      {content}
    </div>
  );
}
