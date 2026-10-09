import { PortalShell } from "@/components/PortalShell";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="doctor">{children}</PortalShell>;
}
