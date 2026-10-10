import Cookies from "js-cookie";

export const getApiUrl = () => {
  // Server-side fetching using Vercel internal service bindings
  if (typeof window === "undefined" && process.env.BACKEND_URL) {
    return `${process.env.BACKEND_URL.replace(/\/$/, "")}/api/v1`;
  }
  // On Vercel, /api/v1 is routed to the backend service. Explicit URLs also work.
  return (process.env.NEXT_PUBLIC_API_URL || "/api/v1").replace(/\/$/, "");
};

export class ApiError extends Error {
  constructor(message: string, public status: number, public requestId?: string) {
    super(message);
    this.name = "ApiError";
  }
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "patient" | "doctor" | "admin";
  auth_provider: string;
  profile_image?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export function responseError(status: number, detail: unknown, requestId?: string): ApiError {
  let message: string;
  if (status === 404) message = "The account service could not be found. Please contact support.";
  else if (status === 422) {
    const errors = Array.isArray(detail) ? detail : [];
    const fields = [...new Set(errors.flatMap(item => {
      const field = item && typeof item === "object" && Array.isArray(item.loc) ? item.loc.at(-1) : null;
      return typeof field === "string" && ["name", "email", "password", "role"].includes(field) ? [field] : [];
    }))];
    message = fields.length ? `Please check your ${fields.join(", ")}. Use a valid email and a password of 12–128 characters.` : "Please check the information entered and try again.";
  } else if (status === 503) message = "The database or account service is temporarily unavailable. Please try again shortly.";
  else if (status >= 500) message = "The service could not complete this request. Please try again or contact support.";
  else message = typeof detail === "string" ? detail : `Request failed (${status}).`;
  const reference = requestId && /^[a-zA-Z0-9_-]{1,80}$/.test(requestId) ? requestId : undefined;
  return new ApiError(reference ? `${message} Reference: ${reference}` : message, status, reference);
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
      const response = await fetch(`${getApiUrl()}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const detail: unknown = errorData?.detail;
        throw responseError(response.status, detail, response.headers.get("X-Request-ID") || errorData?.request_id);
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

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: email, password }).toString(),
    });
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
