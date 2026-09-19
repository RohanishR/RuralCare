export default function Page() {
  return (
    <>
      {/* Extracted from RuralCare_-_Patient_Registration_9eb591e052a540ffa54e2884342edf3e.html */}
      
{/*  Low Bandwidth Accessibility Banner  */}
<aside aria-label="Connectivity Mode Notification" className="bg-surface-container-low border-b border-outline-variant px-4 py-2 text-center">
<div className="max-w-7xl mx-auto flex items-center justify-between text-on-surface-variant text-label-sm font-label-sm">
<div className="flex items-center gap-2">
<span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse"></span>
<span className="font-medium text-on-surface">Lite 2G/3G Optimized:</span>
<span className="hidden sm:inline text-on-surface-variant">Simplified form enabled for low cellular coverage areas</span>
</div>
<div className="flex items-center gap-4">
<span className="flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-base">signal_cellular_alt</span>
<span className="font-semibold">Voice &amp; Text Ready</span>
</span>
<a className="text-primary hover:underline font-label-sm" href="#help">Need Help?</a>
</div>
</div>
</aside>
{/*  Focused Task Header (Semantic suppression of general global navigation per transactional intent)  */}
<header className="sticky top-0 z-40 bg-surface border-b border-outline-variant shadow-sm backdrop-blur-sm bg-opacity-95">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
{/*  Brand Logo Anchor  */}
<a aria-label="RuralCare Home" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1" href="#">
<img alt="RuralCare Logo" className="h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]" src="https://lh3.googleusercontent.com/aida/AEtjO1V0FQI2eM9nOW5WhwpDD5OHYSrXqvGhrjjMtRhjO4H7fLmjxdXGUtL_8Hv-A3LPlDq7Ij01rhaSR5Qb1fA1qf-sIYQXJtRk8ZoxBo--mNEKeQ9CqgG2CzKAMNMXennLRUvKyAPU_fdISY2Rmk2_CM35LATG3ZqlJ8_dUkorKQNdC6T3OArF9OHNntweQtqTLqGmTcTNN8aFlJjSLx9pnwOBbuXIS-eqDJb9BeloJT04mgXYwHRgu7EzUMg"/>
</a>
{/*  Right Support and Regional Selector  */}
<div className="flex items-center gap-3 sm:gap-6">
{/*  Toll-free Emergency/Helpline Button  */}
<a aria-label="Free Telehealth Helpline" className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary" href="tel:18002667872">
<span className="material-symbols-outlined text-primary text-xl">call</span>
<div className="text-left hidden md:block">
<span className="block text-[11px] leading-tight text-on-surface-variant uppercase font-semibold">Toll-Free Helpline</span>
<span className="block text-label-md font-label-md text-primary font-bold">1800-266-RURAL</span>
</div>
</a>
{/*  Multilingual Regional Switcher  */}
<div className="relative flex items-center">
<label className="sr-only" htmlFor="language-select">Choose Preferred Language</label>
<div className="flex items-center rounded-lg border border-outline-variant bg-surface-container-lowest px-2.5 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary">
<span className="material-symbols-outlined text-primary mr-1 text-xl">translate</span>
<select className="bg-transparent border-0 text-on-surface text-label-md font-label-md focus:ring-0 cursor-pointer pr-6 py-0.5" id="language-select">
<option value="en">English</option>
<option value="hi">हिंदी (Hindi)</option>
<option value="ta">தமிழ் (Tamil)</option>
<option value="bn">বাংলা (Bengali)</option>
<option value="te">తెలుగు (Telugu)</option>
<option value="mr">मराठी (Marathi)</option>
</select>
</div>
</div>
{/*  Assisted Registration Action for ASHA/Health Workers  */}
<div className="hidden lg:flex items-center border-l border-outline-variant pl-4">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm">
<span className="material-symbols-outlined text-base">verified_user</span>
            ASHA Assisted Portal
          </span>
</div>
</div>
</div>
</header>
{/*  Main Patient Registration Experience  */}
<main className="flex-grow py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
{/*  Top Stepper Indicator (Digitally Inclusive / High Contrast)  */}
<nav aria-label="Registration Progress" className="mb-8 sm:mb-12">
<ol className="grid grid-cols-3 gap-2 sm:gap-4 relative">
{/*  Step 1: Active  */}
<li className="relative flex flex-col items-center sm:items-start text-center sm:text-left bg-surface-container-lowest p-3 sm:p-4 rounded-xl border-2 border-primary shadow-sm">
<div className="flex items-center gap-2 mb-1">
<span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-on-primary font-bold text-label-md">1</span>
<span className="text-label-md font-label-md text-primary font-bold hidden sm:inline">Active Step</span>
</div>
<p className="text-label-lg font-label-lg text-primary font-bold">1. Basic Info</p>
<span className="text-label-sm font-label-sm text-on-surface-variant hidden md:block">Identity &amp; Phone verification</span>
</li>
{/*  Step 2: Upcoming  */}
<li className="relative flex flex-col items-center sm:items-start text-center sm:text-left bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-outline-variant opacity-75">
<div className="flex items-center gap-2 mb-1">
<span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-variant text-on-surface-variant font-bold text-label-md">2</span>
<span className="text-label-md font-label-md text-on-surface-variant hidden sm:inline">Next Step</span>
</div>
<p className="text-label-lg font-label-lg text-on-surface font-semibold">2. Contact &amp; Location</p>
<span className="text-label-sm font-label-sm text-on-surface-variant hidden md:block">Village, Tehsil &amp; PIN code</span>
</li>
{/*  Step 3: Upcoming  */}
<li className="relative flex flex-col items-center sm:items-start text-center sm:text-left bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-outline-variant opacity-75">
<div className="flex items-center gap-2 mb-1">
<span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-variant text-on-surface-variant font-bold text-label-md">3</span>
<span className="text-label-md font-label-md text-on-surface-variant hidden sm:inline">Final Step</span>
</div>
<p className="text-label-lg font-label-lg text-on-surface font-semibold">3. Health Profile</p>
<span className="text-label-sm font-label-sm text-on-surface-variant hidden md:block">Vitals, ABHA &amp; Allergies</span>
</li>
</ol>
</nav>
{/*  Registration Card Form Container  */}
<div className="clinical-card bg-surface-container-lowest rounded-xl p-6 sm:p-10">
{/*  Form Header  */}
<div className="border-b border-outline-variant pb-6 mb-8 text-left">
<div className="flex flex-wrap items-center gap-2 mb-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm border border-outline-variant">
<span className="material-symbols-outlined text-base">local_hospital</span>
            Ayushman Bharat (ABHA) Compatible
          </span>
<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-tertiary font-label-sm text-label-sm">
<span className="material-symbols-outlined text-base">check_circle</span>
            Zero Platform Fees
          </span>
</div>
<h1 className="text-headline-md sm:text-headline-lg font-headline-md sm:font-headline-lg text-on-surface font-bold tracking-tight">
          Create your RuralCare Account
        </h1>
<p className="text-body-md font-body-md text-on-surface-variant mt-2 max-w-3xl">
          Instant teleconsultations with certified doctors with zero travel. Connect via video, audio, or SMS with nationwide government hospital networks.
        </p>
</div>
{/*  Main Form  */}
<form className="space-y-8">
{/*  Responsive Grid for Input Fields  */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/*  Full Name Field  */}
<div className="space-y-1.5 md:col-span-2">
<div className="flex items-center justify-between">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="full-name">
                Full Name <span aria-hidden="true" className="text-error">*</span>
</label>
<span className="text-label-sm font-label-sm text-on-surface-variant">As per Aadhaar or Voter ID</span>
</div>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">person</span>
</span>
<input className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0 transition-colors" id="full-name" name="full_name" placeholder="e.g. Ramesh Kumar Verma" required type="text"/>
</div>
<p className="text-label-sm font-label-sm text-on-surface-variant">
              Please enter your full legal name to ensure valid government medical prescriptions.
            </p>
</div>
{/*  Mobile Number with OTP Action Button  */}
<div className="space-y-1.5 md:col-span-2">
<div className="flex items-center justify-between">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="mobile-number">
                Mobile Number <span aria-hidden="true" className="text-error">*</span>
</label>
<span className="text-label-sm font-label-sm text-primary font-semibold">Will receive 4-digit SMS OTP</span>
</div>
<div className="flex flex-col sm:flex-row gap-3">
<div className="relative flex-grow subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant font-semibold">
<span className="material-symbols-outlined text-xl mr-1">smartphone</span>
                  +91
                </span>
<input className="w-full h-12 pl-20 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0 tracking-wider" id="mobile-number" maxLength={10} name="mobile_number" pattern="[0-9]{10}" placeholder="98765 43210" required type="tel"/>
</div>
{/*  OTP Verification Action Trigger  */}
<button className="h-12 px-6 rounded-lg bg-secondary-container hover:bg-secondary-fixed text-on-secondary-fixed-variant font-label-lg text-label-lg flex items-center justify-center gap-2 border border-outline-variant transition-colors whitespace-nowrap active:scale-[0.98]" type="button">
<span className="material-symbols-outlined text-lg">sms</span>
                Verify via OTP
              </button>
</div>
</div>
{/*  Date of Birth  */}
<div className="space-y-1.5">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="dob">
              Date of Birth <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">calendar_today</span>
</span>
<input className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0" id="dob" name="date_of_birth" required type="date"/>
</div>
</div>
{/*  Gender Selection Segmented Controls  */}
<div className="space-y-1.5">
<label className="block text-label-md font-label-md text-on-surface font-semibold">
              Gender <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
<label className="flex items-center justify-center gap-1.5 h-12 px-2 border border-outline-variant rounded-lg cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low has-[:checked]:border-primary has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container text-body-sm font-label-md transition-all">
<input checked className="sr-only" name="gender" type="radio" value="male"/>
<span>Male</span>
</label>
<label className="flex items-center justify-center gap-1.5 h-12 px-2 border border-outline-variant rounded-lg cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low has-[:checked]:border-primary has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container text-body-sm font-label-md transition-all">
<input className="sr-only" name="gender" type="radio" value="female"/>
<span>Female</span>
</label>
<label className="flex items-center justify-center gap-1.5 h-12 px-2 border border-outline-variant rounded-lg cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low has-[:checked]:border-primary has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container text-body-sm font-label-md transition-all">
<input className="sr-only" name="gender" type="radio" value="other"/>
<span>Other</span>
</label>
<label className="flex items-center justify-center gap-1.5 h-12 px-1 text-center border border-outline-variant rounded-lg cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low has-[:checked]:border-primary has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container text-body-sm font-label-md transition-all">
<input className="sr-only" name="gender" type="radio" value="prefer_not"/>
<span>Prefer not</span>
</label>
</div>
</div>
{/*  State Selection  */}
<div className="space-y-1.5">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="state-select">
              State / Union Territory <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">map</span>
</span>
<select className="w-full h-12 pl-11 pr-8 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0" id="state-select" name="state" required>
<option disabled value="">Select your State</option>
<option value="UP">Uttar Pradesh</option>
<option value="BR">Bihar</option>
<option value="MP">Madhya Pradesh</option>
<option value="RJ">Rajasthan</option>
<option value="WB">West Bengal</option>
<option value="TN">Tamil Nadu</option>
<option value="MH">Maharashtra</option>
<option value="OD">Odisha</option>
<option value="AS">Assam</option>
<option value="other">Other State / UT</option>
</select>
</div>
</div>
{/*  District Selection  */}
<div className="space-y-1.5">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="district-select">
              District / Block <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">location_on</span>
</span>
<input className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0" id="district-select" name="district" placeholder="e.g. Sitapur / Tehsil Laharpur" required type="text"/>
</div>
</div>
{/*  Preferred Consultation Language  */}
<div className="space-y-1.5 md:col-span-2">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="consult-lang">
              Preferred Doctor Consultation Language <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">record_voice_over</span>
</span>
<select className="w-full h-12 pl-11 pr-8 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0" id="consult-lang" name="consultation_language" required>
<option value="hi">Hindi (हिंदी)</option>
<option value="en">English</option>
<option value="bn">Bengali (বাংলা)</option>
<option value="ta">Tamil (தமிழ்)</option>
<option value="te">Telugu (తెలుగు)</option>
<option value="mr">Marathi (मराठी)</option>
<option value="gu">Gujarati (ગુજરાતી)</option>
<option value="bho">Bhojpuri (भोजपुरी)</option>
<option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
</select>
</div>
<p className="text-label-sm font-label-sm text-on-surface-variant">
              We match you with verified doctors fluent in this language for clear audio/video consultations.
            </p>
</div>
{/*  Password Field  */}
<div className="space-y-1.5">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="password">
              Create Password / PIN <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">lock</span>
</span>
<input className="w-full h-12 pl-11 pr-10 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0" id="password" name="password" placeholder="At least 6 characters" required type="password"/>
<button aria-label="Toggle password visibility" className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-variant hover:text-on-surface" type="button">
<span className="material-symbols-outlined text-xl">visibility</span>
</button>
</div>
</div>
{/*  Confirm Password Field  */}
<div className="space-y-1.5">
<label className="block text-label-md font-label-md text-on-surface font-semibold" htmlFor="confirm-password">
              Confirm Password / PIN <span aria-hidden="true" className="text-error">*</span>
</label>
<div className="relative subtle-ring rounded-lg">
<span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-on-surface-variant">
<span className="material-symbols-outlined text-xl">lock_reset</span>
</span>
<input className="w-full h-12 pl-11 pr-4 rounded-lg bg-surface-container-lowest border border-outline-variant text-on-surface text-body-md font-body-md focus:border-primary focus:ring-0" id="confirm-password" name="confirm_password" placeholder="Re-enter same password" required type="password"/>
</div>
</div>
</div>
{/*  ABHA Integration & Terms Checkboxes Box  */}
<div className="p-4 sm:p-5 rounded-xl bg-surface-container-low border border-outline-variant space-y-4">
{/*  ABHA Integration Feature Box  */}
<div className="flex items-start gap-3">
<input checked className="w-6 h-6 rounded border-outline-variant text-primary focus:ring-primary mt-0.5" id="abha-consent" name="abha_consent" type="checkbox"/>
<label className="text-body-sm font-body-sm text-on-surface cursor-pointer" htmlFor="abha-consent">
<strong className="text-on-surface font-semibold block sm:inline">Link or generate my ABHA (Ayushman Bharat Health Account) automatically.</strong>
<span className="text-on-surface-variant block mt-0.5">Allows national digital hospital records integration and cashless government health benefits access.</span>
</label>
</div>
<div className="h-px bg-outline-variant opacity-60"></div>
{/*  Terms of Service Agreement  */}
<div className="flex items-start gap-3">
<input className="w-6 h-6 rounded border-outline-variant text-primary focus:ring-primary mt-0.5" id="terms-consent" name="terms_consent" required type="checkbox"/>
<label className="text-body-sm font-body-sm text-on-surface cursor-pointer" htmlFor="terms-consent">
              I agree to the <a className="text-primary font-semibold underline hover:text-primary-container" href="#terms">Terms of Service</a> and <a className="text-primary font-semibold underline hover:text-primary-container" href="#privacy">Privacy Policy</a>, and consent to tele-triage clinical guidelines.
            </label>
</div>
</div>
{/*  Action CTAs  */}
<div className="space-y-4 pt-2">
{/*  Primary CTA Button (Oversized 54px min-height for touch accessibility)  */}
<button className="w-full min-h-[54px] rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-3 transition-all duration-200 shadow-sm active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-secondary-container" type="submit">
<span>Create Account &amp; Verify Mobile</span>
<span className="material-symbols-outlined text-xl">arrow_forward</span>
</button>
{/*  Divider  */}
<div className="relative flex items-center justify-center my-4">
<div className="border-t border-outline-variant w-full"></div>
<span className="bg-surface-container-lowest px-4 text-label-sm font-label-sm text-on-surface-variant absolute">or register with single tap</span>
</div>
{/*  Secondary Google Action  */}
<button className="w-full min-h-[50px] rounded-lg bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant text-on-surface font-label-lg text-label-lg flex items-center justify-center gap-3 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary" type="button">
<svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24">
<path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4"></path>
<path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" fill="#34A853"></path>
<path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
<path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
</svg>
<span>Continue with Google</span>
</button>
</div>
</form>
{/*  Bottom Security & Trust Reassurance  */}
<div className="mt-8 pt-6 border-t border-outline-variant flex items-center justify-center gap-2.5 text-center text-on-surface-variant">
<span className="material-symbols-outlined text-primary text-xl">lock_person</span>
<p className="text-body-sm font-body-sm max-w-xl">
          Your medical data is encrypted with bank-grade 256-bit security. Never shared without your consent.
        </p>
</div>
</div>
{/*  Quick Help & Community Assistance Banner  */}
<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-2xl mt-0.5">support_agent</span>
<div>
<h4 className="text-label-md font-label-md text-on-surface font-semibold">ASHA Worker Assisted</h4>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Need help filling this form? Your local village health worker can register on your behalf.</p>
</div>
</div>
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-2xl mt-0.5">wifi_off</span>
<div>
<h4 className="text-label-md font-label-md text-on-surface font-semibold">SMS / IVR Fallback</h4>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">No smartphone? Dial our missed call service at 1800-266-7872 to register via voice call.</p>
</div>
</div>
<div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-2xl mt-0.5">policy</span>
<div>
<h4 className="text-label-md font-label-md text-on-surface font-semibold">Ayushman Bharat Tied</h4>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5">Direct sync with NDHM National Digital Health Mission for free government subsidies.</p>
</div>
</div>
</div>
</main>
{/*  Web Footer (Derived verbatim from Shared Components JSON)  */}
<footer className="bg-surface-container dark:bg-surface-container-highest border-t border-outline-variant dark:border-on-surface-variant mt-12">
<div className="w-full py-8 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
<div className="text-body-sm font-body-sm text-on-surface-variant dark:text-inverse-on-surface max-w-2xl text-center md:text-left">
        © 2024 RuralCare Health. Accessible, dignified healthcare for all communities. If you are experiencing a life-threatening medical crisis, please immediately dial 112 or visit your nearest emergency health center.
      </div>
<nav aria-label="Footer Quick Links" className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-label-sm font-label-sm">
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#privacy">Privacy Policy</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#terms">Terms of Service</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#accessibility">Accessibility Statement</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#protocols">Clinical Protocols</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors duration-150" href="#contact">Contact Support</a>
</nav>
</div>
</footer>
{/*  Light client-side interaction script  */}


    </>
  );
}