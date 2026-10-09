"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { LogOut, Calendar, Stethoscope, Clock, CheckCircle, XCircle, Award, MapPin, Building, Globe, ChevronRight, User, FileText } from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

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
      setAppointments(
        doctorAppointments.filter(
          (app) => app.status !== "cancelled" && app.status !== "completed"
        )
      );
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
        current
          .map((appointment) =>
            appointment.id === updated.id ? updated : appointment
          )
          .filter(
            (app) => app.status !== "cancelled" && app.status !== "completed"
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
    return <LoadingState fullScreen message="Loading your doctor dashboard..." />;
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
        <ErrorState title="Dashboard could not be loaded" message={error} onRetry={loadDashboard} />
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

  const pendingAppointments = appointments.filter((a) => a.status === "pending");
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed");
  const now = new Date();
  const nextAppointment = confirmedAppointments
    .filter((a) => new Date(a.appointment_date) > now)
    .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())[0];

  return (
    <main className="mx-auto w-full max-w-7xl flex-col gap-8 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      {/* Welcome Banner */}
      <section className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary to-primary-container p-8 text-on-primary shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Hello, <span className="text-secondary-fixed">{doctor.full_name || user?.name}</span>
            </h1>
            <p className="mt-2 text-lg text-primary-fixed-dim max-w-xl">
              Manage your practice, review appointments, and provide care to your patients.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/doctor/profile"
              className="rounded-xl bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 shadow-sm border border-white/20"
            >
              Edit Profile
            </Link>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden flex items-center justify-center p-1">
              <NotificationBell />
            </div>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-red-500/20 px-5 py-2.5 font-semibold text-red-100 backdrop-blur-md transition-all hover:bg-red-500/30 border border-red-500/30 shadow-sm"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
      </section>

      {/* Stats Grid */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Specialization"
          value={doctor.specialization}
          icon={<Stethoscope className="h-6 w-6" />}
          colorClass="bg-blue-50 text-blue-700"
        />
        <StatCard
          label="Experience"
          value={`${doctor.experience_years} years`}
          icon={<Award className="h-6 w-6" />}
          colorClass="bg-purple-50 text-purple-700"
        />
        <StatCard
          label="Consultation Fee"
          value={`₹${doctor.consultation_fee ?? 0}`}
          icon={<span className="font-bold text-xl leading-none">₹</span>}
          colorClass="bg-green-50 text-green-700"
        />
        <StatCard
          label="Pending Requests"
          value={pendingAppointments.length.toString()}
          icon={<Clock className="h-6 w-6" />}
          colorClass="bg-orange-50 text-orange-700"
        />
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Appointments Section (2 columns) */}
        <section className="lg:col-span-2 flex flex-col gap-8">
          
          {nextAppointment && (
            <div className="rounded-2xl border border-outline-variant bg-gradient-to-r from-surface-container-lowest to-surface-container-low p-6 shadow-md">
               <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                 <Calendar className="h-5 w-5 text-primary" />
                 Next Appointment
               </h2>
               <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between rounded-xl bg-white p-5 border border-outline-variant/50 shadow-sm">
                 <div className="flex items-start gap-4">
                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                     <User className="h-6 w-6" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-on-surface">Patient Consultation</h3>
                     <p className="text-sm font-medium text-on-surface-variant mt-1">
                       {new Date(nextAppointment.appointment_date).toLocaleDateString("en-IN", { weekday: 'long', month: 'long', day: 'numeric'})} at {new Date(nextAppointment.appointment_date).toLocaleTimeString("en-IN", { hour: 'numeric', minute: '2-digit'})}
                     </p>
                     <p className="mt-2 text-sm text-on-surface-variant bg-surface px-3 py-1.5 rounded-md inline-block border border-outline-variant/30">
                       <span className="font-semibold">Reason:</span> {nextAppointment.reason}
                     </p>
                   </div>
                 </div>
                 <Link
                   href={`/consultation/${nextAppointment.id}`}
                   className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-semibold text-white transition-all hover:bg-primary-container hover:shadow-md"
                 >
                   Join Room
                   <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                 </Link>
               </div>
            </div>
          )}

          <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" />
                All Appointments
              </h2>
              <Badge variant="secondary">{appointments.length} Total</Badge>
            </div>

            {appointments.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-outline-variant p-10 text-center bg-surface">
                <Calendar className="h-10 w-10 text-outline mx-auto mb-4" />
                <p className="font-bold text-lg text-on-surface">No appointments yet</p>
                <p className="mt-2 text-on-surface-variant">New patient requests will appear here once booked.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} onStatusChange={updateStatus} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sidebar Information (1 column) */}
        <section className="flex flex-col gap-6">
          <article className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm relative overflow-hidden">
            <h2 className="text-xl font-bold text-on-surface mb-5">Professional Details</h2>
            <dl className="space-y-4 relative z-10">
              <Row icon={<Award className="h-4 w-4" />} label="Qualification" value={doctor.qualification} />
              <Row icon={<FileText className="h-4 w-4" />} label="License Number" value={doctor.license_number || "Not provided"} />
              <Row icon={<Globe className="h-4 w-4" />} label="Languages" value={doctor.languages.join(", ") || "Not provided"} />
              <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={doctor.location || "Not provided"} />
              <Row icon={<Building className="h-4 w-4" />} label="Hospital/Clinic" value={doctor.hospital || "Not provided"} />
            </dl>
          </article>

          <article className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="text-xl font-bold text-on-surface mb-5">Availability Status</h2>
            <div className={`flex items-center gap-3 p-4 rounded-xl border ${doctor.is_available ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <span className="relative flex h-4 w-4">
                {doctor.is_available && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-4 w-4 ${doctor.is_available ? 'bg-green-500' : 'bg-gray-400'}`}></span>
              </span>
              <span className={`font-bold text-lg ${doctor.is_available ? 'text-green-700' : 'text-gray-600'}`}>
                {doctor.is_available ? "Accepting Patients" : "Currently Unavailable"}
              </span>
            </div>
            
            {doctor.bio && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">About You</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant bg-surface p-4 rounded-xl border border-outline-variant/30">
                  {doctor.bio}
                </p>
              </div>
            )}
            
            <Link
              href="/doctor/profile"
              className="mt-6 flex justify-center rounded-xl bg-secondary-container px-4 py-3 font-semibold text-on-secondary-container transition hover:bg-secondary-container/80"
            >
              Update Availability & Bio
            </Link>
          </article>
        </section>
      </div>
    </main>
  );
}

function AppointmentCard({
  appointment,
  onStatusChange,
}: {
  appointment: Appointment;
  onStatusChange: (id: string, status: Appointment["status"]) => void;
}) {
  const appointmentDate = new Date(appointment.appointment_date);

  return (
    <article className="group relative overflow-hidden rounded-xl border border-outline-variant bg-white p-5 transition-all hover:border-primary/30 hover:shadow-md">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex gap-4 items-start">
           <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${appointment.status === 'pending' ? 'bg-orange-100 text-orange-600' : appointment.status === 'confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
             <User className="h-5 w-5" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
               Patient Request
               <Badge variant={statusVariant[appointment.status]}>{appointment.status}</Badge>
             </h3>
             <p className="mt-1 text-sm font-medium text-on-surface-variant flex items-center gap-1.5">
               <Calendar className="h-4 w-4" />
               {appointmentDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })} at {appointmentDate.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
             </p>
             
             <div className="mt-3 rounded-lg bg-surface-container-lowest p-3 border border-outline-variant/30">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Reason:</span>
                <p className="text-sm text-on-surface">{appointment.reason}</p>
             </div>
           </div>
        </div>
        
        <div className="flex sm:flex-col justify-end gap-2 shrink-0">
          {appointment.status === "pending" && (
            <>
              <button
                onClick={() => onStatusChange(appointment.id, "confirmed")}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-container"
              >
                <CheckCircle className="h-4 w-4" /> Confirm
              </button>
              <button
                onClick={() => onStatusChange(appointment.id, "cancelled")}
                className="flex items-center gap-1.5 rounded-lg border border-outline-variant bg-surface px-4 py-2 text-sm font-semibold text-on-surface transition hover:bg-surface-variant"
              >
                <XCircle className="h-4 w-4" /> Cancel
              </button>
            </>
          )}
          {appointment.status === "confirmed" && (
            <>
              <Link
                href={`/consultation/${appointment.id}`}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Join Video Call
              </Link>
              <button
                onClick={() => onStatusChange(appointment.id, "completed")}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" /> Mark Complete
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

function StatCard({
  label,
  value,
  icon,
  colorClass,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className={`mb-4 inline-flex rounded-xl p-3 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant/30 pb-3 last:border-0 last:pb-0">
      <div className="mt-0.5 text-secondary">{icon}</div>
      <div>
        <dt className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</dt>
        <dd className="mt-0.5 font-medium text-on-surface">{value}</dd>
      </div>
    </div>
  );
}