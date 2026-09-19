"use client";

import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  return (
    <>
      {/* Extracted from RuralCare_-_Landing_Page_72c00466a494458089af7d824645971f.html */}

      {/*  TOP EMERGENCY BANNER / BANDWIDTH STATUS  */}
      <aside className="bg-primary text-on-primary text-label-sm font-label-sm py-2 px-4 flex items-center justify-between border-b border-primary-container z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-fixed"></span>
            </span>
            <span className="font-medium">
              Telehealth Bandwidth Optimizer: Ultra-Lite 2G/3G Mode Ready
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-on-primary-container">
              Need Immediate Trauma Support?
            </span>
            <span className="font-bold flex items-center gap-1 bg-surface-container-lowest/10 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[16px]">
                call
              </span>{" "}
              Dial 112 or 1800-RURAL-CARE
            </span>
          </div>
        </div>
      </aside>
      {/*  TOP BAR (SHARED COMPONENT: TopNavBar)  */}
      <header className="sticky top-0 z-50 bg-surface shadow-sm border-b border-outline-variant transition-all duration-200 ease-in-out">
        <div className="w-full px-6 py-3 max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/*  Brand Logo Anchor  */}
          <a
            aria-label="RuralCare Home"
            className="flex items-center gap-2 group shrink-0"
            href="#home"
          >
            <img
              alt="RuralCare Logo"
              className="h-10 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1V0FQI2eM9nOW5WhwpDD5OHYSrXqvGhrjjMtRhjO4H7fLmjxdXGUtL_8Hv-A3LPlDq7Ij01rhaSR5Qb1fA1qf-sIYQXJtRk8ZoxBo--mNEKeQ9CqgG2CzKAMNMXennLRUvKyAPU_fdISY2Rmk2_CM35LATG3ZqlJ8_dUkorKQNdC6T3OArF9OHNntweQtqTLqGmTcTNN8aFlJjSLx9pnwOBbuXIS-eqDJb9BeloJT04mgXYwHRgu7EzUMg"
            />
          </a>
          {/*  Desktop Navigation Links  */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 lg:gap-8"
          >
            <a
              className="text-primary font-bold border-b-2 border-primary pb-1 font-label-lg text-label-lg transition-all duration-200 ease-in-out"
              href="#home"
            >
              Home
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg hover:bg-surface-container px-2 py-1 rounded"
              href="#how-it-works"
            >
              How It Works
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg hover:bg-surface-container px-2 py-1 rounded"
              href="#patients"
            >
              For Patients
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg hover:bg-surface-container px-2 py-1 rounded"
              href="#doctors"
            >
              For Doctors
            </a>
            <a
              className="text-on-surface-variant hover:text-primary transition-colors font-label-lg text-label-lg hover:bg-surface-container px-2 py-1 rounded"
              href="#about"
            >
              About
            </a>
          </nav>
          {/*  Right Action Cluster: Language, Login, CTA  */}
          <div className="flex items-center gap-3">
            {/*  Language Selector  */}
            <div className="relative inline-flex items-center">
              <label className="sr-only" htmlFor="lang-select">
                Choose Language
              </label>
              <span className="material-symbols-outlined text-primary absolute left-2 pointer-events-none text-[20px]">
                translate
              </span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="pl-8 pr-7 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-on-surface text-label-sm font-label-sm hover:bg-surface-container focus:ring-2 focus:ring-primary focus:outline-none appearance-none cursor-pointer"
                id="lang-select"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bn">বাংলা (Bengali)</option>
              </select>
              <span className="material-symbols-outlined text-on-surface-variant absolute right-1.5 pointer-events-none text-[18px]">
                expand_more
              </span>
            </div>
            {/*  Login Button  */}
            <Link
              className="hidden sm:inline-flex items-center justify-center min-h-11 px-4 py-2 text-primary hover:bg-surface-container font-label-lg text-label-lg rounded-lg transition-colors duration-150"
              href="/login"
            >
              Login
            </Link>
            {/*  Primary CTA: Get Started  */}
            <Link
              className="inline-flex items-center justify-center min-h-11 px-5 py-2.5 bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg rounded-lg shadow-sm transition-all duration-200 ease-in-out"
              href="/register"
            >
              Get Started
            </Link>
            {/*  Mobile Menu Trigger  */}
            <button
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 text-on-surface hover:bg-surface-container rounded-lg"
              type="button"
              onClick={() => setMobileMenuOpen((isOpen) => !isOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              <span className="material-symbols-outlined text-[26px]">
                menu
              </span>
            </button>
          </div>
        </div>
        {/*  Mobile Navigation Drawer (Toggled)  */}
        <div
          className={`${mobileMenuOpen ? "block" : "hidden"} md:hidden border-t border-outline-variant bg-surface px-6 py-4 space-y-3`}
          id="mobile-drawer"
        >
          <a
            className="block py-2 text-primary font-bold font-label-lg text-label-lg"
            href="#home"
          >
            Home
          </a>
          <a
            className="block py-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg"
            href="#how-it-works"
          >
            How It Works
          </a>
          <a
            className="block py-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg"
            href="#patients"
          >
            For Patients
          </a>
          <a
            className="block py-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg"
            href="#doctors"
          >
            For Doctors
          </a>
          <a
            className="block py-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg"
            href="#about"
          >
            About
          </a>
          <div className="pt-3 border-t border-outline-variant flex flex-col gap-2">
            <Link
              className="w-full text-center py-2.5 border border-outline-variant text-primary rounded-lg font-label-lg text-label-lg"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="w-full text-center py-2.5 bg-primary text-on-primary rounded-lg font-label-lg text-label-lg"
              href="/register"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      {/*  MAIN CANVAS  */}
      <main className="grow">
        {/*  HERO SECTION  */}
        <section
          className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-linear-to-b from-surface via-surface-container-low to-background"
          id="home"
        >
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/*  Left Hero Content (7 cols)  */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm shadow-sm border border-secondary-fixed">
                <span className="material-symbols-outlined text-[18px]">
                  verified
                </span>
                <span>
                  Accredited Remote Clinical Network • 28 Indian States
                </span>
              </div>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg font-bold text-on-surface tracking-tight text-balance">
                Quality healthcare, wherever you are.
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                Connect with qualified doctors from anywhere, get medical
                guidance remotely, and keep your healthcare records in one
                place.
              </p>
              {/*  CTAs  */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a
                  className="min-h-13.5 px-8 py-3.5 bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all duration-200"
                  href="/find-doctor"
                >
                  <span className="material-symbols-outlined text-[22px]">
                    search
                  </span>
                  <span>Find a Doctor</span>
                </a>
                <a
                  className="min-h-13.5 px-6 py-3.5 bg-secondary-container text-on-secondary-fixed-variant hover:bg-secondary-fixed font-label-lg text-label-lg rounded-lg border border-secondary-fixed-dim flex items-center justify-center gap-2.5 transition-colors duration-150"
                  href="#how-it-works"
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    data-weight="fill"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    play_circle
                  </span>
                  <span>How It Works</span>
                </a>
              </div>
              {/*  Trust Micro-Badges  */}
              <div className="pt-6 border-t border-outline-variant/60 flex flex-wrap items-center gap-6 text-on-surface-variant text-label-sm font-label-sm">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">
                    check_circle
                  </span>
                  <span>ABHA / Ayushman Compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">
                    check_circle
                  </span>
                  <span>Zero-Data Audio Fallback</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-tertiary text-[18px]">
                    check_circle
                  </span>
                  <span>Free First Consultation</span>
                </div>
              </div>
            </div>
            {/*  Right Hero Visual / Interactive Telemedicine Simulation Showcase (5 cols)  */}
            <div className="lg:col-span-5 relative">
              {/*  Glassmorphism Container with Subtle Ambient Depth  */}
              <div className="relative bg-surface-container-lowest border border-outline-variant/80 rounded-2xl shadow-xl overflow-hidden p-4 md:p-5">
                {/*  Telemedicine Video Window Simulation  */}
                <div className="relative rounded-xl overflow-hidden bg-inverse-surface aspect-4/3 flex items-end p-4">
                  <img
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    data-alt="A warm, compassionate Indian female doctor wearing a white lab coat with a stethoscope around her neck smiling during an active telemedicine video consultation with a rural family in bright soft morning sunlight. The composition is clean, modern, and clinical with tranquil teal medical accents."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLjVuivTs3AMly0ZYlGikleYZdv5lWXmzEnO7-0qxy6c_rDmFwnUz1lvXjD2rTMmPNe9lNbA--ThDjs9Is_2P6kvUuVVhp8DlcLC1sEabALO2Sl0kdihDctitK_W-CAnrn5gRZ9hseZIz_RMYYTYeKjA9PApqUXeyKCCiM2Q-O_v4lQjiFom7L0t4To5ioTnuNTZzpiARq4K4lkSSmx4EIQ9_QOnVJdbhdxsuTakzWPYTWkk1XQUpo"
                  />
                  {/*  Dark gradient overlay for contrast  */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                  {/*  Top Telemedicine Overlays  */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                    {/*  Connectivity Chip  */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-on-primary text-label-sm font-label-sm border border-white/20">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Strong Signal • Low-Bandwidth Mode Active</span>
                    </div>
                    {/*  Call Duration  */}
                    <div className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white/90 text-label-sm font-label-sm">
                      12:45
                    </div>
                  </div>
                  {/*  Doctor Info Banner on Video  */}
                  <div className="relative z-10 w-full flex items-center justify-between text-white">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-title-lg text-title-lg font-bold">
                          Dr. Priya Sharma, MD
                        </h2>
                        <span
                          className="material-symbols-outlined text-emerald-400 text-[18px]"
                          data-weight="fill"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                      </div>
                      <p className="text-body-sm text-gray-200">
                        General Medicine • AIIMS New Delhi
                      </p>
                    </div>
                    {/*  Patient Mini Self-View PIP  */}
                    <div className="h-14 w-14 rounded-lg border-2 border-white/80 overflow-hidden shadow-lg bg-surface-variant shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        data-alt="A rural Indian farmer wearing a neat khadi shirt smiling warmly as he holds a tablet computer outdoors under a shaded veranda, participating in an online medical appointment. High key, warm natural lighting."
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuByIdc4v8QYSPbDEHwQm7cqgtKWIHrLIAJ5jzxrQJEhNzt6EqnmxifyX_bnAifsxU9g7cUL2kamsf7c7_uJW69Q-QIAYjX14U5T7wInzFyFVQbONOegJj7RSx6npKoqejgBs7P4fhz8j1HzKz5S2xvb2PZbj6rL9W6Uy2LASDzsWzVjMM0fWQjWAew1RyTnMY2x0VTjMeHMwIfw49ahEGPhRD4KKkRTOOEwusBs-zVWc7WpH_HoLuul"
                      />
                    </div>
                  </div>
                </div>
                {/*  Real-time Vital Monitor Widget Grid  */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-error-container text-error flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        favorite
                      </span>
                    </div>
                    <div>
                      <div className="text-label-sm font-label-sm text-on-surface-variant">
                        Heart Rate
                      </div>
                      <div className="text-headline-sm font-headline-sm font-bold text-on-surface">
                        72{" "}
                        <span className="text-label-sm font-normal text-on-surface-variant">
                          bpm
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        vital_signs
                      </span>
                    </div>
                    <div>
                      <div className="text-label-sm font-label-sm text-on-surface-variant">
                        Blood Pressure
                      </div>
                      <div className="text-headline-sm font-headline-sm font-bold text-on-surface">
                        120/80{" "}
                        <span className="text-label-sm font-normal text-on-surface-variant">
                          mmHg
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/*  Direct Dial / Consultation Actions  */}
                <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl bg-secondary-fixed/40 border border-secondary-fixed text-on-secondary-fixed-variant text-label-sm font-label-sm">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      mic
                    </span>
                    <span>
                      Real-time Hindi &amp; English translation running
                    </span>
                  </div>
                  <span className="text-primary font-bold">Secure HD</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  KEY BENEFITS SECTION  */}
        <section className="py-16 bg-surface" id="patients">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <div className="inline-block text-primary font-label-md text-label-md font-bold tracking-wider uppercase">
                Engineered for Dignity &amp; Access
              </div>
              <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface">
                Bridging the clinical divide for remote communities
              </h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant">
                Thoughtfully built to perform effortlessly across unstable
                cellular towers, feature devices, and local community common
                service centres.
              </p>
            </div>
            {/*  4 Cards Bento Layout  */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/*  Benefit 1  */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-[28px]">
                      video_chat
                    </span>
                  </div>
                  <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                    Consult Doctors Remotely
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    Video, audio, or low-bandwidth text consultations from your
                    home or local health kiosk without travel expense.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center text-primary font-label-sm text-label-sm font-bold gap-1">
                  <span>Voice &amp; Video Ready</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </div>
              </div>
              {/*  Benefit 2  */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-[28px]">
                      translate
                    </span>
                  </div>
                  <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                    Multilingual Support
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    Speak to certified doctors in your native tongue (English,
                    Hindi, Tamil, Bengali, Telugu, and Marathi) without language
                    barriers.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center text-primary font-label-sm text-label-sm font-bold gap-1">
                  <span>6 Regional Dialects</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </div>
              </div>
              {/*  Benefit 3  */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-[28px]">
                      medical_information
                    </span>
                  </div>
                  <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                    Secure Medical Records
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    Access your health history, lab tests, digital
                    prescriptions, and clinical summaries anytime on any device.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center text-primary font-label-sm text-label-sm font-bold gap-1">
                  <span>ABHA ID Linked</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </div>
              </div>
              {/*  Benefit 4  */}
              <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/70 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-12 w-12 rounded-xl bg-surface-container text-primary flex items-center justify-center mb-5">
                    <span className="material-symbols-outlined text-[28px]">
                      calendar_month
                    </span>
                  </div>
                  <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                    Easy Appointment Booking
                  </h3>
                  <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                    Instant slot selection with upfront transparent pricing,
                    automated SMS reminders, and zero hidden hospital booking
                    surcharges.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-outline-variant/40 flex items-center text-primary font-label-sm text-label-sm font-bold gap-1">
                  <span>Zero Wait Times</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  HOW IT WORKS SECTION  */}
        <section
          className="py-16 lg:py-24 bg-surface-container-low border-y border-outline-variant/50"
          id="how-it-works"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
              <div>
                <span className="text-primary font-label-md text-label-md font-bold uppercase">
                  Simple 4-Step Process
                </span>
                <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface mt-1">
                  Healthcare in four easy steps
                </h2>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant max-w-md">
                No complex installations or tech hurdles. Works straight from
                WhatsApp, web browser, or your local village kiosk.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/*  Step 1  */}
              <div className="relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="h-9 w-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-label-md font-label-md">
                    1
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant/60">
                    person_add
                  </span>
                </div>
                <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                  Create your profile
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Simple setup with basic phone number or ABHA ID. Verified
                  instantly via OTP without needing an email address.
                </p>
              </div>
              {/*  Step 2  */}
              <div className="relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="h-9 w-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-label-md font-label-md">
                    2
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant/60">
                    smart_toy
                  </span>
                </div>
                <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                  Describe your symptoms
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Use our friendly AI symptom helper in plain words or voice
                  notes in your local tongue to categorize triage level.
                </p>
              </div>
              {/*  Step 3  */}
              <div className="relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="h-9 w-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-label-md font-label-md">
                    3
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant/60">
                    stethoscope
                  </span>
                </div>
                <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                  Choose a doctor
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Filter by specialty, language, fee, and real-time
                  availability. View verified peer reviews and credentials.
                </p>
              </div>
              {/*  Step 4  */}
              <div className="relative bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-sm hover:border-primary transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <span className="h-9 w-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-label-md font-label-md">
                    4
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant/60">
                    prescriptions
                  </span>
                </div>
                <h3 className="text-title-lg font-title-lg font-bold text-on-surface mb-2">
                  Consult remotely
                </h3>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Seamless WebRTC video or low-data audio call. Receive a
                  digitally signed, authentic prescription directly to SMS.
                </p>
              </div>
            </div>
            {/*  Step Demonstration Card / Flow Preview  */}
            <div className="mt-12 bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="inline-flex items-center gap-1.5 text-tertiary font-bold text-label-sm font-label-sm">
                  <span className="material-symbols-outlined text-[18px]">
                    signal_cellular_alt_1_bar
                  </span>
                  Optimized for Low Connectivity
                </span>
                <h3 className="text-headline-md font-headline-md font-bold text-on-surface">
                  Works where ordinary video apps fail
                </h3>
                <p className="text-body-md font-body-md text-on-surface-variant">
                  Our dynamic data pipeline downgrades frame-rates seamlessly to
                  ensure clinical voice audio never cuts out during critical
                  medical consultation.
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <a
                  className="w-full sm:w-auto min-h-12 px-6 py-3 bg-secondary-container text-on-secondary-fixed-variant hover:bg-secondary-fixed font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 text-center transition-colors"
                  href="#how-it-works"
                >
                  <span>View Interactive Demo</span>
                  <span className="material-symbols-outlined text-[20px]">
                    chevron_right
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
        {/*  WHY RURALCARE? SECTION  */}
        <section className="py-16 lg:py-24 bg-surface" id="about">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/*  Left Column: Key Pillars & Interactive Feature Comparison  */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-block text-primary font-label-md text-label-md font-bold uppercase">
                  Why RuralCare?
                </div>
                <h2 className="text-headline-lg font-headline-lg font-bold text-on-surface leading-tight">
                  Clinical standard care engineered for geographical equity
                </h2>
                <p className="text-body-lg font-body-lg text-on-surface-variant">
                  Traditional hospitals require hours of perilous travel, missed
                  daily wages, and overcrowded waiting corridors. RuralCare
                  turns any smartphone or village computer into a direct line to
                  top clinical doctors.
                </p>
                {/*  Feature Bullet List with Rich Badges  */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <div className="p-2 rounded-lg bg-primary-fixed text-primary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        verified_user
                      </span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        500+ Verified Specialist &amp; General Doctors
                      </h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                        Every doctor is accredited, background-verified with
                        state medical councils, and trained in empathetic rural
                        telehealth bedside manner.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <div className="p-2 rounded-lg bg-secondary-container text-secondary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        network_ping
                      </span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        Optimized for 2G/3G Low-Connectivity Networks
                      </h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                        Proprietary dynamic stream degradation buffers clinical
                        notes and transmits audio with under 25kbps bandwidth
                        consumption.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <div className="p-2 rounded-lg bg-tertiary-fixed text-tertiary shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        document_scanner
                      </span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        Digital Verifiable Prescriptions
                      </h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                        Instantly downloadable with tamper-proof QR code
                        accepted at all authorized Jan Aushadhi and rural
                        pharmaceutical pharmacies.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/60">
                    <div className="p-2 rounded-lg bg-surface-container text-on-surface-variant shrink-0">
                      <span className="material-symbols-outlined text-[24px]">
                        shield
                      </span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg font-bold text-on-surface">
                        100% ABDM &amp; HIPAA Compliant Security
                      </h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">
                        End-to-end encrypted consultations with strict patient
                        data privacy standards and lifetime encrypted medical
                        history storage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/*  Right Column: Interactive Comparison Matrix  */}
              <div className="lg:col-span-6">
                <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 shadow-sm">
                  <h3 className="text-headline-sm font-headline-sm font-bold text-on-surface mb-6 flex items-center justify-between">
                    <span>Direct Comparison</span>
                    <span className="text-label-sm font-label-sm px-2.5 py-1 rounded bg-secondary-container text-on-secondary-container">
                      Standard vs RuralCare
                    </span>
                  </h3>
                  <div className="space-y-4 divide-y divide-outline-variant/50">
                    <div className="pt-4 first:pt-0">
                      <div className="text-label-md font-label-md font-bold text-on-surface mb-2">
                        Travel &amp; Waiting Overhead
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-body-sm font-body-sm">
                        <div className="p-3 bg-error-container/30 border border-error-container rounded-lg text-error">
                          <div className="font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              close
                            </span>{" "}
                            Traditional Clinic
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            4–6 hours bus transit, lost day’s wages, crowded
                            waiting room.
                          </p>
                        </div>
                        <div className="p-3 bg-secondary-container/40 border border-secondary-fixed rounded-lg text-on-secondary-fixed-variant">
                          <div className="font-bold flex items-center gap-1 text-primary">
                            <span className="material-symbols-outlined text-[16px]">
                              check
                            </span>{" "}
                            RuralCare
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            0 minutes commute. Connect in under 3 minutes right
                            from home.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="text-label-md font-label-md font-bold text-on-surface mb-2">
                        Consultation Cost &amp; Transparency
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-body-sm font-body-sm">
                        <div className="p-3 bg-error-container/30 border border-error-container rounded-lg text-error">
                          <div className="font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              close
                            </span>{" "}
                            Private City Hospital
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            ₹800–₹1,500 consultation fee + diagnostic markup.
                          </p>
                        </div>
                        <div className="p-3 bg-secondary-container/40 border border-secondary-fixed rounded-lg text-on-secondary-fixed-variant">
                          <div className="font-bold flex items-center gap-1 text-primary">
                            <span className="material-symbols-outlined text-[16px]">
                              check
                            </span>{" "}
                            RuralCare
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Subsidized from ₹99 or free via government welfare
                            programs.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <div className="text-label-md font-label-md font-bold text-on-surface mb-2">
                        Record Portability &amp; Follow-ups
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-body-sm font-body-sm">
                        <div className="p-3 bg-error-container/30 border border-error-container rounded-lg text-error">
                          <div className="font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">
                              close
                            </span>{" "}
                            Physical Paper Files
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Easily lost, water damaged, or forgotten during
                            emergency visits.
                          </p>
                        </div>
                        <div className="p-3 bg-secondary-container/40 border border-secondary-fixed rounded-lg text-on-secondary-fixed-variant">
                          <div className="font-bold flex items-center gap-1 text-primary">
                            <span className="material-symbols-outlined text-[16px]">
                              check
                            </span>{" "}
                            RuralCare
                          </div>
                          <p className="text-xs text-on-surface-variant mt-1">
                            Permanent ABHA cloud storage, linked to patient's
                            mobile number.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/*  Doctor Enrollment Quick Anchor  */}
                  <div
                    className="mt-8 p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-between gap-4"
                    id="doctors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[28px]">
                        medical_services
                      </span>
                      <div>
                        <div className="font-title-lg text-title-lg font-bold text-on-surface">
                          Are you a practicing physician?
                        </div>
                        <p className="text-body-sm font-body-sm text-on-surface-variant">
                          Give back with flexible remote telehealth shifts.
                        </p>
                      </div>
                    </div>
                    <a
                      className="min-h-11 px-4 py-2 bg-primary text-on-primary hover:bg-primary-container rounded-lg font-label-md text-label-md shrink-0 transition-colors"
                      href="/register"
                    >
                      Join Network
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*  FINAL CALL TO ACTION BANNER  */}
        <section className="py-16 bg-linear-to-r from-primary via-primary-container to-secondary text-on-primary relative overflow-hidden">
          {/*  Ambient Hydro Graphic Detail  */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-primary-fixed/10 blur-3xl pointer-events-none"></div>
          <div className="max-w-5xl mx-auto px-6 text-center space-y-6 relative z-10">
            {/*  Toll-free Badge  */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-lowest/15 backdrop-blur-md border border-white/20 text-on-primary font-label-md text-label-md shadow-sm">
              <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">
                support_agent
              </span>
              <span>
                Toll-Free Health Assistance: 1800-RURAL-CARE (24x7 Available)
              </span>
            </div>
            <h2 className="text-display-lg-mobile md:text-headline-lg font-bold font-headline-lg tracking-tight text-white">
              Start your healthcare journey today.
            </h2>
            <p className="text-body-lg font-body-lg text-primary-fixed max-w-2xl mx-auto leading-relaxed">
              Quality medical consultations are now just a call away. No long
              journeys, no crowded waiting rooms, no clinical uncertainty.
            </p>
            {/*  Action Buttons  */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                className="w-full sm:w-auto min-h-13.5 px-8 py-3.5 bg-surface-container-lowest text-primary hover:bg-surface-container-low font-label-lg text-label-lg rounded-lg shadow-lg hover:shadow-xl font-bold transition-all duration-200 flex items-center justify-center gap-2"
                href="/find-doctor"
              >
                <span className="material-symbols-outlined text-[22px]">
                  search
                </span>
                <span>Find a Doctor Now</span>
              </a>
              <a
                className="w-full sm:w-auto min-h-13.5 px-8 py-3.5 bg-transparent border-2 border-white text-white hover:bg-white/10 font-label-lg text-label-lg rounded-lg font-bold transition-colors duration-150 flex items-center justify-center gap-2"
                href="/register"
              >
                <span className="material-symbols-outlined text-[22px]">
                  stethoscope
                </span>
                <span>Register as Doctor</span>
              </a>
            </div>
            <p className="text-label-sm font-label-sm text-primary-fixed/80 pt-2">
              Average connection time under 90 seconds • Instant Hindi, Tamil,
              and Bengali routing
            </p>
          </div>
        </section>
      </main>
      {/*  EMERGENCY 112 CRISIS STRIP  */}
      <div className="bg-error text-on-error py-2.5 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center text-label-sm font-label-sm">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>
            If you are experiencing a life-threatening medical crisis, severe
            chest pain, or trauma, please immediately dial <strong>112</strong>{" "}
            or visit your nearest emergency health center.
          </span>
        </div>
      </div>
      {/*  FOOTER (SHARED COMPONENT: Footer)  */}
      <footer className="bg-surface-container text-on-surface-variant border-t border-outline-variant">
        <div className="w-full py-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/*  Brand & Mission Info  */}
          <div className="space-y-3 max-w-md text-center md:text-left">
            <a className="inline-block" href="#">
              <img
                alt="RuralCare Logo"
                className="h-9 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1V0FQI2eM9nOW5WhwpDD5OHYSrXqvGhrjjMtRhjO4H7fLmjxdXGUtL_8Hv-A3LPlDq7Ij01rhaSR5Qb1fA1qf-sIYQXJtRk8ZoxBo--mNEKeQ9CqgG2CzKAMNMXennLRUvKyAPU_fdISY2Rmk2_CM35LATG3ZqlJ8_dUkorKQNdC6T3OArF9OHNntweQtqTLqGmTcTNN8aFlJjSLx9pnwOBbuXIS-eqDJb9BeloJT04mgXYwHRgu7EzUMg"
              />
            </a>
            <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
              © 2024 RuralCare Health. Accessible, dignified healthcare for all
              communities. If you are experiencing a life-threatening medical
              crisis, please immediately dial 112 or visit your nearest
              emergency health center.
            </p>
          </div>
          {/*  Legal & Protocol Links  */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3 text-label-sm font-label-sm">
            <a
              className="text-on-surface-variant hover:text-primary hover:underline transition-colors duration-150"
              href="#privacy"
            >
              Privacy Policy
            </a>
            <a
              className="text-on-surface-variant hover:text-primary hover:underline transition-colors duration-150"
              href="#terms"
            >
              Terms of Service
            </a>
            <a
              className="text-on-surface-variant hover:text-primary hover:underline transition-colors duration-150"
              href="#accessibility"
            >
              Accessibility Statement
            </a>
            <a
              className="text-on-surface-variant hover:text-primary hover:underline transition-colors duration-150"
              href="#protocols"
            >
              Clinical Protocols
            </a>
            <a
              className="text-on-surface-variant hover:text-primary hover:underline transition-colors duration-150"
              href="#support"
            >
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
