import Link from "next/link";

const treatments = [
    {
        number: "01",
        title: "Dental Implants",
        text: "Advanced implant solutions designed to restore comfort, function and confidence.",
    },
    {
        number: "02",
        title: "Cosmetic Dentistry",
        text: "Natural-looking aesthetic treatments tailored to your smile and facial features.",
    },
    {
        number: "03",
        title: "Orthodontics",
        text: "Modern alignment solutions for children and adults, including clear aligners.",
    },
    {
        number: "04",
        title: "Preventive Care",
        text: "Regular care and prevention focused on keeping your smile healthy for the long term.",
    },
];

const steps = [
    ["01", "Consultation", "We listen, examine and understand your goals."],
    ["02", "Digital scan", "Precise digital technology replaces unnecessary guesswork."],
    ["03", "Your plan", "A clear treatment plan built around your needs."],
    ["04", "Treatment", "Comfortable care with attention to every detail."],
];

export default function NovaDentShowcase() {
    return (
        <main className="min-h-screen bg-[#F8FAFC] text-[#10223D]">

            {/* BACK TO FORMORA */}
            <Link
                href="/#projects"
                className="group fixed bottom-5 left-5 z-[100] flex items-center gap-2 rounded-full border border-[#10223D]/10 bg-white/90 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#10223D]/60 shadow-xl backdrop-blur-xl transition duration-300 hover:border-[#4B8DFF]/30 hover:text-[#10223D]"
            >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
                Back to FORMORA
            </Link>

            {/* NAV */}
            <header className="absolute left-0 top-0 z-50 w-full">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
                    <a
                        href="#top"
                        className="text-xl font-semibold tracking-[-0.04em] text-[#10223D]"
                    >
                        NOVA<span className="text-[#4B8DFF]">DENT</span>
                    </a>

                    <nav className="hidden items-center gap-8 text-xs font-medium text-[#10223D]/55 md:flex">
                        <a href="#about" className="transition hover:text-[#10223D]">
                            About
                        </a>

                        <a href="#treatments" className="transition hover:text-[#10223D]">
                            Treatments
                        </a>

                        <a href="#technology" className="transition hover:text-[#10223D]">
                            Technology
                        </a>

                        <a href="#prices" className="transition hover:text-[#10223D]">
                            Prices
                        </a>

                        <a href="#contact" className="transition hover:text-[#10223D]">
                            Contact
                        </a>
                    </nav>

                    <a
                        href="#contact"
                        className="rounded-full bg-[#10223D] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#4B8DFF]"
                    >
                        Book a visit
                    </a>
                </div>
            </header>

            {/* HERO */}
            <section
                id="top"
                className="relative min-h-screen overflow-hidden bg-[#EEF5FF]"
            >
                <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative z-10">
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#4B8DFF]/15 bg-white/60 px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#4B8DFF] backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#4B8DFF]" />
                            Modern dental care
                        </div>

                        <h1 className="max-w-2xl text-6xl font-medium leading-[0.94] tracking-[-0.065em] sm:text-7xl lg:text-[88px]">
                            Your smile,
                            <br />
                            <span className="text-[#4B8DFF]">reimagined.</span>
                        </h1>

                        <p className="mt-8 max-w-lg text-base leading-8 text-[#10223D]/50">
                            Modern dentistry built around comfort, precision and natural
                            results. Because exceptional care should feel exceptional too.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <a
                                href="#contact"
                                className="rounded-full bg-[#4B8DFF] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#3479EE]"
                            >
                                Book consultation →
                            </a>

                            <a
                                href="#treatments"
                                className="rounded-full border border-[#10223D]/15 bg-white/50 px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#10223D]/65 transition hover:bg-white"
                            >
                                Explore treatments
                            </a>
                        </div>

                        <div className="mt-14 flex gap-10 border-t border-[#10223D]/10 pt-7">
                            <div>
                                <p className="text-2xl font-semibold tracking-[-0.04em]">
                                    Digital
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#10223D]/35">
                                    Dentistry
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold tracking-[-0.04em]">
                                    Gentle
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#10223D]/35">
                                    Approach
                                </p>
                            </div>

                            <div>
                                <p className="text-2xl font-semibold tracking-[-0.04em]">
                                    Personal
                                </p>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-[#10223D]/35">
                                    Care
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* HERO IMAGE */}
                    <div className="relative">
                        <div className="absolute -left-12 top-20 h-64 w-64 rounded-full bg-[#4B8DFF]/15 blur-3xl" />

                        <div className="relative ml-auto h-[620px] max-w-[560px] overflow-hidden rounded-[42px] bg-white shadow-[0_30px_100px_rgba(31,82,150,0.15)]">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        "url('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=1400&q=90')",
                                }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-[#10223D]/35 via-transparent to-transparent" />

                            <div className="absolute bottom-6 left-6 right-6 rounded-[24px] border border-white/30 bg-white/85 p-5 shadow-xl backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F1FF] text-[#4B8DFF]">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-[#10223D]">
                                            Your comfort comes first.
                                        </p>
                                        <p className="mt-1 text-xs text-[#10223D]/40">
                                            Calm, modern and patient-focused care.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section
                id="about"
                className="mx-auto max-w-7xl px-6 py-28 lg:py-40"
            >
                <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4B8DFF]">
                            About Nova Dent
                        </p>
                    </div>

                    <div>
                        <h2 className="max-w-4xl text-4xl font-medium leading-[1.08] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                            Dentistry can feel
                            <span className="text-[#10223D]/25"> different.</span>
                        </h2>

                        <div className="mt-10 grid gap-8 border-t border-[#10223D]/10 pt-8 md:grid-cols-2">
                            <p className="text-sm leading-7 text-[#10223D]/50">
                                We created NOVA DENT around a simple idea: dental care should
                                combine advanced technology with a calm, human experience.
                            </p>

                            <p className="text-sm leading-7 text-[#10223D]/50">
                                From the first consultation to your final result, every detail
                                is designed to make your visit clear, comfortable and
                                reassuring.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TREATMENTS */}
            <section
                id="treatments"
                className="bg-white"
            >
                <div className="mx-auto max-w-7xl px-6 py-28 lg:py-40">
                    <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4B8DFF]">
                                Treatments
                            </p>

                            <h2 className="mt-6 text-5xl font-medium tracking-[-0.055em] lg:text-7xl">
                                Care for every
                                <br />
                                <span className="text-[#10223D]/25">smile.</span>
                            </h2>
                        </div>

                        <p className="max-w-sm text-sm leading-7 text-[#10223D]/45">
                            Comprehensive dental treatments supported by modern technology
                            and tailored to each patient.
                        </p>
                    </div>

                    <div className="mt-16 grid gap-4 md:grid-cols-2">
                        {treatments.map((treatment) => (
                            <article
                                key={treatment.number}
                                className="group rounded-[28px] border border-[#10223D]/[0.08] bg-[#F8FAFC] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#4B8DFF]/20 hover:shadow-xl"
                            >
                                <div className="flex items-start justify-between">
                  <span className="text-[9px] font-semibold text-[#4B8DFF]">
                    {treatment.number}
                  </span>

                                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#10223D]/10 text-[#10223D]/35 transition group-hover:border-[#4B8DFF] group-hover:bg-[#4B8DFF] group-hover:text-white">
                    ↗
                  </span>
                                </div>

                                <h3 className="mt-16 text-2xl font-medium tracking-[-0.035em]">
                                    {treatment.title}
                                </h3>

                                <p className="mt-4 max-w-sm text-sm leading-7 text-[#10223D]/45">
                                    {treatment.text}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY */}
            <section
                id="technology"
                className="overflow-hidden bg-[#10223D] text-white"
            >
                <div className="mx-auto grid max-w-7xl gap-14 px-6 py-28 lg:grid-cols-2 lg:items-center lg:py-40">
                    <div className="relative min-h-[560px] overflow-hidden rounded-[36px]">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1400&q=90')",
                            }}
                        />

                        <div className="absolute inset-0 bg-[#10223D]/15" />

                        <div className="absolute bottom-6 left-6 rounded-full bg-white px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#10223D]">
                            Digital dentistry
                        </div>
                    </div>

                    <div className="lg:pl-10">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#79A9FF]">
                            Technology
                        </p>

                        <h2 className="mt-7 text-5xl font-medium leading-[1] tracking-[-0.055em] lg:text-7xl">
                            Precision you
                            <br />
                            can feel.
                        </h2>

                        <p className="mt-8 max-w-lg text-sm leading-8 text-white/45">
                            Digital scanning, modern diagnostics and carefully planned
                            treatments help us deliver more predictable results while making
                            the patient experience simpler and more comfortable.
                        </p>

                        <div className="mt-10 grid grid-cols-2 gap-3">
                            {[
                                "3D Digital Scanning",
                                "Digital Planning",
                                "Modern Diagnostics",
                                "Minimally Invasive Care",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                                >
                                    <div className="mb-5 h-1.5 w-1.5 rounded-full bg-[#79A9FF]" />

                                    <p className="text-xs text-white/65">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section id="prices" className="bg-[#F8FAFC]">
                <div className="mx-auto max-w-7xl px-6 py-28 lg:py-40">
                    <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">

                        {/* LEFT */}
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4B8DFF]">
                                Transparent pricing
                            </p>

                            <h2 className="mt-6 text-5xl font-medium leading-[1] tracking-[-0.055em] lg:text-7xl">
                                Clear care.
                                <br />
                                <span className="text-[#10223D]/25">
            Clear prices.
          </span>
                            </h2>

                            <p className="mt-7 max-w-sm text-sm leading-7 text-[#10223D]/45">
                                Every treatment starts with a consultation and a personalized plan.
                                Final costs may vary depending on the complexity of each case.
                            </p>

                            <a
                                href="#contact"
                                className="mt-8 inline-flex rounded-full bg-[#10223D] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-[#4B8DFF]"
                            >
                                Book consultation →
                            </a>
                        </div>

                        {/* PRICE LIST */}
                        <div className="overflow-hidden rounded-[30px] border border-[#10223D]/[0.08] bg-white">

                            {[
                                {
                                    category: "Consultation",
                                    items: [
                                        ["Initial consultation", "150 RON"],
                                        ["Specialist consultation", "200 RON"],
                                        ["Digital treatment planning", "250 RON"],
                                    ],
                                },
                                {
                                    category: "Preventive care",
                                    items: [
                                        ["Professional cleaning", "300 RON"],
                                        ["Airflow treatment", "250 RON"],
                                        ["Fluoride treatment", "150 RON"],
                                    ],
                                },
                                {
                                    category: "Cosmetic dentistry",
                                    items: [
                                        ["Professional whitening", "1,200 RON"],
                                        ["Composite bonding", "from 600 RON"],
                                        ["Ceramic veneer", "from 1,800 RON"],
                                    ],
                                },
                                {
                                    category: "Restorative dentistry",
                                    items: [
                                        ["Composite filling", "from 350 RON"],
                                        ["Ceramic crown", "from 1,500 RON"],
                                        ["Zirconia crown", "from 1,700 RON"],
                                    ],
                                },
                                {
                                    category: "Implantology",
                                    items: [
                                        ["Dental implant", "from 2,500 RON"],
                                        ["Implant crown", "from 1,800 RON"],
                                        ["Implant consultation", "200 RON"],
                                    ],
                                },
                                {
                                    category: "Orthodontics",
                                    items: [
                                        ["Orthodontic consultation", "200 RON"],
                                        ["Fixed braces", "from 2,500 RON"],
                                        ["Clear aligners", "from 7,500 RON"],
                                    ],
                                },
                            ].map((section, index) => (
                                <div
                                    key={section.category}
                                    className={`p-7 md:p-8 ${
                                        index !== 0 ? "border-t border-[#10223D]/[0.08]" : ""
                                    }`}
                                >
                                    <div className="mb-6 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEF5FF] text-[8px] font-semibold text-[#4B8DFF]">
                {String(index + 1).padStart(2, "0")}
              </span>

                                        <h3 className="text-lg font-medium tracking-[-0.025em]">
                                            {section.category}
                                        </h3>
                                    </div>

                                    <div>
                                        {section.items.map(([service, price], itemIndex) => (
                                            <div
                                                key={service}
                                                className={`flex items-center justify-between gap-6 py-4 ${
                                                    itemIndex !== section.items.length - 1
                                                        ? "border-b border-[#10223D]/[0.06]"
                                                        : ""
                                                }`}
                                            >
                                                <p className="text-sm text-[#10223D]/55">
                                                    {service}
                                                </p>

                                                <p className="whitespace-nowrap text-sm font-semibold text-[#10223D]">
                                                    {price}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className="border-t border-[#10223D]/[0.08] bg-[#EEF5FF] px-7 py-5 md:px-8">
                                <p className="text-[10px] leading-5 text-[#10223D]/40">
                                    * Prices shown are indicative. A final treatment plan and exact
                                    cost are provided after consultation.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="mx-auto max-w-7xl px-6 py-28 lg:py-40">
                <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#4B8DFF]">
                        Your visit
                    </p>

                    <h2 className="mt-6 text-5xl font-medium tracking-[-0.055em] lg:text-7xl">
                        Simple by design.
                    </h2>
                </div>

                <div className="mt-16 grid gap-3 md:grid-cols-4">
                    {steps.map(([number, title, text]) => (
                        <div
                            key={number}
                            className="rounded-[26px] border border-[#10223D]/[0.08] bg-white p-7"
                        >
              <span className="text-[9px] font-semibold text-[#4B8DFF]">
                {number}
              </span>

                            <h3 className="mt-12 text-xl font-medium tracking-[-0.03em]">
                                {title}
                            </h3>

                            <p className="mt-4 text-xs leading-6 text-[#10223D]/40">
                                {text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section
                id="contact"
                className="px-6 pb-6"
            >
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] bg-[#4B8DFF] px-7 py-20 text-center text-white md:px-12 md:py-28">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                        Ready when you are
                    </p>

                    <h2 className="mx-auto mt-7 max-w-4xl text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl lg:text-8xl">
                        Your new smile
                        <br />
                        starts here.
                    </h2>

                    <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-white/65">
                        Schedule a consultation and discover a more comfortable approach
                        to modern dentistry.
                    </p>

                    <a
                        href="mailto:hello@example.com"
                        className="mt-9 inline-flex rounded-full bg-white px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#10223D] transition hover:scale-[1.03]"
                    >
                        Book consultation →
                    </a>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <div className="mx-auto max-w-7xl px-6 py-14">
                    <div className="grid gap-10 md:grid-cols-3">
                        <div>
                            <p className="text-xl font-semibold tracking-[-0.04em]">
                                NOVA<span className="text-[#4B8DFF]">DENT</span>
                            </p>

                            <p className="mt-4 max-w-xs text-xs leading-6 text-[#10223D]/35">
                                Modern dental care designed around you.
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#10223D]/30">
                                Clinic
                            </p>

                            <p className="mt-4 text-sm leading-7 text-[#10223D]/50">
                                Cluj-Napoca
                                <br />
                                Romania
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-[#10223D]/30">
                                Contact
                            </p>

                            <p className="mt-4 text-sm leading-7 text-[#10223D]/50">
                                hello@example.com
                                <br />
                                +40 700 000 000
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-col gap-5 border-t border-[#10223D]/10 pt-7 text-[9px] uppercase tracking-[0.17em] text-[#10223D]/25 sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 NOVA DENT</p>

                        <Link
                            href="/#projects"
                            className="transition hover:text-[#4B8DFF]"
                        >
                            A showcase by FORMORA →
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}