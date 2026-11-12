"use client";

import Link from "next/link";
import QuoteForm from "../components/QuoteForm";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLanguage } from "../components/LanguageProvider";
import { pageTranslations } from "../../lib/page-translations";

const copy = {
  ro: {
    back: "Site-uri web",
    eyebrow: "SCANARE 3D · PRINTARE 3D · CLUJ-NAPOCA",
    title: "Din obiect real",
    highlight: "în piesă nouă.",
    intro:
      "Scanăm, modelăm și printăm piese, prototipuri și obiecte personalizate. Trimite o poză sau un fișier și primești o ofertă rapid.",
    cta: "Cere ofertă 3D",
    usesEyebrow: "CE PUTEM FACE",
    usesTitle: "Pentru cine lucrăm",
    uses: [
      ["Piese de schimb", "Reproducem piese rupte sau care nu se mai fabrică: cleme, capace, suporturi, roți dințate."],
      ["Prototipuri", "Testezi forma și potrivirea unui produs înainte de producția de serie."],
      ["Dentar și medical", "Modele și ghiduri pentru clinici și laboratoare, din fișiere STL."],
      ["Arhitectură", "Machete și modele de prezentare pentru proiecte și clienți."],
      ["Obiecte personalizate", "Cadouri, suporturi, organizatoare și piese făcute exact pe măsură."],
      ["Inginerie inversă", "Scanăm piesa existentă și obținem un model CAD pe care îl poți modifica."],
    ],
    howEyebrow: "CUM FUNCȚIONEAZĂ",
    how: [
      ["1", "Trimiți obiectul, o poză sau un fișier (STL, STEP, OBJ)."],
      ["2", "Primești oferta cu prețul și termenul de livrare."],
      ["3", "Scanăm, modelăm și printăm, apoi primești piesa."],
    ],
  },
  en: {
    back: "Websites",
    eyebrow: "3D SCANNING · 3D PRINTING · CLUJ-NAPOCA",
    title: "From a real object",
    highlight: "to a new part.",
    intro:
      "We scan, model and print parts, prototypes and custom objects. Send a photo or a file and get a quote fast.",
    cta: "Request a 3D quote",
    usesEyebrow: "WHAT WE DO",
    usesTitle: "Who we work for",
    uses: [
      ["Replacement parts", "We reproduce broken or discontinued parts: clips, covers, brackets, gears."],
      ["Prototypes", "Test the shape and fit of a product before series production."],
      ["Dental & medical", "Models and guides for clinics and labs, from STL files."],
      ["Architecture", "Scale models and presentation pieces for projects and clients."],
      ["Custom objects", "Gifts, holders, organisers and parts made exactly to measure."],
      ["Reverse engineering", "We scan an existing part and deliver an editable CAD model."],
    ],
    howEyebrow: "HOW IT WORKS",
    how: [
      ["1", "Send the object, a photo or a file (STL, STEP, OBJ)."],
      ["2", "Get a quote with price and delivery time."],
      ["3", "We scan, model and print — you receive the part."],
    ],
  },
} as const;

export default function ThreeDPage() {
  const { language } = useLanguage();
  const tx = (key: keyof typeof pageTranslations.en) => pageTranslations[language][key];
  const c = copy[language];

  return (
      <main className="min-h-screen bg-[#0B0B0D] text-white">
        <header className="fixed left-0 top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/" className="text-2xl font-semibold tracking-[0.2em]">
              FORMORA
            </Link>

            <div className="flex items-center gap-3">
              <Link
                  href="/"
                  className="hidden rounded-full border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:border-white/20 hover:text-white sm:inline-flex"
              >
                ← {c.back}
              </Link>
              <LanguageSwitcher />
              <a
                  href="#contact"
                  className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                {c.cta}
              </a>
            </div>
          </div>
        </header>

        <section className="relative overflow-hidden px-6 pb-24 pt-40">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />
          <div className="relative mx-auto max-w-7xl">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-blue-400">{c.eyebrow}</p>
            <h1 className="max-w-5xl text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              {c.title}
              <br />
              <span className="text-white/45">{c.highlight}</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">{c.intro}</p>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {c.how.map(([number, text]) => (
                  <div key={number} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
                    <span className="text-xs text-blue-400">{c.howEyebrow} · {number}</span>
                    <p className="mt-3 text-sm leading-6 text-white/65">{text}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative border-t border-white/10 bg-[#0B0B0D] px-6 py-24">
          <div className="relative mx-auto max-w-7xl">
            {/* 3D SCANNING */}
            <article className="group grid overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-[520px] overflow-hidden bg-[#101319]">
                <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[70px]" />

                <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[30%] border border-blue-400/30 bg-blue-500/[0.05] backdrop-blur-xl" />

                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-[30%] border border-white/10 bg-white/[0.035]" />

                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-blue-400">{tx("Physical")}</p>

                  <div className="my-4 text-6xl font-semibold tracking-[-0.06em]">
                    →
                  </div>

                  <p className="text-xs uppercase tracking-[0.4em] text-white/45">{tx("Digital")}</p>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/20">
                  <span>{tx("Capture geometry")}</span>
                  <span>{tx("Reverse engineering")}</span>
                </div>
              </div>

              <div className="flex min-h-[520px] flex-col justify-between border-t border-white/10 p-8 md:p-12 lg:border-l lg:border-t-0">
                <div className="flex items-center justify-between">
          <span className="text-sm text-white/25">
            02
          </span>

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-blue-400">{tx("Capture")}</span>
                </div>

                <div>
                  <h3 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">{tx("3D Scanning")}</h3>

                  <p className="mt-6 max-w-lg text-base leading-7 text-white/45">{tx("Real-world objects become accurate digital geometry, ready for reproduction, modification and further development.")}</p>

                  <a
                      href="#contact"
                      className="mt-8 inline-flex items-center gap-3 text-sm text-white transition group-hover:text-blue-400"
                  >{tx("Explore 3D Scanning")}<span>↗</span>
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

                  <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-blue-400">{tx("Manufacture")}</span>
                </div>

                <div>
                  <h3 className="text-4xl font-medium tracking-[-0.03em] md:text-5xl">{tx("3D Printing")}</h3>

                  <p className="mt-6 max-w-lg text-base leading-7 text-white/45">{tx("From prototypes to replacement parts, we turn digital models into functional components produced on demand.")}</p>

                  <a
                      href="#contact"
                      className="mt-8 inline-flex items-center gap-3 text-sm text-white transition group-hover:text-blue-400"
                  >{tx("Explore 3D Printing")}<span>↗</span>
                  </a>
                </div>
              </div>

              <div className="relative min-h-[520px] overflow-hidden border-t border-white/10 bg-[#101217] lg:border-l lg:border-t-0">
                <div className="absolute right-[-70px] top-[-70px] h-72 w-72 rounded-full bg-blue-600/20 blur-[100px]" />

                <div className="absolute left-1/2 top-1/2 h-[310px] w-[310px] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[28%] border border-white/10 bg-gradient-to-br from-white/[0.08] to-blue-500/[0.08] shadow-2xl" />

                <div className="absolute left-1/2 top-1/2 h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-[28%] border border-white/10 bg-black/40 backdrop-blur-xl" />

                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xs uppercase tracking-[0.4em] text-white/30">{tx("Layer by layer")}</p>

                  <div className="mt-4 text-6xl font-semibold tracking-[-0.06em]">
                    PRINT
                  </div>

                  <p className="mt-5 text-xs uppercase tracking-[0.35em] text-blue-400">{tx("Digital → Physical")}</p>
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
                <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">{tx("3D workflow")}</p>

                <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">{tx("From physical object")}<br />
                  <span className="text-white/35">{tx("to finished part.")}</span>
                </h2>
              </div>

              <p className="max-w-md text-base leading-7 text-white/45">{tx("A complete workflow for recreating, improving and manufacturing real-world components with precision.")}</p>
            </div>

            <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025]">
              <div className="absolute left-[12%] right-[12%] top-[105px] hidden h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent md:block" />

              <div className="grid md:grid-cols-4">
                {[
                  {
                    number: "01",
                    label: tx("Capture"),
                    title: tx("Scan"),
                    icon: "◎",
                    text: tx("We capture the geometry of the physical object in high detail."),
                  },
                  {
                    number: "02",
                    label: tx("Rebuild"),
                    title: tx("Model"),
                    icon: "◇",
                    text: tx("The scanned data is transformed into a clean and usable digital model."),
                  },
                  {
                    number: "03",
                    label: tx("Refine"),
                    title: tx("Optimize"),
                    icon: "△",
                    text: tx("Geometry is corrected, improved and prepared for its final application."),
                  },
                  {
                    number: "04",
                    label: tx("Manufacture"),
                    title: tx("Print"),
                    icon: "⬡",
                    text: tx("The finished model becomes a functional physical component."),
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
                {tx("STEP")} {step.number}
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
              <span className="text-white/55">{tx("Physical")}</span>
              <span className="text-blue-400">→</span>
              <span>{tx("Scan")}</span>
              <span className="text-blue-400">→</span>
              <span>{tx("Model")}</span>
              <span className="text-blue-400">→</span>
              <span>{tx("Optimize")}</span>
              <span className="text-blue-400">→</span>
              <span>{tx("Print")}</span>
              <span className="text-blue-400">→</span>
              <span className="text-white/55">{tx("Physical")}</span>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#0B0B0D] px-6 py-32">
          <div className="mx-auto max-w-7xl">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">{c.usesEyebrow}</p>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{c.usesTitle}</h2>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {c.uses.map(([title, text]) => (
                  <div key={title} className="rounded-[28px] border border-white/10 bg-white/[0.025] p-8">
                    <h3 className="text-xl font-medium tracking-[-0.02em]">{title}</h3>
                    <p className="mt-4 text-sm leading-6 text-white/45">{text}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        <QuoteForm variant="3d" />

        <footer className="border-t border-white/10 bg-[#08080A] px-6 py-10 text-xs text-white/30">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} FORMORA. {tx("All rights reserved.")}</p>
            <Link href="/" className="transition hover:text-white">← {c.back}</Link>
          </div>
        </footer>
      </main>
  );
}
