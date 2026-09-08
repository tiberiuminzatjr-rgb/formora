"use client";

import Link from "next/link";
import { useState } from "react";

const services = [
    {
        number: "01",
        title: "Oil & Filters",
        description:
            "Engine oil, oil filter, air filter and complete fluid inspection.",
        price: "from 349 RON",
    },
    {
        number: "02",
        title: "Diagnostics",
        description:
            "Computer diagnostics, fault-code analysis and complete vehicle check.",
        price: "from 149 RON",
    },
    {
        number: "03",
        title: "Brakes",
        description:
            "Brake pads, discs, fluid and complete braking-system inspection.",
        price: "from 299 RON",
    },
    {
        number: "04",
        title: "Air Conditioning",
        description:
            "AC inspection, refrigerant recharge and system performance check.",
        price: "from 199 RON",
    },
    {
        number: "05",
        title: "Suspension",
        description:
            "Suspension, steering and chassis inspection with clear recommendations.",
        price: "from 149 RON",
    },
    {
        number: "06",
        title: "Pre-Purchase Check",
        description:
            "A detailed inspection before you buy your next car.",
        price: "from 399 RON",
    },
];

const carNeeds = [
    {
        id: "warning",
        label: "Warning light",
        title: "Warning light on?",
        text: "Start with a complete computer diagnostic. We identify the fault before replacing parts.",
        action: "Book diagnostics",
    },
    {
        id: "brakes",
        label: "Brake problem",
        title: "Noise or vibration?",
        text: "We inspect pads, discs, brake fluid and the complete braking system.",
        action: "Check my brakes",
    },
    {
        id: "service",
        label: "Regular service",
        title: "Time for maintenance?",
        text: "Oil, filters, fluids and a complete visual inspection in one visit.",
        action: "Book service",
    },
    {
        id: "unknown",
        label: "Not sure",
        title: "Something feels wrong?",
        text: "Tell us what you notice. We will inspect the vehicle and recommend the next step.",
        action: "Request inspection",
    },
];

export default function AutoServiceShowcase() {
    const [selectedNeed, setSelectedNeed] = useState("warning");
    const [bookingSent, setBookingSent] = useState(false);

    const activeNeed =
        carNeeds.find((item) => item.id === selectedNeed) ?? carNeeds[0];

    function handleBooking(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBookingSent(true);
    }

    return (
        <main className="min-h-screen bg-[#0A0A0B] text-white">
            {/* BACK TO FORMORA */}
            <Link
                href="/#projects"
                className="group fixed bottom-5 left-5 z-[100] flex items-center gap-2 rounded-full border border-white/10 bg-black/80 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/60 shadow-2xl backdrop-blur-xl transition duration-300 hover:border-red-500/40 hover:text-white"
            >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
                Back to FORMORA
            </Link>

            {/* NAVIGATION */}
            <header className="absolute left-0 top-0 z-50 w-full">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <a
                        href="#top"
                        className="text-lg font-black tracking-[-0.04em] text-white"
                    >
                        APEX<span className="text-red-500">AUTO.</span>
                    </a>

                    <nav className="hidden items-center gap-8 text-[10px] font-medium uppercase tracking-[0.17em] text-white/50 md:flex">
                        <a href="#services" className="transition hover:text-white">
                            Services
                        </a>

                        <a href="#diagnostic" className="transition hover:text-white">
                            Diagnose
                        </a>

                        <a href="#about" className="transition hover:text-white">
                            About
                        </a>

                        <a href="#contact" className="transition hover:text-white">
                            Contact
                        </a>
                    </nav>

                    <a
                        href="#booking"
                        className="bg-red-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-600"
                    >
                        Book service
                    </a>
                </div>
            </header>

            {/* HERO */}
            <section
                id="top"
                className="relative flex min-h-screen items-end overflow-hidden bg-black"
            >
                <div
                    className="absolute inset-0 scale-105 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=2400&q=90')",
                    }}
                />

                <div className="absolute inset-0 bg-black/55" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/25" />

                <div className="relative mx-auto w-full max-w-7xl px-6 pb-14 pt-40">
                    <div className="max-w-5xl">
                        <div className="mb-7 flex items-center gap-3">
                            <span className="h-[2px] w-8 bg-red-500" />

                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-red-400">
                                Automotive service · Cluj-Napoca
                            </p>
                        </div>

                        <h1 className="text-[16vw] font-black leading-[0.76] tracking-[-0.075em] sm:text-8xl lg:text-[130px]">
                            DRIVE.
                            <br />
                            <span className="text-white/30">WE&apos;LL FIX.</span>
                        </h1>

                        <div className="mt-12 grid gap-8 border-t border-white/15 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
                            <div>
                                <p className="max-w-lg text-sm leading-7 text-white/50">
                                    Modern vehicle maintenance, diagnostics and repairs with
                                    clear pricing and no unnecessary work.
                                </p>

                                <div className="mt-7 flex flex-wrap gap-3">
                                    <a
                                        href="#booking"
                                        className="bg-red-500 px-6 py-4 text-[9px] font-bold uppercase tracking-[0.17em] transition hover:bg-red-600"
                                    >
                                        Book your car →
                                    </a>

                                    <a
                                        href="#services"
                                        className="border border-white/20 bg-white/[0.04] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.17em] text-white/70 backdrop-blur transition hover:bg-white hover:text-black"
                                    >
                                        View services
                                    </a>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8">
                                <div>
                                    <p className="text-2xl font-bold">MON–FRI</p>
                                    <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/30">
                                        08:00–18:00
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold">SAT</p>
                                    <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/30">
                                        09:00–14:00
                                    </p>
                                </div>

                                <div>
                                    <p className="text-2xl font-bold text-red-400">24H</p>
                                    <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-white/30">
                                        Booking
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST STRIP */}
            <section className="border-b border-white/10 bg-[#0E0E10]">
                <div className="border-t border-white/10">
                    <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 text-xs uppercase tracking-[0.18em] text-white/30 sm:flex-row sm:items-center sm:justify-between">
                        <span>Diagnostics · Maintenance · Repairs</span>

                        <span className="text-red-400">
      Cluj-Napoca
    </span>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section
                id="services"
                className="mx-auto max-w-7xl px-6 py-28 lg:py-40"
            >
                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500">
                            Services & prices
                        </p>

                        <h2 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                            Everything your
                            <br />
                            <span className="text-white/25">car needs.</span>
                        </h2>
                    </div>

                    <p className="max-w-sm text-sm leading-7 text-white/35">
                        Straightforward maintenance and repairs. We inspect first, explain
                        the problem and confirm the work before we begin.
                    </p>
                </div>

                <div className="mt-16 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <article
                            key={service.number}
                            className="group bg-[#0A0A0B] p-7 transition duration-300 hover:bg-[#111114]"
                        >
                            <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold text-red-500">
                  {service.number}
                </span>

                                <span className="text-lg text-white/20 transition group-hover:text-red-500">
                  ↗
                </span>
                            </div>

                            <h3 className="mt-14 text-2xl font-semibold tracking-[-0.035em]">
                                {service.title}
                            </h3>

                            <p className="mt-4 min-h-[72px] text-sm leading-7 text-white/35">
                                {service.description}
                            </p>

                            <div className="mt-8 border-t border-white/10 pt-5">
                                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">
                                    {service.price}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>

                <p className="mt-5 text-[10px] leading-5 text-white/25">
                    * Prices are indicative and shown for demonstration purposes. Final
                    cost depends on the vehicle and required work.
                </p>
            </section>

            {/* INTERACTIVE DIAGNOSTIC */}
            <section id="diagnostic" className="bg-[#F0F0ED] text-[#111]">
                <div className="mx-auto max-w-7xl px-6 py-28 lg:py-40">
                    <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-red-500">
                                Quick diagnostic
                            </p>

                            <h2 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.06em] lg:text-7xl">
                                What does your
                                <br />
                                car need?
                            </h2>

                            <p className="mt-7 max-w-sm text-sm leading-7 text-black/45">
                                Choose what best describes the problem and we&apos;ll suggest
                                the right place to start.
                            </p>
                        </div>

                        <div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {carNeeds.map((item) => (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedNeed(item.id)}
                                        className={`p-5 text-left text-sm font-semibold transition ${
                                            selectedNeed === item.id
                                                ? "bg-[#111] text-white"
                                                : "border border-black/10 bg-white text-black/55 hover:border-black/25"
                                        }`}
                                    >
                    <span
                        className={`mr-3 inline-block h-2 w-2 rounded-full ${
                            selectedNeed === item.id
                                ? "bg-red-500"
                                : "bg-black/15"
                        }`}
                    />

                                        {item.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-3 bg-white p-8 shadow-[0_30px_80px_rgba(0,0,0,0.08)] md:p-10">
                                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                                    Recommended
                                </p>

                                <h3 className="mt-5 text-3xl font-bold tracking-[-0.045em]">
                                    {activeNeed.title}
                                </h3>

                                <p className="mt-4 max-w-lg text-sm leading-7 text-black/45">
                                    {activeNeed.text}
                                </p>

                                <a
                                    href="#booking"
                                    className="mt-8 inline-flex bg-red-500 px-6 py-4 text-[9px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-red-600"
                                >
                                    {activeNeed.action} →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section id="about" className="overflow-hidden bg-[#0E0E10]">
                <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
                    <div className="relative min-h-[550px] lg:min-h-[700px]">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=1600&q=90')",
                            }}
                        />

                        <div className="absolute inset-0 bg-black/20" />

                        <div className="absolute bottom-6 left-6 bg-red-500 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.17em]">
                            Workshop standard
                        </div>
                    </div>

                    <div className="flex items-center px-6 py-20 lg:px-16">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500">
                                Why Apex Auto
                            </p>

                            <h2 className="mt-7 text-5xl font-bold leading-[0.95] tracking-[-0.06em] lg:text-7xl">
                                No mystery.
                                <br />
                                <span className="text-white/25">Just good work.</span>
                            </h2>

                            <p className="mt-8 max-w-lg text-sm leading-8 text-white/40">
                                Car repairs shouldn&apos;t be confusing. We diagnose the
                                problem, show you what needs attention and agree on the work
                                before touching your vehicle.
                            </p>

                            <div className="mt-10 grid grid-cols-2 gap-px bg-white/10">
                                {[
                                    ["01", "Inspect first"],
                                    ["02", "Explain clearly"],
                                    ["03", "Approve work"],
                                    ["04", "Get back driving"],
                                ].map(([number, title]) => (
                                    <div key={number} className="bg-[#0E0E10] p-5">
                                        <span className="text-[8px] text-red-500">{number}</span>

                                        <p className="mt-6 text-sm font-semibold text-white/70">
                                            {title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BOOKING */}
            <section
                id="booking"
                className="bg-red-500 text-white"
            >
                <div className="mx-auto grid max-w-7xl gap-14 px-6 py-28 lg:grid-cols-[0.8fr_1.2fr] lg:py-40">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-black/45">
                            Online booking
                        </p>

                        <h2 className="mt-6 text-5xl font-black leading-[0.9] tracking-[-0.065em] lg:text-7xl">
                            BOOK YOUR
                            <br />
                            SERVICE.
                        </h2>

                        <p className="mt-7 max-w-sm text-sm leading-7 text-white/70">
                            Send us your vehicle details and preferred date. We&apos;ll get
                            back to you to confirm the appointment.
                        </p>

                        <div className="mt-10 border-t border-black/15 pt-7">
                            <p className="text-[9px] uppercase tracking-[0.17em] text-black/45">
                                Workshop
                            </p>

                            <p className="mt-3 text-sm font-semibold">
                                Cluj-Napoca · Romania
                            </p>

                            <p className="mt-1 text-sm text-white/70">
                                Mon–Fri 08:00–18:00 · Sat 09:00–14:00
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#0A0A0B] p-7 text-white shadow-2xl md:p-10">
                        {bookingSent ? (
                            <div className="flex min-h-[440px] flex-col items-center justify-center text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-2xl">
                                    ✓
                                </div>

                                <p className="mt-7 text-[9px] font-bold uppercase tracking-[0.2em] text-red-500">
                                    Request received
                                </p>

                                <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em]">
                                    We&apos;ll take it from here.
                                </h3>

                                <p className="mt-4 max-w-sm text-sm leading-7 text-white/35">
                                    This is a showcase booking form. On a production website,
                                    the request could be sent directly to the workshop.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setBookingSent(false)}
                                    className="mt-8 border border-white/15 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-white/60 transition hover:border-white/30 hover:text-white"
                                >
                                    New booking
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking}>
                                <div className="mb-9 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-red-500">
                                            Appointment request
                                        </p>

                                        <h3 className="mt-2 text-2xl font-bold tracking-[-0.035em]">
                                            Tell us about your car.
                                        </h3>
                                    </div>

                                    <span className="text-2xl text-white/15">01</span>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <label className="block">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                      Your name
                    </span>

                                        <input
                                            required
                                            type="text"
                                            placeholder="John Smith"
                                            className="mt-2 w-full border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-red-500"
                                        />
                                    </label>

                                    <label className="block">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                      Phone
                    </span>

                                        <input
                                            required
                                            type="tel"
                                            placeholder="+40 700 000 000"
                                            className="mt-2 w-full border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-red-500"
                                        />
                                    </label>

                                    <label className="block">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                      Vehicle
                    </span>

                                        <input
                                            required
                                            type="text"
                                            placeholder="BMW 320d"
                                            className="mt-2 w-full border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-red-500"
                                        />
                                    </label>

                                    <label className="block">
                    <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                      Preferred date
                    </span>

                                        <input
                                            required
                                            type="date"
                                            className="mt-2 w-full border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/70 outline-none transition focus:border-red-500"
                                        />
                                    </label>
                                </div>

                                <label className="mt-5 block">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                    What can we help with?
                  </span>

                                    <select
                                        defaultValue=""
                                        required
                                        className="mt-2 w-full border border-white/10 bg-[#101012] px-4 py-4 text-sm text-white/70 outline-none transition focus:border-red-500"
                                    >
                                        <option value="" disabled>
                                            Select a service
                                        </option>
                                        <option>Regular service</option>
                                        <option>Diagnostics</option>
                                        <option>Brakes</option>
                                        <option>Air conditioning</option>
                                        <option>Suspension</option>
                                        <option>Pre-purchase inspection</option>
                                        <option>Other</option>
                                    </select>
                                </label>

                                <label className="mt-5 block">
                  <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
                    Details
                  </span>

                                    <textarea
                                        rows={4}
                                        placeholder="Tell us what you've noticed..."
                                        className="mt-2 w-full resize-none border border-white/10 bg-white/[0.04] px-4 py-4 text-sm outline-none transition placeholder:text-white/20 focus:border-red-500"
                                    />
                                </label>

                                <button
                                    type="submit"
                                    className="mt-6 w-full bg-red-500 px-6 py-4 text-[9px] font-bold uppercase tracking-[0.18em] transition hover:bg-red-600"
                                >
                                    Request appointment →
                                </button>

                                <p className="mt-4 text-center text-[9px] text-white/20">
                                    Demo form · No appointment will actually be submitted.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section id="contact" className="bg-[#0A0A0B]">
                <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-end">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-500">
                                Visit the workshop
                            </p>

                            <h2 className="mt-6 text-5xl font-bold tracking-[-0.06em] lg:text-7xl">
                                LET&apos;S GET YOU
                                <br />
                                <span className="text-white/25">BACK ON THE ROAD.</span>
                            </h2>
                        </div>

                        <div className="grid gap-7 sm:grid-cols-2">
                            <div className="border-t border-white/10 pt-5">
                                <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                                    Contact
                                </p>

                                <p className="mt-4 text-sm leading-7 text-white/60">
                                    service@example.com
                                    <br />
                                    +40 700 000 000
                                </p>
                            </div>

                            <div className="border-t border-white/10 pt-5">
                                <p className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                                    Opening hours
                                </p>

                                <p className="mt-4 text-sm leading-7 text-white/60">
                                    Mon–Fri · 08:00–18:00
                                    <br />
                                    Saturday · 09:00–14:00
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-[#080809]">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-lg font-black tracking-[-0.04em]">
                                APEX<span className="text-red-500">AUTO.</span>
                            </p>

                            <p className="mt-4 max-w-xs text-xs leading-6 text-white/25">
                                Automotive service, diagnostics and repairs.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-6 text-[9px] uppercase tracking-[0.16em] text-white/30">
                            <a href="#services" className="transition hover:text-white">
                                Services
                            </a>

                            <a href="#diagnostic" className="transition hover:text-white">
                                Diagnose
                            </a>

                            <a href="#booking" className="transition hover:text-white">
                                Booking
                            </a>

                            <a href="#contact" className="transition hover:text-white">
                                Contact
                            </a>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 text-[9px] uppercase tracking-[0.17em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 APEX AUTO · Showcase concept</p>

                        <Link
                            href="/#projects"
                            className="transition hover:text-red-400"
                        >
                            A showcase by FORMORA →
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}