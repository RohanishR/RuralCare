import Cookies from "js-cookie";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

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
  appointment_date?: string;
  reason?: string;
}

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
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.detail || `API Error: ${response.status}`,
        );
      }

      return response.json();
    } catch (error) {
      console.error("API Client Error:", error);
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
    data?: any,
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
    data?: any,
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
    data?: any,
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
    data: Omit<
      Doctor,
      "id" | "user_id" | "created_at" | "updated_at"
    >,
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
  patient_id: string;
  appointment_id?: string | null;
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
  patient_id: string;
  appointment_id?: string | null;
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