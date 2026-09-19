"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function PatientDashboard() {
  const { user } = useAuth();

  // Use realistic mock data for now
  const nextAppointment = {
    time: "Tomorrow, 10:30 AM",
    detail: "Follow-up with Dr. Sharma",
  };
  const prescriptions = { count: 2, note: "Refill due in 5 days" };
  const lastConsultation = {
    doctor: "Dr. Priya Sharma",
    note: "3 days ago • General Med",
  };
  const pendingTests = { count: 0, note: "All reports verified" };

  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Good morning, {user?.name?.split(" ")[0] || "Patient"}!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Your healthcare journey, all in one place.
          </p>
        </div>
        <div className="self-start sm:self-center inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-secondary-container text-on-secondary-container border border-secondary-fixed-dim">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-sm text-label-sm font-semibold tracking-wide">
            Low-Bandwidth Mode: Ready
          </span>
          <span className="material-symbols-outlined text-sm">
            network_check
          </span>
        </div>
      </div>

      {/* Health Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next Appointment */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Next Appointment
            </span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">event</span>
            </div>
          </div>
          <div>
            <div className="font-title-lg text-title-lg text-on-surface">
              {nextAppointment.time}
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {nextAppointment.detail}
            </div>
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Active Prescriptions
            </span>
            <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">
                medication
              </span>
            </div>
          </div>
          <div>
            <div className="font-title-lg text-title-lg text-on-surface">
              {prescriptions.count} Medicines
            </div>
            <div className="font-body-sm text-body-sm text-tertiary mt-0.5 font-medium">
              {prescriptions.note}
            </div>
          </div>
        </div>

        {/* Recent Consultation */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Recent Consultation
            </span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">
                clinical_notes
              </span>
            </div>
          </div>
          <div>
            <div className="font-title-lg text-title-lg text-on-surface">
              {lastConsultation.doctor}
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              {lastConsultation.note}
            </div>
          </div>
        </div>

        {/* Pending Tests */}
        <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
              Pending Lab Tests
            </span>
            <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">biotech</span>
            </div>
          </div>
          <div>
            <div className="font-title-lg text-title-lg text-on-surface">
              {pendingTests.count} Pending
            </div>
            <div className="font-body-sm text-body-sm text-tertiary mt-0.5 font-medium">
              {pendingTests.note}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Card */}
      <section className="bg-surface-container-lowest border-2 border-primary-container/30 rounded-xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-primary-fixed shadow-sm"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPhpjoOxOd8sY-MrzPB_JaWKt25xDZ04hEdDOvtaI-QSbfZhkhYp9ya4V3qz-nifenBIJoVtE7bFQT6giD5NDsETZ4ezRauECdLdlZ3-19vdcn0KxgBnj0jrevzXynshDoh9_bQ_M14mxh_2HxVMFpd8A1OKI4ooQhRz8fcAl4Lugi17oE-nnsLiNBq39JyrBSYzpZMQ7NwOybTqgkd_hHYILBGtZc44ujZWTf-LKJ5jfhW0JrRI1l"
                alt="Doctor"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center text-xs shadow-sm">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified
                </span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="bg-error-container text-on-error-container font-label-sm text-label-sm px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>{" "}
                  In 45 mins
                </span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">
                  • Telehealth Slot
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Dr. Priya Sharma, MD
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                General Medicine — AIIMS New Delhi
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded text-on-surface">
                  <span className="material-symbols-outlined text-base text-primary">
                    videocam
                  </span>
                  Video Call (Optimized for 2G/3G)
                </span>
                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded text-tertiary font-semibold">
                  <span
                    className="material-symbols-outlined text-base text-tertiary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  Camera &amp; Mic tested OK
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-60">
            <button className="min-h-12.5 px-6 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-secondary-container">
              <span className="material-symbols-outlined text-xl">
                video_call
              </span>
              <span>Join Consultation Room</span>
            </button>
          </div>
        </div>
      </section>

      {/* AI Assistant */}
      <section className="bg-linear-to-r from-secondary-container via-surface-container-lowest to-surface-container-lowest border border-secondary-fixed-dim rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-2xl">
              smart_toy
            </span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider mb-1">
              <span>RuralCare Smart Triage</span>
              <span className="text-xs bg-surface-container-highest px-1.5 py-0.5 rounded text-on-surface-variant font-normal">
                Informational triage only
              </span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Need help describing your symptoms?
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Tell our friendly AI assistant how you feel in your native
              language before meeting your doctor. We prepare a concise clinical
              summary for Dr. Sharma.
            </p>
          </div>
        </div>
        <button className="min-h-12 px-5 bg-secondary hover:bg-primary text-on-secondary rounded-lg font-label-lg text-label-lg flex items-center gap-2 shrink-0 transition-colors shadow-sm">
          <span className="material-symbols-outlined">mic</span>
          <span>Describe Symptoms Now</span>
        </button>
      </section>

      {/* Quick Actions */}
      <div className="flex flex-col gap-3">
        <h3 className="font-title-lg text-title-lg text-on-surface">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/find-doctor"
            className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">search</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
              Find a Doctor
            </span>
          </Link>
          <Link
            href="/patient/appointments"
            className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">
                calendar_add_on
              </span>
            </div>
            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
              Book Appointment
            </span>
          </Link>
          <Link
            href="/patient/prescriptions"
            className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">
                receipt_long
              </span>
            </div>
            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
              View Prescriptions
            </span>
          </Link>
          <Link
            href="/patient/profile"
            className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
          >
            <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">person</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
              My Profile
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
