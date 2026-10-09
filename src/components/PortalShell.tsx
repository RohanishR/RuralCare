"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, CalendarDays, FileText, Pill, UserRound, Search, Languages, LogOut, Menu, X, HelpCircle, ClipboardList } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import NotificationBell from "@/components/NotificationBell";

export function PortalShell({ children, role }: { children: ReactNode; role: "patient" | "doctor" }) {
  const { user, logout } = useAuth();
  const path = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = role === "patient" ? [
    { href: "/patient/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/patient/find-doctor", label: "Find a doctor", icon: Search },
    { href: "/patient/appointments", label: "Appointments", icon: CalendarDays },
    { href: "/patient/symptom-assistant", label: "Symptom assistant", icon: ClipboardList },
    { href: "/patient/medical-records", label: "Medical records", icon: FileText },
    { href: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
    { href: "/patient/profile", label: "My profile", icon: UserRound },
  ] : [
    { href: "/doctor/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/doctor/appointments", label: "Appointments", icon: CalendarDays },
    { href: "/doctor/profile", label: "My profile", icon: UserRound },
  ];
  const current = links.find(link => link.href === path)?.label || "Your care";
  return (
    <div className="portal-shell">
      <a className="skip-link" href="#portal-content">Skip to content</a>
      <aside className="portal-sidebar">
        <div className="flex items-center justify-between">
          <Link className="brand" href="/" aria-label="RuralCare home"><span className="brand-mark"><Activity size={23} /></span>RuralCare<span className="brand-dot">.</span></Link>
          <button type="button" className="rounded-lg p-2 md:hidden" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="portal-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
        <div id="portal-navigation" className={`${menuOpen ? "flex" : "hidden"} flex-1 flex-col md:flex`}>
          <p className="px-4 text-[10px] font-semibold uppercase tracking-[.16em] text-on-surface-variant">{role} workspace</p>
          <nav aria-label="Workspace">
            {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={path === href ? "page" : undefined} onClick={() => setMenuOpen(false)}><Icon size={18} aria-hidden="true" />{label}</Link>)}
          </nav>
          <nav aria-label="Support" className="mt-auto pt-8">
            <Link href="/translation" onClick={() => setMenuOpen(false)}><Languages size={18} />Translation</Link>
            <Link href="/#questions"><HelpCircle size={18} />Help & questions</Link>
          </nav>
          <button type="button" onClick={logout} className="mt-4 flex items-center gap-3 border-t border-outline-variant px-4 pt-5 text-sm text-on-surface-variant"><LogOut size={18} />Log out</button>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="portal-header">
          <div><p className="text-xs text-on-surface-variant">Your RuralCare workspace</p><p className="mt-1 text-sm font-semibold">{current}</p></div>
          <div className="flex items-center gap-4"><NotificationBell /><Link href={`/${role}/profile`} className="flex items-center gap-3" aria-label="Manage your profile"><span className="hidden text-sm font-medium sm:block">{user?.name || "My account"}</span><span className="grid h-10 w-10 place-items-center rounded-full bg-secondary-container font-semibold text-primary">{user?.name?.slice(0, 1).toUpperCase() || <UserRound size={18} />}</span></Link></div>
        </header>
        <div id="portal-content" tabIndex={-1}>{children}</div>
      </div>
    </div>
  );
}

