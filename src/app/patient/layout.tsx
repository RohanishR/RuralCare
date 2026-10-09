import { PortalShell } from "@/components/PortalShell";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="patient">{children}</PortalShell>;
}
