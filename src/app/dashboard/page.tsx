const consultations = [
  {
    id: 1,
    initials: "PS",
    doctor: "Dr. Priya Sharma",
    spec: "General Medicine",
    date: "Oct 24, 2024",
    diag: "Acute seasonal bronchitis & mild dehydration. Advised hydration therapy and 5-day antibiotic course.",
    bg: "bg-secondary-container",
  },
  {
    id: 2,
    initials: "AK",
    doctor: "Dr. Anand Kulkarni",
    spec: "Cardiology",
    date: "Sep 12, 2024",
    diag: "Routine annual cardiac evaluation & BP management. Resting ECG normal.",
    bg: "bg-surface-container-high",
  },
  {
    id: 3,
    initials: "MN",
    doctor: "Dr. Meera Nair",
    spec: "Dermatology",
    date: "Aug 05, 2024",
    diag: "Contact dermatitis resolved after topical hydrocortisone regime.",
    bg: "bg-secondary-container",
  },
];
export default function Page() {
  return (
    <>
      {/* Extracted from RuralCare_-_Patient_Dashboard_4aaaf792ab7849e092cd51d3554ea4e1.html */}

      {/*  =========================================================================  */}
      {/*  SIDE NAVIGATION (Derived directly from SideNavBar in Shared Components)     */}
      {/*  =========================================================================  */}
      <aside className="w-full md:w-64 bg-surface-container-low border-r border-outline-variant shrink-0 flex flex-col justify-between md:h-screen md:sticky md:top-0 shadow-sm z-30">
        {/*  Top Branding & Navigation Items  */}
        <div className="p-4 flex flex-col gap-4">
          {/*  Brand Logo Container  */}
          <div className="px-2 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                alt="RuralCare Logo"
                className="h-9 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida/AEtjO1V0FQI2eM9nOW5WhwpDD5OHYSrXqvGhrjjMtRhjO4H7fLmjxdXGUtL_8Hv-A3LPlDq7Ij01rhaSR5Qb1fA1qf-sIYQXJtRk8ZoxBo--mNEKeQ9CqgG2CzKAMNMXennLRUvKyAPU_fdISY2Rmk2_CM35LATG3ZqlJ8_dUkorKQNdC6T3OArF9OHNntweQtqTLqGmTcTNN8aFlJjSLx9pnwOBbuXIS-eqDJb9BeloJT04mgXYwHRgu7EzUMg"
              />
            </div>
            <span className="md:hidden flex items-center p-2 text-on-surface-variant hover:text-primary cursor-pointer">
              <span className="material-symbols-outlined" data-icon="menu">
                menu
              </span>
            </span>
          </div>
          {/*  Navigation Link Stack  */}
          <nav className="flex flex-col gap-1.5 mt-2">
            {/*  Dashboard (Active Tab)  */}
            <a
              className="flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold transition-colors"
              href="#dashboard"
            >
              <span
                className="material-symbols-outlined text-primary"
                data-icon="dashboard"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                dashboard
              </span>
              <span className="font-label-md text-label-md">Dashboard</span>
            </a>
            {/*  Find Doctors  */}
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              href="#find-doctors"
            >
              <span
                className="material-symbols-outlined"
                data-icon="person_search"
              >
                person_search
              </span>
              <span className="font-label-md text-label-md">Find Doctors</span>
            </a>
            {/*  Appointments  */}
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              href="#appointments"
            >
              <span
                className="material-symbols-outlined"
                data-icon="calendar_today"
              >
                calendar_today
              </span>
              <span className="font-label-md text-label-md">Appointments</span>
              <span className="ml-auto bg-primary text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                1
              </span>
            </a>
            {/*  My Health Records  */}
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              href="#records"
            >
              <span
                className="material-symbols-outlined"
                data-icon="medical_information"
              >
                medical_information
              </span>
              <span className="font-label-md text-label-md">
                Medical Records
              </span>
            </a>
            {/*  Prescriptions  */}
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              href="#prescriptions"
            >
              <span
                className="material-symbols-outlined"
                data-icon="prescriptions"
              >
                prescriptions
              </span>
              <span className="font-label-md text-label-md">Prescriptions</span>
            </a>
            {/*  Messages  */}
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              href="#messages"
            >
              <span className="material-symbols-outlined" data-icon="chat">
                chat
              </span>
              <span className="font-label-md text-label-md">Messages</span>
            </a>
            {/*  Settings  */}
            <a
              className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest rounded-lg transition-colors"
              href="#settings"
            >
              <span className="material-symbols-outlined" data-icon="settings">
                settings
              </span>
              <span className="font-label-md text-label-md">Settings</span>
            </a>
          </nav>
        </div>
        {/*  Bottom Sidebar Section: Emergency Action & User Switcher  */}
        <div className="p-4 border-t border-outline-variant flex flex-col gap-3 bg-surface-container-low">
          {/*  Emergency Call Button (Mandated by Shared Components & Prompt)  */}
          <a
            className="w-full min-h-12 bg-error hover:bg-on-error-container text-on-error font-label-lg text-label-lg flex items-center justify-center gap-2 rounded-lg transition-colors shadow-sm focus:ring-4 focus:ring-error-container"
            href="tel:112"
          >
            <span
              className="material-symbols-outlined"
              data-icon="e911_emergency"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              e911_emergency
            </span>
            <span>Emergency Call</span>
          </a>
          {/*  Patient Profile Switcher  */}
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-lowest border border-outline-variant hover:bg-surface-variant cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-secondary-container text-primary font-bold flex items-center justify-center shrink-0">
                RV
              </div>
              <div className="flex flex-col truncate text-left">
                <span className="font-label-md text-label-md text-on-surface truncate">
                  Rahul Verma
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Self (Primary)
                </span>
              </div>
            </div>
            <span
              className="material-symbols-outlined text-outline shrink-0"
              data-icon="unfold_more"
            >
              unfold_more
            </span>
          </div>
          {/*  Footer Help & Support / Logout  */}
          <div className="flex items-center justify-between pt-1 px-1 text-on-surface-variant font-label-sm text-label-sm">
            <a
              className="hover:text-primary flex items-center gap-1"
              href="#help"
            >
              <span
                className="material-symbols-outlined text-sm"
                data-icon="help"
              >
                help
              </span>{" "}
              Help
            </a>
            <a
              className="hover:text-error flex items-center gap-1"
              href="#logout"
            >
              <span
                className="material-symbols-outlined text-sm"
                data-icon="logout"
              >
                logout
              </span>{" "}
              Log Out
            </a>
          </div>
        </div>
      </aside>
      {/*  =========================================================================  */}
      {/*  MAIN APPLICATION CONTENT WRAPPER                                           */}
      {/*  =========================================================================  */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-y-auto custom-scroll">
        {/*  Top Bar Component  */}
        <header className="sticky top-0 z-20 bg-surface-container-lowest border-b border-outline-variant px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 shadow-sm">
          {/*  Search Input: Search consultations, doctors, records  */}
          <div className="relative flex-1 max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
              <span
                className="material-symbols-outlined text-xl"
                data-icon="search"
              >
                search
              </span>
            </div>
            <input
              className="w-full pl-10 pr-4 py-2.5 h-12 bg-surface border border-outline-variant rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Search consultations, doctors, records..."
              type="text"
            />
          </div>
          {/*  Right Action Cluster  */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/*  Language Switcher (English/Hindi)  */}
            <div className="relative inline-flex items-center bg-surface-container-low border border-outline-variant rounded-lg p-1">
              <button className="px-2.5 py-1 text-xs font-label-sm rounded bg-surface-container-lowest text-primary shadow-xs font-bold transition-all">
                EN
              </button>
              <button className="px-2.5 py-1 text-xs font-label-sm rounded text-on-surface-variant hover:text-on-surface transition-all">
                हिन्दी
              </button>
            </div>
            {/*  Notification Bell with Alert Dot  */}
            <button
              aria-label="Notifications"
              className="relative w-11 h-11 flex items-center justify-center rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors text-on-surface-variant"
            >
              <span
                className="material-symbols-outlined"
                data-icon="notifications"
              >
                notifications
              </span>
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
            </button>
            {/*  Patient Profile Badge  */}
            <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-outline-variant">
              <div className="text-right">
                <div className="font-label-md text-label-md text-on-surface">
                  Rahul Verma
                </div>
                <div className="font-label-sm text-label-sm text-secondary tracking-wide">
                  ABHA #91-8273-0912
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary-fixed bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold">
                RV
              </div>
            </div>
          </div>
        </header>
        {/*  Main Canvas Area  */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6">
          {/*  =====================================================================  */}
          {/*  Welcome Banner & Low-Bandwidth Status Strip                           */}
          {/*  =====================================================================  */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Good morning, Rahul!
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                Your healthcare journey, all in one place.
              </p>
            </div>
            {/*  Connectivity Status Chip (WCAG Accessible)  */}
            <div className="self-start sm:self-center inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-secondary-container text-on-secondary-container border border-secondary-fixed-dim">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
              <span className="font-label-sm text-label-sm font-semibold tracking-wide">
                Low-Bandwidth Mode: Ready
              </span>
              <span
                className="material-symbols-outlined text-sm"
                data-icon="network_check"
              >
                network_check
              </span>
            </div>
          </div>
          {/*  =====================================================================  */}
          {/*  Health Summary Stats Bento Grid                                        */}
          {/*  =====================================================================  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/*  Stat 1: Next Appointment  */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Next Appointment
                </span>
                <div className="w-9 h-9 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-lg"
                    data-icon="event"
                  >
                    event
                  </span>
                </div>
              </div>
              <div>
                <div className="font-title-lg text-title-lg text-on-surface">
                  Tomorrow, 10:30 AM
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Follow-up with Dr. Sharma
                </div>
              </div>
            </div>
            {/*  Stat 2: Active Prescriptions  */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Active Prescriptions
                </span>
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-lg"
                    data-icon="medication"
                  >
                    medication
                  </span>
                </div>
              </div>
              <div>
                <div className="font-title-lg text-title-lg text-on-surface">
                  2 Medicines
                </div>
                <div className="font-body-sm text-body-sm text-tertiary mt-0.5 font-medium">
                  Refill due in 5 days
                </div>
              </div>
            </div>
            {/*  Stat 3: Recent Consultation  */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Recent Consultation
                </span>
                <div className="w-9 h-9 rounded-lg bg-secondary-container text-primary flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-lg"
                    data-icon="clinical_notes"
                  >
                    clinical_notes
                  </span>
                </div>
              </div>
              <div>
                <div className="font-title-lg text-title-lg text-on-surface">
                  Dr. Priya Sharma
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  3 days ago • General Med
                </div>
              </div>
            </div>
            {/*  Stat 4: Pending Lab Tests  */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant shadow-sm hover:border-primary transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between text-on-surface-variant mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Pending Lab Tests
                </span>
                <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-lg"
                    data-icon="biotech"
                  >
                    biotech
                  </span>
                </div>
              </div>
              <div>
                <div className="font-title-lg text-title-lg text-on-surface">
                  0 Pending
                </div>
                <div className="font-body-sm text-body-sm text-tertiary mt-0.5 font-medium">
                  All reports verified
                </div>
              </div>
            </div>
          </div>
          {/*  =====================================================================  */}
          {/*  Prominent 'Upcoming Teleconsultation' Hero Card                        */}
          {/*  =====================================================================  */}
          <section className="bg-surface-container-lowest border-2 border-primary-container/30 rounded-xl p-6 sm:p-7 shadow-md relative overflow-hidden">
            {/*  Accent indicator bar  */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/*  Doctor Details & Call Context  */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative shrink-0">
                  <img
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-primary-fixed shadow-sm"
                    data-alt="A warm, professional female Indian physician wearing a medical coat and stethoscope smiling gently at the camera in a modern clean clinic. Soft natural studio lighting illuminates the serene teal and white clinical background, creating a calm and reassuring atmosphere."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPhpjoOxOd8sY-MrzPB_JaWKt25xDZ04hEdDOvtaI-QSbfZhkhYp9ya4V3qz-nifenBIJoVtE7bFQT6giD5NDsETZ4ezRauECdLdlZ3-19vdcn0KxgBnj0jrevzXynshDoh9_bQ_M14mxh_2HxVMFpd8A1OKI4ooQhRz8fcAl4Lugi17oE-nnsLiNBq39JyrBSYzpZMQ7NwOybTqgkd_hHYILBGtZc44ujZWTf-LKJ5jfhW0JrRI1l"
                  />
                  <span
                    className="absolute bottom-0 right-0 w-6 h-6 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center text-xs shadow-xs"
                    title="Verified Physician"
                  >
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="verified"
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
                  {/*  Telehealth Specs Badges  */}
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded text-on-surface">
                      <span
                        className="material-symbols-outlined text-base text-primary"
                        data-icon="videocam"
                      >
                        videocam
                      </span>
                      Video Call (Optimized for 2G/3G)
                    </span>
                    <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm bg-surface-container px-2.5 py-1 rounded text-tertiary font-semibold">
                      <span
                        className="material-symbols-outlined text-base text-tertiary"
                        data-icon="check_circle"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                      Camera &amp; Mic tested OK
                    </span>
                  </div>
                </div>
              </div>
              {/*  Action Buttons Column  */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 lg:min-w-60">
                <a
                  className="min-h-12.5 px-6 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-secondary-container text-center"
                  href="#room"
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    data-icon="video_call"
                  >
                    video_call
                  </span>
                  <span>Join Consultation Room</span>
                </a>
                <div className="flex items-center gap-2">
                  <button className="flex-1 min-h-11 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 transition-colors border border-outline-variant">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="upload_file"
                    >
                      upload_file
                    </span>
                    <span>Upload Symptoms</span>
                  </button>
                  <button className="flex-1 min-h-11 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface-variant rounded-lg font-label-md text-label-md flex items-center justify-center gap-1 transition-colors border border-outline-variant">
                    <span
                      className="material-symbols-outlined text-sm"
                      data-icon="schedule"
                    >
                      schedule
                    </span>
                    <span>Reschedule</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
          {/*  =====================================================================  */}
          {/*  AI Health Assistant Intake Banner Card                                 */}
          {/*  =====================================================================  */}
          <section className="bg-linear-to-r from-secondary-container via-surface-container-lowest to-surface-container-lowest border border-secondary-fixed-dim rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 max-w-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-xs">
                <span
                  className="material-symbols-outlined text-2xl"
                  data-icon="smart_toy"
                >
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
                  language before meeting your doctor. We prepare a concise
                  clinical summary for Dr. Sharma.
                </p>
              </div>
            </div>
            <button className="min-h-12 px-5 bg-secondary hover:bg-primary text-on-secondary rounded-lg font-label-lg text-label-lg flex items-center gap-2 shrink-0 transition-colors shadow-sm">
              <span className="material-symbols-outlined" data-icon="mic">
                mic
              </span>
              <span>Describe Symptoms Now</span>
            </button>
          </section>
          {/*  =====================================================================  */}
          {/*  Quick Actions Grid                                                     */}
          {/*  =====================================================================  */}
          <div className="flex flex-col gap-3">
            <h3 className="font-title-lg text-title-lg text-on-surface">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/*  Action 1: Find a Doctor  */}
              <a
                className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
                href="#find-doctors"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-2xl"
                    data-icon="search"
                  >
                    search
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                  Find a Doctor
                </span>
                <span className="font-body-sm text-label-sm text-on-surface-variant mt-0.5">
                  Specialists near you
                </span>
              </a>
              {/*  Action 2: Book Appointment  */}
              <a
                className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
                href="#book-appointment"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-2xl"
                    data-icon="calendar_add_on"
                  >
                    calendar_add_on
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                  Book Appointment
                </span>
                <span className="font-body-sm text-label-sm text-on-surface-variant mt-0.5">
                  Video or in-clinic
                </span>
              </a>
              {/*  Action 3: View Prescriptions  */}
              <a
                className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
                href="#prescriptions"
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-2xl"
                    data-icon="receipt_long"
                  >
                    receipt_long
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                  View Prescriptions
                </span>
                <span className="font-body-sm text-label-sm text-on-surface-variant mt-0.5">
                  Dosages &amp; renewals
                </span>
              </a>
              {/*  Action 4: Download Health Card  */}
              <a
                className="flex flex-col items-center justify-center p-5 bg-surface-container-lowest rounded-xl border border-outline-variant hover:border-primary hover:shadow-md transition-all text-center group"
                href="#download-card"
              >
                <div className="w-12 h-12 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span
                    className="material-symbols-outlined text-2xl"
                    data-icon="badge"
                  >
                    badge
                  </span>
                </div>
                <span className="font-label-md text-label-md text-on-surface group-hover:text-primary">
                  Download Health Card
                </span>
                <span className="font-body-sm text-label-sm text-on-surface-variant mt-0.5">
                  ABHA / Ayushman ID
                </span>
              </a>
            </div>
          </div>
          {/*  =====================================================================  */}
          {/*  Recent Consultations Table / Cards Section                             */}
          {/*  =====================================================================  */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-outline-variant pb-4 mb-4">
              <div>
                <h3 className="font-title-lg text-title-lg text-on-surface">
                  Recent Consultations
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Past clinical visits, doctor notes, and active prescription
                  records.
                </p>
              </div>
              <a
                className="font-label-md text-label-md text-primary hover:underline inline-flex items-center gap-1"
                href="#all-consultations"
              >
                <span>View All</span>
                <span
                  className="material-symbols-outlined text-sm"
                  data-icon="chevron_right"
                >
                  chevron_right
                </span>
              </a>
            </div>
            {/*  Consultation Records Stream  */}
            <div className="divide-y divide-outline-variant/60">
              {consultations.map((cons) => (
                <div
                  key={cons.id}
                  className="py-4.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-full ${cons.bg} text-primary flex items-center justify-center shrink-0 font-bold`}
                    >
                      {cons.initials}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-label-lg text-label-lg text-on-surface">
                          {cons.doctor}
                        </h4>
                        <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
                          {cons.spec}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {cons.date}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface mt-1">
                        <span className="font-medium">Diagnosis:</span>{" "}
                        {cons.diag}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    <button className="min-h-10 px-3.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant text-primary rounded-lg font-label-sm text-label-sm inline-flex items-center gap-1.5 transition-colors">
                      <span
                        className="material-symbols-outlined text-base"
                        data-icon="description"
                      >
                        description
                      </span>
                      <span>Clinical Notes</span>
                    </button>
                    <button className="min-h-10 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-sm text-label-sm inline-flex items-center gap-1.5 transition-colors shadow-xs">
                      <span
                        className="material-symbols-outlined text-base"
                        data-icon="prescriptions"
                      >
                        prescriptions
                      </span>
                      <span>View Prescription</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
        {/*  =========================================================================  */}
        {/*  PORTAL FOOTER (Web Footer Component from Shared Components JSON)            */}
        {/*  =========================================================================  */}
        <footer className="mt-auto bg-surface-container border-t border-outline-variant">
          <div className="w-full py-8 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <span className="font-headline-sm text-headline-sm font-bold text-primary">
                RuralCare
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
                © 2024 RuralCare Health. Accessible, dignified healthcare for
                all communities. If you are experiencing a life-threatening
                medical crisis, please immediately dial 112 or visit your
                nearest emergency health center.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-2 font-label-sm text-label-sm">
              <a
                className="text-on-surface-variant hover:underline transition-colors"
                href="#privacy"
              >
                Privacy Policy
              </a>
              <a
                className="text-on-surface-variant hover:underline transition-colors"
                href="#terms"
              >
                Terms of Service
              </a>
              <a
                className="text-on-surface-variant hover:underline transition-colors"
                href="#accessibility"
              >
                Accessibility Statement
              </a>
              <a
                className="text-on-surface-variant hover:underline transition-colors"
                href="#protocols"
              >
                Clinical Protocols
              </a>
              <a
                className="text-on-surface-variant hover:underline transition-colors"
                href="#contact"
              >
                Contact Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
