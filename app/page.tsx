import QuoteForm from "./components/QuoteForm";

export default function Home() {
  return (
      <main className="min-h-screen bg-[#0B0B0D] text-white">
        <header className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <a href="#" className="text-2xl font-semibold tracking-[0.2em]">
              FORMORA
            </a>

            <nav className="hidden items-center gap-8 text-sm text-white/70 md:flex">
              <a href="#services" className="transition hover:text-white">
                Services
              </a>
              <a href="#projects" className="transition hover:text-white">
                Projects
              </a>
              <a href="#about" className="transition hover:text-white">
                About
              </a>
              <a href="#contact" className="transition hover:text-white">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                  href="/client/login"
                  className="hidden rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-white sm:inline-flex"
              >
                Client Portal
              </a>

              <a
                  href="#contact"
                  className="rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:scale-[1.03]"
              >
                Start a project
              </a>
            </div>
          </div>
        </header>

        <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
            <div className="absolute right-0 top-1/2 h-[350px] w-[350px] rounded-full bg-blue-400/10 blur-[120px]" />
          </div>

          <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="mb-6 text-sm uppercase tracking-[0.35em] text-blue-400">
                Web Development · 3D Scanning · 3D Printing
              </p>

              <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Digital ideas.
                <br />
                <span className="text-white/45">Made real.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
                We build modern digital experiences and turn physical ideas into
                precise, functional objects.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                    href="#contact"
                    className="rounded-full bg-blue-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:scale-[1.03] hover:bg-blue-400"
                >
                  Start a project
                </a>

                <a
                    href="#services"
                    className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
                >
                  Explore services
                </a>
              </div>
            </div>

            <div className="relative mx-auto flex h-[420px] w-full max-w-xl items-center justify-center">
              <div className="absolute h-72 w-72 rounded-[32%] border border-blue-400/30 bg-gradient-to-br from-white/10 to-blue-500/10 shadow-2xl shadow-blue-500/10 backdrop-blur-2xl rotate-12" />

              <div className="absolute h-64 w-64 rounded-[32%] border border-white/10 bg-black/50 backdrop-blur-xl -rotate-6" />

              <div className="relative z-10 text-center">
                <div className="text-8xl font-bold tracking-tighter text-white">
                  F
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.5em] text-blue-400">
                  Formora
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.35em] text-white/30">
            Scroll to explore
          </div>
        </section>
        <section
            id="services"
            className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0D] px-6 py-32"
        >
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/[0.06] blur-[140px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-24 grid gap-10 lg:grid-cols-[1fr_0.6fr] lg:items-end">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                  What we do
                </p>

                <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  One studio.
                  <br />
                  <span className="text-white/35">
            Digital and physical.
          </span>
                </h2>
              </div>

              <p className="max-w-md text-base leading-7 text-white/45">
                FORMORA combines digital experiences, reverse engineering and
                additive manufacturing into one complete workflow.
              </p>
            </div>

            {/* WEB DEVELOPMENT */}
            <article className="group grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex min-h-[520px] flex-col justify-between p-8 md:p-12">
                <div className="flex items-center justify-between">
          <span className="text-sm text-white/25">
            01
          </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-blue-400">
            Digital
          </span>
                </div>

                <div>
                  <h3 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
                    Web Development
                  </h3>

                  <p className="mt-6 max-w-lg text-base leading-7 text-white/45">
                    We build and redesign modern websites for businesses that
                    want a stronger, faster and more credible digital presence.
                  </p>

                  <a
                      href="#contact"
                      className="mt-8 inline-flex items-center gap-3 text-sm text-white transition group-hover:text-blue-400"
                  >
                    Explore Web Development
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <div className="relative min-h-[520px] overflow-hidden border-t border-white/10 bg-[#111318] p-6 lg:border-l lg:border-t-0">
                <div className="absolute right-[-80px] top-[-100px] h-80 w-80 rounded-full bg-blue-600/20 blur-[100px]" />

                <div className="relative h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#08090B] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div className="flex gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    </div>

                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
              Website redesign
            </span>
                  </div>

                  <div className="p-8">
                    <p className="mb-5 text-xs uppercase tracking-[0.28em] text-blue-400">
                      Before → After
                    </p>

                    <h4 className="max-w-md text-4xl font-medium leading-tight text-white">
                      Outdated online presence.
                      <br />
                      <span className="text-white/35">
                Rebuilt for today.
              </span>
                    </h4>

                    <div className="mt-10 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-white/25">
                  Before
                </span>

                        <div className="mt-6 space-y-3">
                          <div className="h-4 w-2/3 rounded bg-white/10" />
                          <div className="h-3 rounded bg-white/5" />
                          <div className="h-3 w-4/5 rounded bg-white/5" />
                          <div className="mt-6 h-20 rounded bg-white/5" />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-blue-500/30 bg-blue-500/[0.06] p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-blue-400">
                  After
                </span>

                        <div className="mt-6">
                          <div className="h-4 w-1/2 rounded bg-white/70" />
                          <div className="mt-4 h-12 rounded-xl bg-blue-500/70" />
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="h-16 rounded-xl bg-white/10" />
                            <div className="h-16 rounded-xl bg-white/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* 3D SCANNING */}
            <article className="group mt-6 grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[520px] overflow-hidden bg-[#101319]">
                <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[70px]" />

                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[30%] border border-blue-400/30 bg-blue-500/[0.05] backdrop-blur-xl" />

                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-[30%] border border-white/10 bg-white/[0.035]" />

                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-blue-400">
                    Physical
                  </p>

                  <div className="my-4 text-6xl font-semibold tracking-[-0.06em]">
                    →
                  </div>

                  <p className="text-xs uppercase tracking-[0.4em] text-white/45">
                    Digital
                  </p>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/20">
                  <span>Capture geometry</span>
                  <span>Reverse engineering</span>
                </div>
              </div>

              <div className="flex min-h-[520px] flex-col justify-between border-t border-white/10 p-8 md:p-12 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between">
          <span className="text-sm text-white/25">
            02
          </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-blue-400">
            Capture
          </span>
                </div>

                <div>
                  <h3 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
                    3D Scanning
                  </h3>

                  <p className="mt-6 max-w-lg text-base leading-7 text-white/45">
                    Real-world objects become accurate digital geometry, ready
                    for reproduction, modification and further development.
                  </p>

                  <a
                      href="#contact"
                      className="mt-8 inline-flex items-center gap-3 text-sm text-white transition group-hover:text-blue-400"
                  >
                    Explore 3D Scanning
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </article>

            {/* 3D PRINTING */}
            <article className="group mt-6 grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] lg:grid-cols-[0.9fr_1.1fr]">
              <div className="flex min-h-[520px] flex-col justify-between p-8 md:p-12">
                <div className="flex items-center justify-between">
          <span className="text-sm text-white/25">
            03
          </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-blue-400">
            Manufacture
          </span>
                </div>

                <div>
                  <h3 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">
                    3D Printing
                  </h3>

                  <p className="mt-6 max-w-lg text-base leading-7 text-white/45">
                    From prototypes to replacement parts, we turn digital models
                    into functional components produced on demand.
                  </p>

                  <a
                      href="#contact"
                      className="mt-8 inline-flex items-center gap-3 text-sm text-white transition group-hover:text-blue-400"
                  >
                    Explore 3D Printing
                    <span>↗</span>
                  </a>
                </div>
              </div>

              <div className="relative min-h-[520px] overflow-hidden border-t border-white/10 bg-[#101217] lg:border-l lg:border-t-0">
                <div className="absolute right-[-70px] top-[-70px] h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />

                <div className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[28%] border border-white/10 bg-gradient-to-br from-white/[0.08] to-blue-500/[0.08] shadow-2xl" />

                <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-[28%] border border-white/10 bg-black/40 backdrop-blur-xl" />

                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/30">
                    Layer by layer
                  </p>

                  <div className="mt-4 text-6xl font-semibold tracking-[-0.06em]">
                    PRINT
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                    Digital → Physical
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>
        <section className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0D] px-6 py-32">
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[160px]" />

          <div className="relative mx-auto max-w-7xl">
            <div className="mb-20 grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                  3D workflow
                </p>

                <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  From physical object
                  <br />
                  <span className="text-white/35">
            to finished part.
          </span>
                </h2>
              </div>

              <p className="max-w-md text-base leading-7 text-white/45">
                A complete workflow for recreating, improving and manufacturing
                real-world components with precision.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025]">
              <div className="absolute left-[12%] right-[12%] top-[105px] hidden h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent md:block" />

              <div className="grid md:grid-cols-4">
                {[
                  {
                    number: "01",
                    label: "Capture",
                    title: "Scan",
                    icon: "◎",
                    text: "We capture the geometry of the physical object in high detail.",
                  },
                  {
                    number: "02",
                    label: "Rebuild",
                    title: "Model",
                    icon: "◇",
                    text: "The scanned data is transformed into a clean and usable digital model.",
                  },
                  {
                    number: "03",
                    label: "Refine",
                    title: "Optimize",
                    icon: "△",
                    text: "Geometry is corrected, improved and prepared for its final application.",
                  },
                  {
                    number: "04",
                    label: "Manufacture",
                    title: "Print",
                    icon: "⬡",
                    text: "The finished model becomes a functional physical component.",
                  },
                ].map((step, index) => (
                    <div
                        key={step.number}
                        className={`group relative min-h-[390px] p-8 md:p-10 ${
                            index !== 3 ? "border-b border-white/10 md:border-b-0 md:border-r" : ""
                        }`}
                    >
                      <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs text-white/25">
                STEP {step.number}
              </span>

                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-[#0B0B0D] text-xl text-blue-400 transition duration-300 group-hover:border-blue-500/50 group-hover:bg-blue-500 group-hover:text-white">
                          {step.icon}
                        </div>
                      </div>

                      <div className="mt-28">
                        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-blue-400">
                          {step.label}
                        </p>

                        <h3 className="text-3xl font-medium tracking-[-0.03em]">
                          {step.title}
                        </h3>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-white/40">
                          {step.text}
                        </p>
                      </div>

                      <div className="absolute bottom-0 left-0 h-px w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />
                    </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.25em] text-white/30">
              <span className="text-white/55">Physical</span>
              <span className="text-blue-400">→</span>
              <span>Scan</span>
              <span className="text-blue-400">→</span>
              <span>Model</span>
              <span className="text-blue-400">→</span>
              <span>Optimize</span>
              <span className="text-blue-400">→</span>
              <span>Print</span>
              <span className="text-blue-400">→</span>
              <span className="text-white/55">Physical</span>
            </div>
          </div>
        </section>
        {/* WEB TRANSFORMATIONS */}
        <section
            id="projects"
            className="relative border-t border-white/10 bg-[#0B0B0D] px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">

            {/* HEADER */}
            <div className="mb-20 grid gap-10 lg:grid-cols-[1fr_0.65fr] lg:items-end">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                  Selected transformations
                </p>

                <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  Your website shouldn&apos;t
                  <br />
                  <span className="text-white/35">
            feel 10 years old.
          </span>
                </h2>
              </div>

              <p className="max-w-md text-base leading-7 text-white/45">
                We transform outdated business websites into modern,
                responsive experiences designed to build trust and generate
                more enquiries.
              </p>
            </div>


            {/* PROJECT 01 */}
            <article className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025]">

              {/* PROJECT HEADER */}
              <div className="flex flex-col justify-between gap-6 border-b border-white/10 p-8 md:flex-row md:items-center md:p-10">
                <div>
                  <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.3em] text-blue-400">
              01 — Automotive
            </span>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/35">
              Concept Redesign
            </span>
                  </div>

                  <h3 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                    Auto Service
                  </h3>
                </div>

                <div className="text-sm text-white/35">
                  Before
                  <span className="mx-3 text-blue-400">→</span>
                  After
                </div>
              </div>


              {/* BEFORE / AFTER */}
              <div className="grid lg:grid-cols-2">

                {/* BEFORE */}
                <div className="border-b border-white/10 p-6 md:p-10 lg:border-b-0 lg:border-r">
                  <div className="mb-5 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-white/25">
              Before
            </span>

                    <span className="text-xs text-white/20">
              Outdated website
            </span>
                  </div>

                  <div className="overflow-hidden rounded-[20px] border border-white/10 bg-[#E8E8E4] text-[#252525]">

                    {/* OLD BROWSER */}
                    <div className="flex items-center gap-2 border-b border-black/10 bg-[#D5D5D0] px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-black/15" />

                      <div className="ml-3 h-5 flex-1 rounded bg-white/60" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between border-b-2 border-[#555] pb-4">
                        <div className="text-lg font-bold">
                          AUTO SERVICE
                        </div>

                        <div className="hidden gap-4 text-[9px] md:flex">
                          <span>HOME</span>
                          <span>SERVICES</span>
                          <span>ABOUT US</span>
                          <span>CONTACT</span>
                        </div>
                      </div>

                      <div className="mt-5 border border-black/20 bg-[#C8C8C2] p-5">
                        <div className="text-xl font-bold">
                          WELCOME TO OUR WEBSITE
                        </div>

                        <p className="mt-3 max-w-md text-xs leading-5 text-black/60">
                          We offer professional car repair and maintenance
                          services. Contact us for more information about our
                          services and prices.
                        </p>

                        <button className="mt-5 border border-black bg-[#DDD] px-4 py-2 text-[10px]">
                          READ MORE
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="h-20 border border-black/15 bg-[#D4D4CF]" />
                        <div className="h-20 border border-black/15 bg-[#D4D4CF]" />
                        <div className="h-20 border border-black/15 bg-[#D4D4CF]" />
                      </div>
                    </div>
                  </div>
                </div>


                {/* AFTER */}
                <div className="relative overflow-hidden p-6 md:p-10">
                  <div className="absolute right-[-80px] top-[-80px] h-72 w-72 rounded-full bg-blue-600/15 blur-[100px]" />

                  <div className="relative mb-5 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.25em] text-blue-400">
              After
            </span>

                    <span className="text-xs text-white/25">
              FORMORA redesign
            </span>
                  </div>

                  <div className="relative overflow-hidden rounded-[20px] border border-blue-500/20 bg-[#080A0D] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">

                    {/* MODERN BROWSER */}
                    <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                      <span className="h-2.5 w-2.5 rounded-full bg-white/15" />

                      <div className="ml-3 flex h-5 flex-1 items-center rounded-full border border-white/10 bg-white/[0.04] px-3">
                <span className="text-[8px] text-white/20">
                  autoservice.ro
                </span>
                      </div>
                    </div>

                    <div className="relative min-h-[310px] overflow-hidden p-6">
                      <div className="absolute right-[-30px] top-10 h-48 w-48 rounded-full bg-blue-500/20 blur-[60px]" />

                      <div className="relative flex items-center justify-between">
                        <div className="text-xs font-semibold tracking-[0.2em] text-white">
                          MOTION
                          <span className="text-blue-400">.</span>
                        </div>

                        <div className="hidden items-center gap-5 text-[8px] text-white/40 md:flex">
                          <span>Services</span>
                          <span>About</span>
                          <span>Reviews</span>

                          <span className="rounded-full bg-blue-500 px-3 py-1.5 text-white">
                    Book service
                  </span>
                        </div>
                      </div>

                      <div className="relative mt-12 max-w-sm">
                        <p className="mb-3 text-[8px] uppercase tracking-[0.3em] text-blue-400">
                          Automotive care
                        </p>

                        <h4 className="text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-white">
                          Your car.
                          <br />
                          Our precision.
                        </h4>

                        <p className="mt-4 max-w-xs text-[10px] leading-4 text-white/35">
                          Professional diagnostics, maintenance and repair
                          with transparent pricing and simple online booking.
                        </p>

                        <div className="mt-5 flex gap-2">
                  <span className="rounded-full bg-blue-500 px-4 py-2 text-[8px] font-medium text-white">
                    Book a service
                  </span>

                          <span className="rounded-full border border-white/10 px-4 py-2 text-[8px] text-white/60">
                    Our services
                  </span>
                        </div>
                      </div>

                      <div className="absolute bottom-5 right-5 hidden w-36 rounded-xl border border-white/10 bg-white/[0.04] p-3 md:block">
                        <div className="text-[8px] text-white/30">
                          Customer rating
                        </div>

                        <div className="mt-2 text-lg font-medium text-white">
                          4.9
                        </div>

                        <div className="text-[8px] text-blue-400">
                          ★★★★★
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* IMPROVEMENTS */}
              <div className="grid border-t border-white/10 md:grid-cols-4">
                {[
                  ["01", "Modern design"],
                  ["02", "Mobile first"],
                  ["03", "Clear conversion"],
                  ["04", "Better user journey"],
                ].map(([number, text], index) => (
                    <div
                        key={number}
                        className={`p-6 ${
                            index !== 3
                                ? "border-b border-white/10 md:border-b-0 md:border-r"
                                : ""
                        }`}
                    >
            <span className="text-[10px] text-blue-400">
              {number}
            </span>

                      <p className="mt-2 text-sm text-white/55">
                        {text}
                      </p>
                    </div>
                ))}
              </div>
            </article>


            {/* NEXT PROJECTS */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">

              {/* DENTAL */}
              <article className="group rounded-[28px] border border-white/10 bg-white/[0.025] p-8 transition duration-500 hover:border-blue-500/30">
                <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-400">
            02 — Healthcare
          </span>

                  <span className="text-xl text-white/30 transition group-hover:text-blue-400">
            ↗
          </span>
                </div>

                <div className="my-12 overflow-hidden rounded-2xl border border-white/10 bg-[#F2F5F7] p-5">
                  <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.15em] text-[#17202A]">
              NOVA DENT
            </span>

                    <span className="rounded-full bg-[#17202A] px-3 py-1.5 text-[8px] text-white">
              Appointment
            </span>
                  </div>

                  <div className="mt-10 max-w-xs">
                    <div className="text-2xl font-medium leading-tight text-[#17202A]">
                      Modern dentistry.
                      <br />
                      Human care.
                    </div>

                    <div className="mt-5 h-2 w-32 rounded bg-black/10" />
                    <div className="mt-2 h-2 w-24 rounded bg-black/10" />
                  </div>
                </div>

                <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                  Concept Redesign
                </p>

                <h3 className="mt-3 text-2xl font-medium">
                  Dental Clinic
                </h3>
              </article>


              {/* CONSTRUCTION */}
              <article className="group rounded-[28px] border border-white/10 bg-white/[0.025] p-8 transition duration-500 hover:border-blue-500/30">
                <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.25em] text-blue-400">
            03 — Construction
          </span>

                  <span className="text-xl text-white/30 transition group-hover:text-blue-400">
            ↗
          </span>
                </div>

                <div className="relative my-12 overflow-hidden rounded-2xl border border-white/10 bg-[#17191D] p-5">
                  <div className="absolute right-[-30px] top-[-30px] h-32 w-32 rounded-full bg-blue-500/20 blur-[40px]" />

                  <div className="relative flex items-center justify-between">
            <span className="text-xs font-semibold tracking-[0.15em]">
              NORTHBUILD
            </span>

                    <span className="text-[8px] text-white/35">
              Projects · Services · Contact
            </span>
                  </div>

                  <div className="relative mt-10 max-w-xs">
                    <div className="text-2xl font-medium leading-tight">
                      Built to last.
                      <br />
                      Designed for today.
                    </div>

                    <div className="mt-5 inline-block rounded-full bg-blue-500 px-4 py-2 text-[8px]">
                      Start a project
                    </div>
                  </div>
                </div>

                <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                  Concept Redesign
                </p>

                <h3 className="mt-3 text-2xl font-medium">
                  Construction Company
                </h3>
              </article>
            </div>
          </div>
        </section>
        {/* WHY FORMORA */}
        <section
            id="about"
            className="relative border-t border-white/10 bg-[#0B0B0D] px-6 py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                  Why FORMORA
                </p>

                <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  Not just a website.
                  <br />
                  <span className="text-white/35">
            A complete solution.
          </span>
                </h2>

                <p className="mt-8 max-w-xl text-base leading-7 text-white/45">
                  We combine design, development and technical thinking to create
                  digital and physical solutions that are clear, functional and built
                  with purpose.
                </p>
              </div>

              <div className="border-t border-white/10">
                {[
                  {
                    number: "01",
                    title: "Understand",
                    text: "We start with the business, the problem and the real goal behind the project.",
                  },
                  {
                    number: "02",
                    title: "Design",
                    text: "We define the structure, user experience and visual direction before development begins.",
                  },
                  {
                    number: "03",
                    title: "Develop",
                    text: "We turn the concept into a fast, responsive and reliable final product.",
                  },
                  {
                    number: "04",
                    title: "Deliver",
                    text: "We test, optimize and launch the project ready for real-world use.",
                  },
                ].map((item) => (
                    <div
                        key={item.number}
                        className="group grid gap-6 border-b border-white/10 py-8 md:grid-cols-[80px_220px_1fr] md:items-start"
                    >
            <span className="text-xs text-blue-400">
              {item.number}
            </span>

                      <h3 className="text-2xl font-medium tracking-[-0.03em] transition group-hover:text-blue-400">
                        {item.title}
                      </h3>

                      <p className="max-w-xl text-sm leading-6 text-white/40">
                        {item.text}
                      </p>
                    </div>
                ))}
              </div>
            </div>

            {/* DIFFERENTIATORS */}
            <div className="mt-24 grid gap-6 border-t border-white/10 pt-12 md:grid-cols-3">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.28em] text-blue-400">
                  Modern
                </p>
                <p className="max-w-sm text-lg leading-7 text-white/70">
                  Clean design, responsive layouts and current technologies.
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.28em] text-blue-400">
                  Technical
                </p>
                <p className="max-w-sm text-lg leading-7 text-white/70">
                  Strong focus on performance, precision and real functionality.
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.28em] text-blue-400">
                  Flexible
                </p>
                <p className="max-w-sm text-lg leading-7 text-white/70">
                  From a website redesign to a scanned and reproduced physical part.
                </p>
              </div>
            </div>
          </div>
        </section>
        <QuoteForm />
        <footer className="border-t border-white/10 bg-[#08080A] px-6 py-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold tracking-[0.2em] text-white">
                FORMORA
              </div>

              <p className="mt-2 text-xs text-white/30">
                Digital ideas. Made real.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/30">
            <span>
                © {new Date().getFullYear()} FORMORA
            </span>

              <a
                  href="/admin/login"
                  className="transition hover:text-white/60"
              >
                Admin
              </a>
            </div>
          </div>
        </footer>
      </main>
  );
}
