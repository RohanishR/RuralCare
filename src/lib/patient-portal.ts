import { apiClient } from "@/lib/api-client";

export type AppointmentMode = "video" | "audio";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled";

export type Appointment = {
  id: string;
  patient_id: string;
  doctor_id: string;

  doctor_name?: string;
  doctor_specialization?: string;

  appointment_date: string;
  appointment_time: string;

  mode: AppointmentMode;
  reason?: string | null;

  status: AppointmentStatus;

  consultation_fee?: number;

  created_at: string;
  updated_at: string;
};

export type CreateAppointmentRequest = {
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  mode: AppointmentMode;
  reason?: string;
};

export type AppointmentListResponse = {
  appointments: Appointment[];
};

export async function createAppointment(
  data: CreateAppointmentRequest,
): Promise<Appointment> {
  return apiClient.post<Appointment>(
    "/appointments",
    data,
  );
}

export async function getMyAppointments(): Promise<
  Appointment[]
> {
  const response =
    await apiClient.get<AppointmentListResponse>(
      "/appointments/me",
    );

  return response.appointments;
}

export async function getAppointment(
  appointmentId: string,
): Promise<Appointment> {
  return apiClient.get<Appointment>(
    `/appointments/${appointmentId}`,
  );
}

export async function cancelAppointment(
  appointmentId: string,
): Promise<Appointment> {
  return apiClient.put<Appointment>(
    `/appointments/${appointmentId}/cancel`,
    {},
  );
}

export async function completeAppointment(
  appointmentId: string,
): Promise<Appointment> {
  return apiClient.put<Appointment>(
    `/appointments/${appointmentId}/complete`,
    {},
  );
}