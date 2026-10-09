import Cookies from "js-cookie";

const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // Relative path for client-side fetches (relies on Vercel rewrites)
    return "/api/v1";
  }
  // Server-side fetching using Vercel internal service bindings
  if (process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL}/api/v1`;
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
};
const API_URL = getApiUrl();

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = "ApiError";
  }
}

export interface Doctor {
  id: string;
  user_id: string;
  full_name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  license_number?: string | null;
  hospital?: string | null;
  location?: string | null;
  consultation_fee?: number | null;
  languages: string[];
  bio?: string | null;
  is_available: boolean;
  verification_status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  reason: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  doctor_id: string;
  appointment_date: string;
  reason: string;
}

export interface UpdateAppointmentData {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export type DoctorProfileInput = Omit<
  Doctor,
  "id" | "user_id" | "created_at" | "updated_at" | "verification_status"
>;

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token =
      typeof window !== "undefined" ? Cookies.get("access_token") : null;

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal: options.signal ?? AbortSignal.timeout(30000),
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detail: unknown = errorData?.detail;
        const message = typeof detail === "string" ? detail :
          Array.isArray(detail) ? detail.map((item: { msg?: string }) => item.msg || "Invalid input").join(". ") :
          response.status >= 500 ? "The service is temporarily unavailable. Please try again." : `Request failed (${response.status}).`;
        throw new ApiError(message, response.status);
      }

      return response.status === 204 ? undefined as T : response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new ApiError("Unable to reach RuralCare. Check your connection and try again.", 0);
      }
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new ApiError("The request took too long. Check your connection and try again.", 408);
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  // =========================
  // Admin
  // =========================

  async getAllDoctorsAdmin(): Promise<Doctor[]> {
    return this.get<Doctor[]>("/admin/doctors");
  }

  async verifyDoctor(doctorId: string, status: "pending" | "approved" | "rejected"): Promise<Doctor> {
    return this.patch<Doctor>(`/admin/doctors/${doctorId}/verify`, { status });
  }

  // =========================
  // Doctors
  // =========================

  async getDoctors(): Promise<Doctor[]> {
    return this.get<Doctor[]>("/doctors/");
  }

  async getDoctor(doctorId: string): Promise<Doctor> {
    return this.get<Doctor>(`/doctors/${doctorId}`);
  }

  async getMyDoctorProfile(): Promise<Doctor> {
    return this.get<Doctor>("/doctors/me");
  }

  async updateMyDoctorProfile(
    data: Partial<DoctorProfileInput>,
  ): Promise<Doctor> {
    return this.put<Doctor>("/doctors/me", data);
  }

  // =========================
  // Appointments
  // =========================

  async createAppointment(
    data: CreateAppointmentData,
  ): Promise<Appointment> {
    return this.post<Appointment>("/appointments/", data);
  }

  async getPatientAppointments(): Promise<Appointment[]> {
    return this.get<Appointment[]>("/appointments/patient");
  }

  async getDoctorAppointments(): Promise<Appointment[]> {
    return this.get<Appointment[]>("/appointments/doctor");
  }

  async updateAppointment(
    appointmentId: string,
    data: UpdateAppointmentData,
  ): Promise<Appointment> {
    return this.patch<Appointment>(
      `/appointments/${appointmentId}`,
      data,
    );
  }
}

export const api = new ApiClient();
export const apiClient = api;
export default api;

// =========================
// Medical Records
// =========================

export interface MedicalRecord {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string | null;
  diagnosis: string;
  symptoms: string;
  notes: string;
  created_at: string;
}

export interface MedicalRecordCreate {
  appointment_id: string;
  diagnosis: string;
  symptoms: string;
  notes?: string;
}

export async function getPatientMedicalRecords(): Promise<
  MedicalRecord[]
> {
  return apiClient.get("/medical-records/patient");
}

export async function createMedicalRecord(
  data: MedicalRecordCreate,
): Promise<MedicalRecord> {
  return apiClient.post("/medical-records/", data);
}


// =========================
// Prescriptions
// =========================

export interface Prescription {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_id?: string | null;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  created_at: string;
}

export interface PrescriptionCreate {
  appointment_id: string;
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export async function getPatientPrescriptions(): Promise<
  Prescription[]
> {
  return apiClient.get("/prescriptions/patient");
}

export async function createPrescription(
  data: PrescriptionCreate,
): Promise<Prescription> {
  return apiClient.post("/prescriptions/", data);
}

// =========================
// Notifications
// =========================

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export async function getNotifications(): Promise<Notification[]> {
  return apiClient.get("/notifications/");
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  return apiClient.put(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<{status: string; modified_count: number}> {
  return apiClient.put("/notifications/read-all");
}
