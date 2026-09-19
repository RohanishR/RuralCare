
const doctors = [
  { id: 1, name: 'Dr. Priya Sharma', qualifications: 'MD (AIIMS New Delhi)', spec: 'General Medicine & Family Health', fee: 150, feeType: 'Subsidized Rural Fee', exp: 8, langs: 'Hindi, English, Punjabi', rating: 4.9, reviews: '420+', nextSlot: 'Today at 2:30 PM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtTg3XE1pMDz5FbPKWyRljBl4veli-HCUEPeG_YsVflH7cCMaP0__uwRRs51FuaS5NI9czOVUSWt39lTD_sXw9dKvd5tyihBhbP0iKMOu9IwhKb3YqeNO7V-MdHc8IfA22Etvp8IYo1YraSs5_AS3Oo0d58aWyStEleuAwlwvE2WI2jm71wDt4Ovs6cUracymnfP8Xa34dZ83He7rDYcA-69kTE8wwAa7ACNlBsYhrJd29R3FMQIRH' },
  { id: 2, name: 'Dr. Rajesh Kulkarni', qualifications: 'MBBS, MD', spec: 'Pediatrician & Child Specialist', fee: 200, feeType: 'Standard Tele-visit', exp: 14, langs: 'Marathi, Hindi, English', rating: 4.8, reviews: '310', nextSlot: 'Today at 4:00 PM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEnCxjXURSnCy8rC-7y89ra0XJZ0zU3_FrQeYFh4G01Mn5PVIfBh3jmPT6hleVJDjcC8dmZtGS_mcQ9mIhA1Yp03uGu47y1EyQRWzpqaB9f5jDVsrnYLb_jay_LFpp8Qx80UEH1P20ma-aSgdA_lh8_3tIr-TLSMSGLTyxjEvEov01457MJI22MZrarkG10-q_q7HYiuOwgvKADPU721SZBu16HeorvZDIAvghWl-iFo4usNP6jaaY' },
  { id: 3, name: 'Dr. Anita Desai', qualifications: 'MBBS, DGO', spec: 'Obstetrics & Gynecology', fee: 180, feeType: 'Rural Care Camp', exp: 11, langs: 'Gujarati, Hindi, English', rating: 4.9, reviews: '560', nextSlot: 'Tomorrow at 10:00 AM', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtTg3XE1pMDz5FbPKWyRljBl4veli-HCUEPeG_YsVflH7cCMaP0__uwRRs51FuaS5NI9czOVUSWt39lTD_sXw9dKvd5tyihBhbP0iKMOu9IwhKb3YqeNO7V-MdHc8IfA22Etvp8IYo1YraSs5_AS3Oo0d58aWyStEleuAwlwvE2WI2jm71wDt4Ovs6cUracymnfP8Xa34dZ83He7rDYcA-69kTE8wwAa7ACNlBsYhrJd29R3FMQIRH' }
];
export default function Page() {
  return (
    <>
      {/* Extracted from RuralCare_-_Find_a_Doctor_cef837e5e8d040f1a2302c47ded0701e.html */}
      
{/*  Low Bandwidth Persistent Advisory Notification Banner  */}
<aside aria-label="Network Connectivity Notice" className="w-full bg-secondary-container/40 border-b border-outline-variant/40 px-4 py-2">
<div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-on-secondary-container">
<div className="flex items-center gap-2">
<span className="inline-flex h-2.5 w-2.5 rounded-full bg-tertiary"></span>
<p className="font-label-sm text-label-sm">
<span className="font-bold">Optimized for Rural Connectivity:</span> Low-data voice &amp; quick appointment booking enabled across 2G/3G networks.
        </p>
</div>
<div className="hidden sm:flex items-center gap-4">
<span className="font-label-sm text-label-sm flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[16px]">signal_cellular_alt</span>
          Bandwidth: Stable
        </span>
<button className="font-label-sm text-label-sm text-primary hover:underline font-bold">Switch to Audio Only</button>
</div>
</div>
</aside>
{/*  TopNavBar (Shared Component)  */}
<header className="sticky top-0 z-50 bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-on-surface-variant shadow-sm transition-all duration-200 ease-in-out">
<div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between w-full">
{/*  Brand Logo  */}
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
</div>
<div className="flex flex-col">
<span className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary leading-tight">RuralCare</span>
<span className="font-label-sm text-label-sm text-on-surface-variant -mt-1 hidden sm:inline">Healthcare, wherever you are</span>
</div>
</div>
{/*  Navigation Links (Web Desktop)  */}
<nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:text-primary transition-colors font-label-lg text-label-lg" href="#">Home</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:text-primary transition-colors font-label-lg text-label-lg" href="#">How It Works</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:text-primary transition-colors font-label-lg text-label-lg" href="#">For Patients</a>
<a className="text-primary dark:text-inverse-primary font-bold border-b-2 border-primary pb-1 font-label-lg text-label-lg" href="#">Find Doctors</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:text-primary transition-colors font-label-lg text-label-lg" href="#">For Doctors</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:text-primary transition-colors font-label-lg text-label-lg" href="#">About</a>
</nav>
{/*  Trailing Cluster  */}
<div className="flex items-center gap-3">
<button className="p-2 text-on-surface-variant hover:bg-surface-container dark:hover:bg-surface-variant rounded-lg transition-colors flex items-center gap-1 font-label-md text-label-md" title="Change Language" type="button">
<span className="material-symbols-outlined text-xl">translate</span>
<span className="hidden lg:inline">English/हिंदी</span>
</button>
<button className="hidden sm:inline-block px-4 py-2 font-label-lg text-label-lg text-primary hover:bg-surface-container rounded-lg transition-colors" type="button">
          Login
        </button>
<button className="px-5 py-2.5 bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:bg-primary-container transition-all" type="button">
          Get Started
        </button>
</div>
</div>
</header>
{/*  Main Discovery Canvas  */}
<main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 md:py-8">
{/*  Hero / Header Search Panel  */}
<section className="bg-surface-container-lowest border border-outline-variant/60 rounded-xl p-6 sm:p-8 shadow-sm mb-8">
<div className="max-w-3xl mb-6">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm mb-3">
<span className="material-symbols-outlined text-base">verified</span>
          Verified Rural Telehealth Network
        </div>
<h1 className="text-headline-lg font-headline-lg text-primary tracking-tight mb-2">Find Verified Doctors</h1>
<p className="text-body-lg font-body-lg text-on-surface-variant">
          Connect with 500+ board-certified specialists available for video, audio, or clinic consultations.
        </p>
</div>
{/*  Prominent Search Bar  */}
<form className="relative w-full mb-6">
<label className="sr-only" htmlFor="doctor-search">Search by doctor name, specialty, or condition</label>
<div className="relative flex items-center">
<span className="material-symbols-outlined absolute left-4 text-primary text-2xl pointer-events-none">search</span>
<input className="w-full pl-12 pr-36 py-4 rounded-lg bg-surface border border-outline-variant text-body-md font-body-md text-on-surface placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-secondary-container transition-all" id="doctor-search" placeholder="Search by doctor name, specialty (e.g. Cardiology, Pediatrics, General Medicine), or condition..." type="text"/>
<div className="absolute right-2.5 flex items-center gap-2">
<button className="hidden sm:inline-flex items-center gap-1 px-3 py-2 bg-surface-container-low text-on-surface-variant hover:bg-surface-container rounded-lg font-label-sm text-label-sm" type="button">
<span className="material-symbols-outlined text-base">mic</span>
              Voice Search
            </button>
<button className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm" type="submit">
              Search
            </button>
</div>
</div>
</form>
{/*  Quick Filter Pills Horizontal Carousel/Flex  */}
<div className="flex flex-col gap-2">
<span className="font-label-sm text-label-sm text-on-surface-variant">Popular categories in your district:</span>
<div className="flex flex-wrap items-center gap-2">
<button className="px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm border border-secondary-container font-bold hover:bg-secondary-fixed transition-colors" type="button">
            General Physician
          </button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-secondary-container/40 border border-outline-variant/60 font-label-sm text-label-sm transition-colors" type="button">
            Pediatrician
          </button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-secondary-container/40 border border-outline-variant/60 font-label-sm text-label-sm transition-colors" type="button">
            Gynecologist
          </button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-secondary-container/40 border border-outline-variant/60 font-label-sm text-label-sm transition-colors" type="button">
            Dermatologist
          </button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-secondary-container/40 border border-outline-variant/60 font-label-sm text-label-sm transition-colors" type="button">
            Cardiologist
          </button>
<button className="px-3.5 py-1.5 rounded-full bg-surface-container-low text-on-surface hover:bg-secondary-container/40 border border-outline-variant/60 font-label-sm text-label-sm transition-colors" type="button">
            Ayush/Ayurveda
          </button>
<button className="px-3.5 py-1.5 rounded-full bg-tertiary/10 text-tertiary border border-tertiary/30 font-label-sm text-label-sm font-bold hover:bg-tertiary/20 transition-colors flex items-center gap-1" type="button">
<span className="material-symbols-outlined text-sm">payments</span>
            Under ₹200 / Subsidized
          </button>
</div>
</div>
</section>
{/*  Layout Grid: Left Filters Sidebar + Right Doctor Cards  */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
{/*  Filter Sidebar (Col 1-4 on desktop)  */}
<aside className="lg:col-span-4 xl:col-span-3 bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 shadow-sm sticky top-24">
<div className="flex items-center justify-between pb-4 mb-4 border-b border-outline-variant/50">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary">filter_alt</span>
<h2 className="text-title-lg font-title-lg text-primary">Filter Consultations</h2>
</div>
<button className="text-primary font-label-sm text-label-sm hover:underline" type="button">Reset All</button>
</div>
<div className="space-y-6">
{/*  Consultation Type  */}
<div>
<label className="block font-label-md text-label-md text-on-surface mb-3">Consultation Type</label>
<div className="space-y-2">
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input checked className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" name="consult_type" type="radio"/>
<span>All Options</span>
</label>
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" name="consult_type" type="radio"/>
<span className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-base text-primary">videocam</span> Video Call
                </span>
</label>
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" name="consult_type" type="radio"/>
<span className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-base text-primary">call</span> Audio Call
                </span>
</label>
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 text-primary focus:ring-primary border-outline-variant" name="consult_type" type="radio"/>
<span className="flex items-center gap-1.5">
<span className="material-symbols-outlined text-base text-primary">chat</span> Low-data Chat
                </span>
</label>
</div>
</div>
{/*  Availability  */}
<div className="pt-4 border-t border-outline-variant/40">
<label className="block font-label-md text-label-md text-on-surface mb-3">Availability</label>
<div className="space-y-2">
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input checked className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Available Today</span>
</label>
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Available in next 2 hours</span>
</label>
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Weekend</span>
</label>
</div>
</div>
{/*  Language Preference  */}
<div className="pt-4 border-t border-outline-variant/40">
<label className="block font-label-md text-label-md text-on-surface mb-3">Languages Spoken</label>
<div className="grid grid-cols-2 gap-2 text-body-sm font-body-sm text-on-surface-variant">
<label className="flex items-center gap-2 cursor-pointer">
<input checked className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Hindi</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input checked className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>English</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Bengali</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Tamil</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Telugu</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Marathi</span>
</label>
<label className="flex items-center gap-2 cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>Odia</span>
</label>
</div>
</div>
{/*  Fee Range Slider  */}
<div className="pt-4 border-t border-outline-variant/40">
<div className="flex justify-between items-center mb-2">
<label className="font-label-md text-label-md text-on-surface" htmlFor="fee-slider">Consultation Fee</label>
<span className="font-label-sm text-label-sm text-primary font-bold">₹0 - ₹250</span>
</div>
<input className="w-full accent-primary h-2 bg-surface-container rounded-lg cursor-pointer" id="fee-slider" max="1000" min="0" step="50" type="range" value="250"/>
<div className="flex justify-between text-[11px] text-outline mt-1 font-label-sm">
<span>₹0 (Free Camp)</span>
<span>₹500</span>
<span>₹1000+</span>
</div>
</div>
{/*  Experience  */}
<div className="pt-4 border-t border-outline-variant/40">
<label className="block font-label-md text-label-md text-on-surface mb-3">Clinical Experience</label>
<div className="space-y-2">
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>5+ years experience</span>
</label>
<label className="flex items-center gap-3 text-body-sm font-body-sm text-on-surface-variant cursor-pointer">
<input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" type="checkbox"/>
<span>10+ years experience</span>
</label>
</div>
</div>
{/*  Gender Preference  */}
<div className="pt-4 border-t border-outline-variant/40">
<label className="block font-label-md text-label-md text-on-surface mb-3">Doctor Gender</label>
<div className="grid grid-cols-3 gap-2">
<button className="py-2 text-center rounded-lg border border-primary bg-secondary-container/40 text-primary font-label-sm text-label-sm font-bold" type="button">
                Any
              </button>
<button className="py-2 text-center rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm" type="button">
                Female
              </button>
<button className="py-2 text-center rounded-lg border border-outline-variant hover:bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm" type="button">
                Male
              </button>
</div>
</div>
</div>
</aside>
{/*  Doctor Results Column (Col 5-12)  */}
<section className="lg:col-span-8 xl:col-span-9 space-y-5">
{/*  Results Top Meta Bar  */}
<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-2">
<div>
<h3 className="text-headline-sm font-headline-sm text-on-surface">Available Specialists</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing 14 doctors matching your health preferences</p>
</div>
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm text-on-surface-variant">Sort by:</span>
<select className="rounded-lg border-outline-variant py-1.5 pl-3 pr-8 text-label-sm font-label-sm bg-surface text-on-surface focus:ring-primary focus:border-primary">
<option>Next Available Slot</option>
<option>Fee: Low to High</option>
<option>Highest Patient Rating</option>
<option>Years of Experience</option>
</select>
</div>
</div>

{doctors.map(doctor => (
  <article key={doctor.id} className="bg-surface-container-lowest border border-outline-variant/70 rounded-xl p-5 sm:p-6 shadow-sm hover:border-primary/50 transition-all duration-200">
    <div className="flex flex-col sm:flex-row gap-5">
      <div className="flex-shrink-0 flex sm:flex-col items-center gap-3">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/40">
          <img className="w-full h-full object-cover" data-alt="Doctor portrait" src={doctor.img} alt={doctor.name} />
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-label-sm text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-md font-bold">
          <span className="material-symbols-outlined text-xs">verified</span> Verified
        </span>
      </div>
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-title-lg font-title-lg text-on-surface font-bold">{doctor.name}</h4>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{doctor.qualifications}</span>
            </div>
            <p className="text-primary font-label-md text-label-md font-semibold mt-0.5">{doctor.spec}</p>
          </div>
          <div className="sm:text-right">
            <div className="inline-flex sm:flex flex-col items-start sm:items-end">
              <span className="text-headline-sm font-headline-sm text-on-surface font-bold text-primary">₹{doctor.fee}</span>
              <span className="font-label-sm text-label-sm text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded font-semibold">{doctor.feeType}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-body-sm font-body-sm text-on-surface-variant mb-4">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary">work</span>
            {doctor.exp} yrs exp.
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-base text-primary">translate</span>
            {doctor.langs}
          </span>
          <span className="flex items-center gap-1 text-on-surface font-semibold">
            <span className="material-symbols-outlined text-base text-amber-500" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {doctor.rating} <span className="text-on-surface-variant font-normal">({doctor.reviews} reviews)</span>
          </span>
        </div>
        <div className="pt-4 border-t border-outline-variant/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Next Available: <strong className="text-on-surface">{doctor.nextSlot}</strong>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-outline-variant rounded-lg text-primary hover:bg-surface-container font-label-md text-label-md transition-colors" type="button">
              View Profile
            </button>
            <button className="px-5 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm flex items-center gap-1.5" type="button">
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  </article>
))}
</section>
{/*  Pagination Section  */}
<nav aria-label="Doctors pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-outline-variant/40">
<p className="text-body-sm font-body-sm text-on-surface-variant">
            Showing <strong className="text-on-surface font-semibold">1 – 4</strong> of <strong className="text-on-surface font-semibold">14</strong> verified doctors
          </p>
<div className="flex items-center gap-1">
<button className="p-2 rounded-lg border border-outline-variant text-outline opacity-50 cursor-not-allowed" disabled type="button">
<span className="material-symbols-outlined text-lg">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-bold" type="button">
              1
            </button>
<button className="w-10 h-10 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md" type="button">
              2
            </button>
<button className="w-10 h-10 rounded-lg hover:bg-surface-container text-on-surface font-label-md text-label-md" type="button">
              3
            </button>
<button className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container" type="button">
<span className="material-symbols-outlined text-lg">chevron_right</span>
</button>
</div>
</nav>
</div>
</main>
{/*  Web Footer (Shared Component)  */}
<footer className="mt-16 bg-surface-container dark:bg-surface-container-highest border-t border-outline-variant dark:border-on-surface-variant">
<div className="w-full py-8 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
{/*  Legal / Emergency Disclaimer  */}
<div className="max-w-2xl text-left">
<div className="flex items-center gap-2 mb-2">
<span className="text-headline-sm font-headline-sm font-bold text-primary dark:text-inverse-primary">RuralCare Health</span>
<span className="px-2 py-0.5 rounded bg-tertiary/10 text-tertiary font-label-sm text-label-sm font-semibold">National Health Mission Compliant</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant dark:text-inverse-on-surface">
          © 2024 RuralCare Health. Accessible, dignified healthcare for all communities. If you are experiencing a life-threatening medical crisis, please immediately dial 112 or visit your nearest emergency health center.
        </p>
</div>
{/*  Footer Links  */}
<div className="flex flex-wrap gap-x-6 gap-y-2 text-label-sm font-label-sm md:justify-end">
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Privacy Policy</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Terms of Service</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Accessibility Statement</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Clinical Protocols</a>
<a className="text-on-surface-variant dark:text-inverse-on-surface hover:underline hover:text-primary dark:hover:text-inverse-primary transition-colors" href="#">Contact Support</a>
</div>
</div>
</footer>

    </>
  );
}