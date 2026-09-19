export type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  mode: "video" | "audio";
  status: "confirmed" | "cancelled";
};

const APPOINTMENTS_KEY = "ruralcare.patient.appointments";

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];

  try {
    const value = window.localStorage.getItem(APPOINTMENTS_KEY);
    return value ? (JSON.parse(value) as Appointment[]) : [];
  } catch {
    return [];
  }
}

export function saveAppointment(appointment: Appointment) {
  const appointments = getAppointments();
  window.localStorage.setItem(
    APPOINTMENTS_KEY,
    JSON.stringify([appointment, ...appointments]),
  );
  window.dispatchEvent(new Event("ruralcare:appointments-changed"));
}

export function cancelAppointment(id: string) {
  const appointments = getAppointments().map((appointment) =>
    appointment.id === id ? { ...appointment, status: "cancelled" as const } : appointment,
  );
  window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
  window.dispatchEvent(new Event("ruralcare:appointments-changed"));
}
