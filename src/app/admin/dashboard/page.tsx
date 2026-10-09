"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, Doctor } from "@/lib/api-client";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiClient.getAllDoctorsAdmin();
      setDoctors(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleVerify = async (doctorId: string, status: "approved" | "rejected") => {
    try {
      await apiClient.verifyDoctor(doctorId, status);
      // Update local state
      setDoctors(doctors.map(d => d.id === doctorId ? { ...d, verification_status: status } : d));
    } catch (err: unknown) {
      alert("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 font-sans text-on-surface">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
            <p className="mt-1 text-on-surface-variant">Manage RuralCare platform, {user?.name}</p>
          </div>
          <button 
            onClick={logout} 
            className="rounded-lg bg-surface-variant px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-outline-variant/30 transition self-start sm:self-auto"
          >
            Log Out
          </button>
        </header>

        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Doctor Verifications</h2>

          {loading ? (
            <LoadingState message="Loading doctors..." />
          ) : error ? (
            <ErrorState title="Error" message={error} onRetry={loadDoctors} />
          ) : doctors.length === 0 ? (
            <p className="text-on-surface-variant py-8 text-center">No doctors registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-on-surface">
                <thead className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant">
                  <tr>
                    <th className="p-4 font-semibold">Doctor Name</th>
                    <th className="p-4 font-semibold">Specialization</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">License Number</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  {doctors.map(doctor => (
                    <tr key={doctor.id} className="hover:bg-surface-container-lowest/50 transition">
                      <td className="p-4 font-medium text-primary">Dr. {doctor.full_name}</td>
                      <td className="p-4">{doctor.specialization}</td>
                      <td className="p-4">{doctor.location || "-"}</td>
                      <td className="p-4 font-mono text-xs text-on-surface-variant">{doctor.license_number || "-"}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          doctor.verification_status === "approved" ? "bg-emerald-100 text-emerald-800" :
                          doctor.verification_status === "rejected" ? "bg-red-100 text-red-800" :
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {doctor.verification_status}
                        </span>
                      </td>
                      <td className="p-4 text-right flex items-center justify-end gap-2">
                        {doctor.verification_status !== "approved" && (
                          <button
                            onClick={() => handleVerify(doctor.id, "approved")}
                            className="rounded-md bg-emerald-50 text-emerald-600 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 transition"
                          >
                            Approve
                          </button>
                        )}
                        {doctor.verification_status !== "rejected" && (
                          <button
                            onClick={() => handleVerify(doctor.id, "rejected")}
                            className="rounded-md bg-red-50 text-red-600 px-3 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
