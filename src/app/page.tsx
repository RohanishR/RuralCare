"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, Check, ChevronDown, HeartPulse, Languages, Menu, ShieldCheck, Stethoscope, Video, X } from "lucide-react";

const services = [
  { icon: Video, title: "Care without the commute", text: "Meet your doctor online. Spend less time travelling and more time taking care of yourself.", link: "/find-doctor", action: "Find a doctor" },
  { icon: Languages, title: "A little more understanding", text: "Translate your questions between English, Hindi, and Tamil before your consultation.", link: "/translation", action: "Explore translation" },
  { icon: HeartPulse, title: "Your health, in one place", text: "Keep appointments, clinician-issued prescriptions, and medical records together in your patient account.", link: "/patient/dashboard", action: "Your care space" },
];
const faqs = [
  ["How do I book a consultation?", "Create a patient account, find a doctor, and request a suitable date and time. Your appointment appears in your dashboard, where you can check whether the doctor has confirmed it."],
  ["What do I need for a video appointment?", "Use a recent browser with a camera, microphone, and internet connection. Allow camera and microphone access when you join. Both participants must open the same confirmed appointment."],
  ["Does the symptom assistant diagnose conditions?", "No. The symptom assistant helps organize information for discussion with your clinician. Your doctor is responsible for clinical assessment and treatment decisions."],
  ["Which languages are supported?", "The translation tool supports English, Hindi, and Tamil. Doctor profiles list the languages they speak. Machine translations may contain errors; confirm important instructions with your doctor."],
  ["Can I use RuralCare in an emergency?", "RuralCare is for scheduled consultations. For an emergency, call 112 or contact your nearest emergency service immediately."],
];

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="marketing-page">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="marketing-header">
        <div className="marketing-container flex h-20 items-center justify-between gap-4">
          <Link href="/" aria-label="RuralCare home" className="brand"><span className="brand-mark"><HeartPulse size={24} /></span>RuralCare<span className="brand-dot">.</span></Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#care">Our care</a><a href="#how-it-works">How it works</a><a href="#for-doctors">For doctors</a><a href="#questions">Questions</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm font-semibold sm:block">Sign in</Link>
            <span className="hidden sm:inline-flex"><Link href="/register" className="care-button care-button-dark">Get started <ArrowUpRight size={16} /></Link></span>
            <button type="button" className="rounded-lg p-3 md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="home-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {menuOpen && <nav id="home-menu" aria-label="Mobile navigation" className="marketing-container flex flex-col gap-4 border-t py-5 md:hidden" onClick={() => setMenuOpen(false)}><a href="#care">Our care</a><a href="#how-it-works">How it works</a><a href="#for-doctors">For doctors</a><a href="#questions">Questions</a><Link href="/login">Sign in</Link><Link href="/register">Create an account</Link></nav>}
      </header>

      <main id="main-content">
        <section className="marketing-container hero-grid">
          <div>
            <span className="eyebrow"><span className="h-2 w-2 rounded-full bg-emerald-600" /> CARE THAT REACHES YOU</span>
            <h1 className="hero-title">Better care.<br />Closer to <span>home.</span></h1>
            <p className="hero-description">Good healthcare shouldn’t depend on your postcode. Connect with a doctor, find the words to explain how you feel, and take your next step from wherever you are.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link href="/find-doctor" className="care-button care-button-primary">Find your doctor <ArrowRight size={18} /></Link><a href="#how-it-works" className="care-button care-button-outline">See how it works <ArrowUpRight size={17} /></a></div>
            <p className="mt-7 flex items-center gap-2 text-sm text-slate-600"><ShieldCheck size={17} className="text-emerald-700" /> Your care journey. Guided by a clinician.</p>
          </div>
          <div className="care-preview" aria-label="Illustration of the RuralCare consultation journey">
            <div className="preview-topline"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-600" /> A little closer to care</span><span>RURALCARE</span></div>
            <div className="preview-orbit"><div className="orbit-ring ring-one" /><div className="orbit-ring ring-two" /><div className="doctor-illustration"><Stethoscope size={68} strokeWidth={1.1} /><span>Care starts with<br /><strong>a conversation.</strong></span></div><span className="orbit-icon orbit-video"><Video size={24} /></span><span className="orbit-icon orbit-heart"><HeartPulse size={24} /></span></div>
            <div className="preview-appointment"><div className="rounded-xl bg-emerald-50 p-3 text-emerald-800"><CalendarDays size={23} /></div><div><p className="font-semibold">Your next step, made simple</p><p className="mt-1 text-sm text-slate-500">Choose a doctor. Request a time.</p></div><ArrowUpRight className="ml-auto text-emerald-800" size={22} /></div>
            <div className="preview-bottom"><span><Check size={14} /> Online consultations</span><span><Check size={14} /> One patient account</span></div>
          </div>
        </section>

        <section className="care-principles" aria-label="Our approach"><div className="marketing-container grid gap-6 py-7 sm:grid-cols-3"><p><ShieldCheck size={19} /> Clinician-led care</p><p><Languages size={19} /> Support across languages</p><p><HeartPulse size={19} /> Built around your community</p></div></section>

        <section id="care" className="marketing-container marketing-section"><div className="section-heading"><div><p className="eyebrow">A MORE CONNECTED WAY TO CARE</p><h2>Less distance.<br />More peace of mind.</h2></div><p>From the first question to your follow-up, keep the important parts of your healthcare journey within reach.</p></div><div className="grid gap-5 md:grid-cols-3">{services.map(({ icon: Icon, title, text, link, action }, index) => <article key={title} className="service-card"><div className="flex items-center justify-between"><span className="service-icon"><Icon size={24} /></span><span className="text-xs text-slate-400">0{index + 1}</span></div><h3>{title}</h3><p>{text}</p><Link href={link}>{action}<ArrowUpRight size={17} /></Link></article>)}</div></section>

        <section id="how-it-works" className="how-section"><div className="marketing-container marketing-section"><div className="section-heading"><div><p className="eyebrow">YOUR FIRST VISIT</p><h2>Three steps to<br />a real conversation.</h2></div><Link href="/register" className="care-button care-button-outline">Create your account <ArrowRight size={17} /></Link></div><div className="grid gap-8 md:grid-cols-3">{[["01", "Make yourself at home", "Create your patient account and add the health details you want your clinician to know."], ["02", "Find your fit", "Explore doctor profiles by specialty, language, and fee. Request an appointment at a convenient time."], ["03", "Talk. Understand. Follow up.", "Join your confirmed consultation and return to your account for records and prescriptions."]].map(([number, title, text]) => <article key={number} className="step-card"><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

        <section id="for-doctors" className="marketing-container marketing-section"><div className="doctor-banner"><div><p className="eyebrow">FOR HEALTHCARE PROFESSIONALS</p><h2>Your expertise.<br />A wider reach.</h2><p>Bring your practice closer to communities that need it. Manage your professional profile and appointment requests in one workspace.</p><Link href="/register?role=doctor" className="care-button care-button-light">Join as a doctor <ArrowUpRight size={18} /></Link></div><div className="doctor-banner-art" aria-hidden="true"><Stethoscope size={140} strokeWidth={0.8} /><span>Human connection.<br />Meaningful care.</span></div></div></section>

        <section id="questions" className="marketing-container marketing-section faq-section"><div><p className="eyebrow">HERE TO HELP</p><h2>A few things<br />you might be wondering.</h2><p className="mt-5 text-slate-600">A clearer picture before your first visit.</p></div><div>{faqs.map(([question, answer]) => <details key={question} className="faq-item"><summary>{question}<ChevronDown size={18} /></summary><p>{answer}</p></details>)}</div></section>
        <section className="marketing-container pb-20"><div className="final-cta"><div><p className="eyebrow">WHEN YOU’RE READY</p><h2>Your next step to feeling better.</h2></div><Link href="/find-doctor" className="care-button care-button-primary">Explore doctors <ArrowRight size={18} /></Link></div></section>
      </main>
      <footer className="marketing-footer"><div className="marketing-container"><div className="flex flex-col justify-between gap-8 py-10 sm:flex-row"><div><Link href="/" className="brand"><HeartPulse size={24} /> RuralCare.</Link><p className="mt-3 max-w-xs text-sm text-slate-500">Healthcare accessibility, with people at the heart of it.</p></div><nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-4 text-sm"><Link href="/find-doctor">Find a doctor</Link><a href="#questions">Help & FAQs</a><Link href="/translation">Translation</Link><Link href="/login">Sign in</Link></nav></div><div className="flex flex-col justify-between gap-3 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row"><span>© {new Date().getFullYear()} RuralCare</span><p>For emergencies, <a href="tel:112" className="font-semibold text-red-700 underline">call 112</a> or visit your nearest emergency service.</p></div></div></footer>
    </div>
  );
}
