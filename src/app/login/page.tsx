export default function Page() {
  return (
    <>
      {/* Extracted from RuralCare_-_Login_&_Authentication_10f61b0b4f2549999a1992d3d3a4a441.html */}
      
{/*  TOP HEADER / BRANDING & EMERGENCY DIALER BAR  */}
<header className="w-full bg-surface-container-lowest border-b border-outline-variant shadow-sm sticky top-0 z-40">
<div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
{/*  Brand Logo Area with provided reference logo  */}
<a className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-1" href="#">
<img alt="RuralCare Healthcare, wherever you are" className="h-10 sm:h-12 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1V0FQI2eM9nOW5WhwpDD5OHYSrXqvGhrjjMtRhjO4H7fLmjxdXGUtL_8Hv-A3LPlDq7Ij01rhaSR5Qb1fA1qf-sIYQXJtRk8ZoxBo--mNEKeQ9CqgG2CzKAMNMXennLRUvKyAPU_fdISY2Rmk2_CM35LATG3ZqlJ8_dUkorKQNdC6T3OArF9OHNntweQtqTLqGmTcTNN8aFlJjSLx9pnwOBbuXIS-eqDJb9BeloJT04mgXYwHRgu7EzUMg"/>
</a>
{/*  Trailing Action: Emergency Dialing & Language Support  */}
<div className="flex items-center gap-3">
{/*  Low Bandwidth Indicator Badge  */}
<div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant rounded-full text-secondary font-label-sm text-label-sm">
<span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span>Fast 2G/3G Ready</span>
</div>
{/*  Emergency Dial Button  */}
<a className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-error text-on-error font-label-md text-label-md hover:bg-error-container hover:text-on-error-container transition-all shadow-sm focus:ring-2 focus:ring-error focus:ring-offset-2" href="tel:112">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
<span className="hidden md:inline">Emergency:</span>
<span className="font-bold tracking-wider">Dial 112</span>
</a>
{/*  Toll Free Helpline  */}
<a className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors font-label-sm text-label-sm" href="tel:18007872522">
<span className="material-symbols-outlined">call</span>
<span>1800-RURAL-CARE</span>
</a>
</div>
</div>
</header>
{/*  MAIN LOGIN & AUTHENTICATION CANVAS (BENTO/SPLIT LAYOUT)  */}
<main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-8">
<div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
{/*  LEFT HERO SECTION: Trust, Dignity & Rural Telehealth Commitment  */}
<section className="lg:col-span-6 bg-surface-container-low border border-outline-variant rounded-xl p-6 sm:p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-sm">
{/*  Decorative Ambient Tint Overlay  */}
<div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-secondary-container/40 rounded-full blur-3xl pointer-events-none"></div>
<div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-primary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>
<div className="relative z-10 space-y-6">
{/*  Connection Status Pill  */}
<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-full border border-outline-variant shadow-sm">
<span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
<span className="font-label-sm text-label-sm text-primary font-bold tracking-wide">CERTIFIED TELEHEALTH NETWORK</span>
</div>
<div className="space-y-3">
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
              Access certified doctors anytime, anywhere.
            </h1>
<p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
              Empowering remote villages and farming families with compassionate, prompt medical consultations without long bus journeys or lost working days.
            </p>
</div>
{/*  Feature Highlights Bento / Cards  */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
{/*  Resilience Card  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/70 shadow-sm flex flex-col gap-2">
<div className="w-8 h-8 rounded-md bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-primary">network_wifi_1_bar</span>
</div>
<span className="font-label-md text-label-md text-on-surface">Low-Bandwidth Resilience</span>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Seamless audio fallback during patchy network reception.</p>
</div>
{/*  Bilingual Consultation  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/70 shadow-sm flex flex-col gap-2">
<div className="w-8 h-8 rounded-md bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-primary">translate</span>
</div>
<span className="font-label-md text-label-md text-on-surface">Bilingual Care</span>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">Consult in 12+ regional tongues with accredited physicians.</p>
</div>
{/*  Privacy Guarantee  */}
<div className="bg-surface-container-lowest p-3.5 rounded-lg border border-outline-variant/70 shadow-sm flex flex-col gap-2">
<div className="w-8 h-8 rounded-md bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined text-primary">shield</span>
</div>
<span className="font-label-md text-label-md text-on-surface">100% Data Privacy</span>
<p className="font-body-sm text-body-sm text-on-surface-variant text-xs">ABHA &amp; HIPAA clinical confidentiality encryption.</p>
</div>
</div>
</div>
{/*  Trust Hero Image Placeholder with Contextual Prompt  */}
<div className="relative z-10 mt-6 pt-6 border-t border-outline-variant/60">
<div className="relative rounded-lg overflow-hidden border border-outline-variant bg-surface-container shadow-inner">
<img className="w-full h-44 object-cover" data-alt="A caring medical doctor holding a tablet consultation with a rural family outside their peaceful village home during warm morning daylight. The physician listens intently with warmth and empathy. The background features lush agricultural hills and a blue sky, conveying dependable telemedicine and community health dignity. Clean bright clinical style with serene oceanic cyan accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFMg_m9AEP6MjL3kfR6NdransOJPCdWy9yATwAjxZM4bnmqo6uj4hS1EucUGwdBq0DwnU6cLqSbQBvouNilzHhd85lzR6qZJzP_gCxKRO_s-JX3TL8Pl-GRqFMI3iXwTanzDujbb-cd2M6YFzgwYzPxreccFCSfFhog-ImJ1mTINjREwa5eaPPZ5t7LhgYYlsXcJcjiVGIJBVj-LTQzfmMjgratSru2j7kO3queG8_CzIjb0oeF7_N"/>
<div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-4">
<p className="font-label-sm text-label-sm text-on-primary font-medium flex items-center gap-1.5">
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                Over 480,000 rural consultations delivered nationwide
              </p>
</div>
</div>
</div>
</section>
{/*  RIGHT CARD: Authentication & Role Switcher  */}
<section className="lg:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sm:p-8 md:p-10 shadow-sm flex flex-col justify-center">
<div className="mb-6 space-y-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">Patient &amp; Doctor Portal</span>
<a className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1" href="#">
<span>Admin Log in</span>
<span className="material-symbols-outlined text-sm">north_east</span>
</a>
</div>
<h2 className="font-headline-md text-headline-md text-on-surface">Welcome back to RuralCare</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Sign in to check health records, join video calls, or access prescriptions.</p>
</div>
{/*  Role Switcher Toggle Tabs  */}
<div className="bg-surface-container-low p-1 rounded-lg flex items-center gap-1 mb-6 border border-outline-variant" role="tablist">
<button aria-selected="true" className="flex-1 py-2.5 px-4 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 transition-all bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/60 font-bold" id="role-patient" role="tab" type="button">
<span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
<span>Patient</span>
</button>
<button aria-selected="false" className="flex-1 py-2.5 px-4 rounded-md font-label-md text-label-md flex items-center justify-center gap-2 transition-all text-on-surface-variant hover:text-primary hover:bg-surface-container/50 font-normal" id="role-doctor" role="tab" type="button">
<span className="material-symbols-outlined text-lg">stethoscope</span>
<span>Doctor / Clinician</span>
</button>
</div>
{/*  Form Submission  */}
<form className="space-y-4">
{/*  Email / Mobile Field  */}
<div>
<label className="block font-label-md text-label-md text-on-surface mb-1.5" htmlFor="identifier">
<span id="identifier-label">Mobile Number or Email</span>
<span className="text-error font-bold">*</span>
</label>
<div className="relative custom-ring rounded-lg border border-outline-variant bg-surface-container-lowest transition-all">
<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined" id="identifier-icon">call</span>
</div>
<input className="w-full h-12 pl-10 pr-4 rounded-lg bg-transparent border-none text-on-surface font-body-md text-body-md placeholder:text-outline-variant focus:ring-0 focus:outline-none" id="identifier" name="identifier" placeholder="e.g. 98765 43210 or name@domain.com" required type="text"/>
</div>
</div>
{/*  Password Field with Show/Hide Toggle  */}
<div>
<div className="flex items-center justify-between mb-1.5">
<label className="font-label-md text-label-md text-on-surface" htmlFor="password">
                Password <span className="text-error font-bold">*</span>
</label>
<a className="font-label-sm text-label-sm text-primary hover:underline focus:outline-none focus:text-primary-container" href="#">
                Forgot password?
              </a>
</div>
<div className="relative custom-ring rounded-lg border border-outline-variant bg-surface-container-lowest transition-all">
<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
<span className="material-symbols-outlined">lock</span>
</div>
<input className="w-full h-12 pl-10 pr-12 rounded-lg bg-transparent border-none text-on-surface font-body-md text-body-md placeholder:text-outline-variant focus:ring-0 focus:outline-none" id="password" name="password" placeholder="Enter your confidential password" required type="password"/>
<button aria-label="Show password" className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface focus:outline-none" id="toggle-password-btn" type="button">
<span className="material-symbols-outlined" id="pwd-icon">visibility</span>
</button>
</div>
</div>
{/*  Remember Me Checkbox  */}
<div className="flex items-center pt-1">
<label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
<input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer" name="remember" type="checkbox"/>
<span className="font-body-sm text-body-sm text-on-surface-variant">Keep me signed in on this secure device</span>
</label>
</div>
{/*  Primary Submit Button  */}
<button className="w-full h-12 md:h-12 bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg font-bold transition-all shadow-sm flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-2" type="submit">
<span>Login to Your Account</span>
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</form>
{/*  Divider  */}
<div className="relative my-6 flex items-center">
<div className="flex-grow border-t border-outline-variant"></div>
<span className="flex-shrink mx-3 px-2 bg-surface-container-lowest font-label-sm text-label-sm text-outline font-semibold uppercase tracking-wider">OR</span>
<div className="flex-grow border-t border-outline-variant"></div>
</div>
{/*  Social & Government Health ID SSO  */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
{/*  ABHA / Ayushman Bharat Digital Health ID  */}
<button className="h-12 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-colors shadow-sm" type="button">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>fingerprint</span>
<span>Login with ABHA ID</span>
</button>
{/*  Google SSO  */}
<button className="h-12 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-colors shadow-sm" type="button">
<svg className="w-4 h-4" viewBox="0 0 24 24">
<path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"></path>
<path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"></path>
<path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
<path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
</svg>
<span>Continue with Google</span>
</button>
</div>
{/*  Footer Onboarding Navigation  */}
<div className="mt-6 pt-5 border-t border-outline-variant text-center space-y-2">
<p className="font-body-md text-body-md text-on-surface-variant">
            New to RuralCare? 
            <a className="font-label-md text-label-md text-primary font-bold hover:underline" href="#">
              Create an Account
            </a>
</p>
<div className="flex items-center justify-center gap-3 font-label-sm text-label-sm text-outline">
<a className="hover:text-primary transition-colors" href="#">Register as Patient</a>
<span>•</span>
<a className="hover:text-primary transition-colors" href="#">Apply as Doctor Partner</a>
</div>
</div>
</section>
</div>
</main>
{/*  DOCKED WEB FOOTER (From Shared Components & Style Guidelines)  */}
<footer className="w-full bg-surface-container border-t border-outline-variant mt-8">
<div className="max-w-7xl mx-auto py-6 px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
<div className="space-y-1">
<p className="font-headline-sm text-headline-sm font-bold text-primary">RuralCare</p>
<p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
          © 2024 RuralCare Health. Accessible, dignified healthcare for all communities. If you are experiencing a life-threatening medical crisis, please immediately dial 112 or visit your nearest emergency health center.
        </p>
</div>
<div className="flex flex-wrap items-center justify-center md:justify-end gap-x-5 gap-y-2 font-label-sm text-label-sm">
<a className="text-on-surface-variant hover:underline" href="#">Privacy Policy</a>
<a className="text-on-surface-variant hover:underline" href="#">Terms of Service</a>
<a className="text-on-surface-variant hover:underline" href="#">Accessibility Statement</a>
<a className="text-on-surface-variant hover:underline" href="#">Clinical Protocols</a>
<a className="text-on-surface-variant hover:underline" href="#">Contact Support</a>
</div>
</div>
</footer>
{/*  Interactive Logic for Role Switching and Password Visibility  */}


    </>
  );
}