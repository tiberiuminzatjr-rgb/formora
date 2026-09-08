import Link from "next/link";

const projects = [
    {
        number: "01",
        title: "Atria Residence",
        type: "Residential",
        location: "Cluj-Napoca",
        image:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
    },
    {
        number: "02",
        title: "North Office",
        type: "Commercial",
        location: "Bucharest",
        image:
            "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1600&q=90",
    },
    {
        number: "03",
        title: "Concrete House",
        type: "Residential",
        location: "Brașov",
        image:
            "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=90",
    },
];

const services = [
    ["01", "General Construction"],
    ["02", "Architecture & Design"],
    ["03", "Project Management"],
    ["04", "Renovation"],
];

export default function NorthbuildShowcase() {
    return (
        <main className="min-h-screen bg-[#F1F0EC] text-[#111111]">

            {/* BACK TO FORMORA */}
            <Link
                href="/#projects"
                className="group fixed bottom-5 left-5 z-[100] flex items-center gap-2 rounded-full border border-white/15 bg-black/80 px-4 py-2.5 text-[10px] font-medium uppercase tracking-[0.15em] text-white/70 shadow-2xl backdrop-blur-xl transition duration-300 hover:border-[#FF5C35]/50 hover:bg-black hover:text-white"
            >
        <span className="transition-transform duration-300 group-hover:-translate-x-1">
          ←
        </span>
                Back to FORMORA
            </Link>

            {/* NAVIGATION */}
            <header className="absolute left-0 top-0 z-50 w-full">
                <div className="mx-auto flex max-w-[1500px] items-center justify-between px-6 py-7 lg:px-10">
                    <a
                        href="#top"
                        className="text-lg font-bold tracking-[-0.04em] text-white"
                    >
                        NORTHBUILD<span className="text-[#FF5C35]">.</span>
                    </a>

                    <nav className="hidden items-center gap-9 text-[10px] uppercase tracking-[0.18em] text-white/60 md:flex">
                        <a href="#projects" className="transition hover:text-white">
                            Projects
                        </a>

                        <a href="#about" className="transition hover:text-white">
                            Studio
                        </a>

                        <a href="#services" className="transition hover:text-white">
                            Services
                        </a>

                        <a href="#contact" className="transition hover:text-white">
                            Contact
                        </a>
                    </nav>

                    <a
                        href="#contact"
                        className="border border-white/40 px-5 py-3 text-[9px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                    >
                        Start a project
                    </a>
                </div>
            </header>

            {/* HERO */}
            <section
                id="top"
                className="relative flex min-h-screen items-end overflow-hidden bg-[#111]"
            >
                <div
                    className="absolute inset-0 scale-105 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=90')",
                    }}
                />

                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30" />

                <div className="relative mx-auto w-full max-w-[1500px] px-6 pb-12 text-white lg:px-10 lg:pb-16">
                    <p className="mb-6 text-[10px] font-medium uppercase tracking-[0.35em] text-[#FF7655]">
                        Architecture · Construction · Engineering
                    </p>

                    <h1 className="max-w-6xl text-[15vw] font-semibold leading-[0.75] tracking-[-0.075em] sm:text-8xl lg:text-[145px]">
                        WE BUILD
                        <br />
                        <span className="text-white/45">FORWARD.</span>
                    </h1>

                    <div className="mt-12 grid gap-7 border-t border-white/25 pt-6 md:grid-cols-[1fr_auto] md:items-end">
                        <p className="max-w-lg text-sm leading-7 text-white/55">
                            Buildings designed for today and engineered for what comes next.
                            From first sketch to final structure.
                        </p>

                        <a
                            href="#projects"
                            className="text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:text-white"
                        >
                            Selected projects ↓
                        </a>
                    </div>
                </div>
            </section>

            {/* INTRO */}
            <section
                id="about"
                className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-40"
            >
                <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF5C35]">
                            Northbuild / Studio
                        </p>
                    </div>

                    <div>
                        <h2 className="max-w-5xl text-4xl font-medium leading-[1.08] tracking-[-0.05em] sm:text-5xl lg:text-7xl">
                            We turn complex ideas into
                            <span className="text-black/30"> enduring spaces.</span>
                        </h2>

                        <div className="mt-12 grid gap-8 border-t border-black/15 pt-8 md:grid-cols-2">
                            <p className="max-w-md text-sm leading-7 text-black/50">
                                NORTHBUILD brings architecture, engineering and construction
                                together under one roof. One team. One vision. One accountable
                                partner from concept to completion.
                            </p>

                            <p className="max-w-md text-sm leading-7 text-black/50">
                                Our work is driven by precision, honest materials and a belief
                                that good buildings should become better with time.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* NUMBERS */}
            <section className="border-y border-black/15">
                <div className="mx-auto grid max-w-[1500px] grid-cols-2 px-6 lg:grid-cols-4 lg:px-10">
                    {[
                        ["18+", "Years experience"],
                        ["146", "Projects delivered"],
                        ["32", "Active sites"],
                        ["11", "Industry awards"],
                    ].map(([number, label], index) => (
                        <div
                            key={label}
                            className={`py-10 md:py-14 ${
                                index % 2 === 0 ? "border-r border-black/15" : ""
                            } ${
                                index < 2
                                    ? "border-b border-black/15 lg:border-b-0"
                                    : ""
                            } ${
                                index === 1 ? "lg:border-r" : ""
                            } ${
                                index === 2 ? "lg:border-r" : ""
                            } px-4 md:px-8`}
                        >
                            <p className="text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
                                {number}
                            </p>

                            <p className="mt-3 text-[9px] uppercase tracking-[0.2em] text-black/35">
                                {label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROJECTS */}
            <section
                id="projects"
                className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-40"
            >
                <div className="mb-16 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF5C35]">
                            Selected work
                        </p>

                        <h2 className="mt-6 text-5xl font-medium tracking-[-0.06em] md:text-7xl">
                            Projects.
                        </h2>
                    </div>

                    <p className="max-w-sm text-sm leading-7 text-black/45">
                        Residential, commercial and mixed-use spaces shaped by context,
                        purpose and lasting value.
                    </p>
                </div>

                <div className="space-y-16">
                    {projects.map((project) => (
                        <article key={project.number} className="group">
                            <div className="relative h-[60vh] min-h-[450px] overflow-hidden bg-black/10">
                                <div
                                    className="absolute inset-0 scale-[1.03] bg-cover bg-center transition duration-1000 group-hover:scale-100"
                                    style={{
                                        backgroundImage: `url('${project.image}')`,
                                    }}
                                />

                                <div className="absolute inset-0 bg-black/10 transition group-hover:bg-black/20" />

                                <div className="absolute right-6 top-6 flex h-12 w-12 items-center justify-center bg-[#F1F0EC] text-lg transition duration-300 group-hover:bg-[#FF5C35] group-hover:text-white">
                                    ↗
                                </div>
                            </div>

                            <div className="grid gap-5 border-b border-black/15 py-7 md:grid-cols-[60px_1fr_auto] md:items-end">
                <span className="text-[10px] text-black/35">
                  {project.number}
                </span>

                                <div>
                                    <h3 className="text-3xl font-medium tracking-[-0.04em] md:text-4xl">
                                        {project.title}
                                    </h3>

                                    <p className="mt-2 text-xs text-black/40">
                                        {project.type}
                                    </p>
                                </div>

                                <p className="text-xs uppercase tracking-[0.15em] text-black/40">
                                    {project.location}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* SERVICES */}
            <section id="services" className="bg-[#111111] text-white">
                <div className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-40">
                    <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF7655]">
                                What we do
                            </p>

                            <h2 className="mt-7 text-5xl font-medium tracking-[-0.055em] md:text-7xl">
                                Built from
                                <br />
                                the ground up.
                            </h2>
                        </div>

                        <div className="border-t border-white/20">
                            {services.map(([number, service]) => (
                                <div
                                    key={number}
                                    className="group grid grid-cols-[45px_1fr_auto] items-center border-b border-white/15 py-7 md:py-9"
                                >
                  <span className="text-[9px] text-white/25">
                    {number}
                  </span>

                                    <p className="text-xl font-medium tracking-[-0.025em] md:text-3xl">
                                        {service}
                                    </p>

                                    <span className="text-lg text-white/25 transition group-hover:text-[#FF7655]">
                    ↗
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-40">
                <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
                    <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#FF5C35]">
                            Our process
                        </p>

                        <h2 className="mt-7 text-5xl font-medium tracking-[-0.055em] md:text-7xl">
                            From idea
                            <br />
                            to structure.
                        </h2>
                    </div>

                    <div className="grid gap-px bg-black/15 sm:grid-cols-2">
                        {[
                            [
                                "01",
                                "Discover",
                                "We understand the site, the ambition and the constraints.",
                            ],
                            [
                                "02",
                                "Design",
                                "Architecture and engineering develop together from day one.",
                            ],
                            [
                                "03",
                                "Build",
                                "Precise execution, transparent communication and control.",
                            ],
                            [
                                "04",
                                "Deliver",
                                "A finished space built to perform for years to come.",
                            ],
                        ].map(([number, title, text]) => (
                            <div
                                key={number}
                                className="bg-[#F1F0EC] p-7 md:p-9"
                            >
                <span className="text-[9px] text-[#FF5C35]">
                  {number}
                </span>

                                <h3 className="mt-10 text-2xl font-medium tracking-[-0.035em]">
                                    {title}
                                </h3>

                                <p className="mt-4 max-w-xs text-sm leading-7 text-black/45">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section
                id="contact"
                className="relative overflow-hidden bg-[#FF5C35] text-black"
            >
                <div className="mx-auto max-w-[1500px] px-6 py-28 lg:px-10 lg:py-40">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/50">
                        Have a project?
                    </p>

                    <div className="mt-8 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                        <h2 className="max-w-5xl text-6xl font-semibold leading-[0.86] tracking-[-0.07em] sm:text-7xl lg:text-[110px]">
                            LET&apos;S BUILD
                            <br />
                            SOMETHING.
                        </h2>

                        <div>
                            <p className="max-w-sm text-sm leading-7 text-black/60">
                                Tell us about your next project. From new developments to
                                complex renovations, our team is ready to build.
                            </p>

                            <a
                                href="mailto:projects@example.com"
                                className="mt-8 inline-flex border border-black bg-black px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-transparent hover:text-black"
                            >
                                Start a conversation ↗
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-[#111111] text-white">
                <div className="mx-auto max-w-[1500px] px-6 py-14 lg:px-10">
                    <div className="grid gap-12 md:grid-cols-3">
                        <div>
                            <p className="text-xl font-bold tracking-[-0.04em]">
                                NORTHBUILD<span className="text-[#FF5C35]">.</span>
                            </p>

                            <p className="mt-5 max-w-xs text-xs leading-6 text-white/30">
                                Architecture, construction and engineering for spaces built
                                to last.
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                                Office
                            </p>

                            <p className="mt-5 text-sm leading-7 text-white/50">
                                Cluj-Napoca
                                <br />
                                Romania
                            </p>
                        </div>

                        <div>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                                Contact
                            </p>

                            <p className="mt-5 text-sm leading-7 text-white/50">
                                projects@example.com
                                <br />
                                +40 700 000 000
                            </p>
                        </div>
                    </div>

                    <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center sm:justify-between">
                        <p>© 2026 NORTHBUILD</p>

                        <Link
                            href="/#projects"
                            className="transition hover:text-[#FF7655]"
                        >
                            A showcase by FORMORA →
                        </Link>
                    </div>
                </div>
            </footer>
        </main>
    );
}