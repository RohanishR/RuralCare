export type AvailabilitySlot = { enabled: boolean; start?: string | null; end?: string | null };
export type Availability = Record<string, AvailabilitySlot>;
export type Doctor = {
  id: string; user_id: string; name: string; specialization: string; qualification: string;
  registration_number: string; experience: number; languages: string[]; consultation_fee: number;
  location: string; about?: string | null; availability: Availability; profile_image?: string | null;
  verification_status: "pending" | "approved" | "rejected"; created_at: string; updated_at: string;
};
export const WEEKDAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
export function availabilitySummary(availability: Availability) {
  const entries = WEEKDAYS.filter((day) => availability?.[day]?.enabled);
  if (!entries.length) return "Availability not configured";
  const first = entries[0]; const slot = availability[first];
  return `${first.charAt(0).toUpperCase() + first.slice(1)} ${slot.start}–${slot.end}${entries.length > 1 ? ` +${entries.length - 1} days` : ""}`;
}
