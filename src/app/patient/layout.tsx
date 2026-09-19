"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { href: "/patient/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/find-doctor", icon: "person_search", label: "Find Doctors" },
    {
      href: "/patient/appointments",
      icon: "calendar_today",
      label: "Appointments",
    },
    {
      href: "/patient/records",
      icon: "medical_information",
      label: "Medical Records",
    },
    {
      href: "/patient/prescriptions",
      icon: "prescriptions",
      label: "Prescriptions",
    },
    { href: "/patient/profile", icon: "settings", label: "Profile Settings" },
  ];

  return (
    <div className="bg-background text-on-surface font-body-md antialiased min-h-screen flex flex-col md:flex-row">
      {/* SIDE NAVIGATION */}
      <aside className="w-full md:w-64 bg-surface-container-low border-r border-outline-variant shrink-0 flex flex-col justify-between md:h-screen md:sticky md:top-0 shadow-sm z-30">
        <div className="p-4 flex flex-col gap-4">
          <div className="px-2 py-2 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                alt="RuralCare Logo"
                className="h-9 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1V0FQI2eM9nOW5WhwpDD5OHYSrXqvGhrjjMtRhjO4H7fLmjxdXGUtL_8Hv-A3LPlDq7Ij01rhaSR5Qb1fA1qf-sIYQXJtRk8ZoxBo--mNEKeQ9CqgG2CzKAMNMXennLRUvKyAPU_fdISY2Rmk2_CM35LATG3ZqlJ8_dUkorKQNdC6T3OArF9OHNntweQtqTLqGmTcTNN8aFlJjSLx9pnwOBbuXIS-eqDJb9BeloJT04mgXYwHRgu7EzUMg"
              />
            </Link>
            <span className="md:hidden flex items-center p-2 text-on-surface-variant hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined">menu</span>
            </span>
          </div>

          <nav className="flex flex-col gap-1.5 mt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-secondary-container text-on-secondary-container font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? "text-primary" : ""}`}
                    style={
                      isActive ? { fontVariationSettings: "'FILL' 1" } : {}
                    }
                  >
                    {item.icon}
                  </span>
                  <span className="font-label-md text-label-md">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-outline-variant flex flex-col gap-3 bg-surface-container-low">
          <a
            className="w-full min-h-12 bg-error hover:bg-error-container text-white hover:text-on-error-container font-label-lg text-label-lg flex items-center justify-center gap-2 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-error-container"
            href="tel:112"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              e911_emergency
            </span>
            <span>Emergency Call</span>
          </a>

          <Link href="/patient/profile">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors mt-2">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-secondary-container text-primary font-bold flex items-center justify-center shrink-0">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col truncate text-left">
                  <span className="font-label-md text-label-md text-on-surface truncate">
                    {user?.name || "Patient"}
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    Self
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline shrink-0">
                unfold_more
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-between pt-1 px-1 text-on-surface-variant font-label-sm text-label-sm">
            <a
              className="hover:text-primary flex items-center gap-1"
              href="#help"
            >
              <span className="material-symbols-outlined text-sm">help</span>{" "}
              Help
            </a>
            <button
              onClick={logout}
              className="hover:text-error flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">logout</span>{" "}
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN APPLICATION CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto">
        {/* Top Bar Component */}
        <header className="sticky top-0 z-20 bg-surface-container-lowest border-b border-outline-variant px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          <div className="relative flex-1 max-w-lg hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">search</span>
            </div>
            <input
              className="w-full pl-10 pr-4 py-2.5 h-12 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Search consultations, doctors, records..."
              type="text"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 shrink-0 ml-auto">
            <div className="relative inline-flex items-center bg-surface-container-low border border-outline-variant rounded-lg p-1">
              <button className="px-2.5 py-1 text-xs font-label-sm rounded bg-surface-container-lowest text-primary shadow-sm font-bold transition-all">
                EN
              </button>
              <button className="px-2.5 py-1 text-xs font-label-sm rounded text-on-surface-variant hover:text-on-surface transition-all">
                हिन्दी
              </button>
            </div>
            <button className="relative w-11 h-11 flex items-center justify-center rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
