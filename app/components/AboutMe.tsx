"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "./LanguageProvider";

// Pune poza în public/tiberiu.jpg (recomandat: portret 4:5, minim 1000×1250 px).
const PHOTO_SRC = "/tiberiu.jpg";

const copy = {
    ro: {
        eyebrow: "DESPRE MINE",
        title: "Salut, sunt Tiberiu.",
        subtitle: "Omul din spatele FORMORA.",
        paragraphs: [
            "Am studiat dezvoltare software la University of Agder, în Norvegia, apoi am lucrat peste trei ani la Jæder Espeland, în automatizări industriale cu roboți ABB. Acolo am învățat că un sistem trebuie să funcționeze precis, în fiecare zi, fără scuze.",
            "Am fondat FORMORA în Cluj-Napoca ca să aduc aceeași rigoare în web: site-uri rapide, clare și construite de la zero în Next.js, nu asamblate din șabloane.",
            "Când lucrezi cu FORMORA, vorbești direct cu mine, de la prima discuție până după lansare. Fără intermediari și fără răspunsuri automate.",
        ],
        stats: [
            ["2022", "Absolvent în dezvoltare software, University of Agder"],
            ["3+ ani", "Experiență în automatizări industriale, Norvegia"],
            ["1:1", "Comunicare directă, fără intermediari"],
        ],
        cta: "Hai să vorbim",
        photoAlt: "Tiberiu, fondatorul FORMORA",
        role: "Fondator & developer",
    },
    en: {
        eyebrow: "ABOUT ME",
        title: "Hi, I'm Tiberiu.",
        subtitle: "The person behind FORMORA.",
        paragraphs: [
            "I studied software development at the University of Agder in Norway, then spent more than three years at Jæder Espeland working on industrial automation with ABB robots. That taught me that a system has to work precisely, every single day.",
            "I founded FORMORA in Cluj-Napoca to bring the same rigour to the web: fast, clear websites built from scratch in Next.js, not assembled from templates.",
            "When you work with FORMORA, you talk directly to me, from the first call until after launch. No middlemen, no automated replies.",
        ],
        stats: [
            ["2022", "Software development graduate, University of Agder"],
            ["3+ years", "Industrial automation experience in Norway"],
            ["1:1", "Direct communication, no middlemen"],
        ],
        cta: "Let's talk",
        photoAlt: "Tiberiu, founder of FORMORA",
        role: "Founder & developer",
    },
} as const;

export default function AboutMe() {
    const { language } = useLanguage();
    const c = copy[language];
    const [photoFailed, setPhotoFailed] = useState(false);

    return (
        <section
            id="about"
            className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0D] px-6 py-32"
        >
            <div className="absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-blue-600/[0.08] blur-[140px]" />

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[0.85fr_1.15fr]">
                {/* Photo */}
                <div className="relative mx-auto w-full max-w-md">
                    <div className="absolute -inset-px rounded-[36px] bg-gradient-to-b from-blue-500/40 via-white/10 to-transparent" />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[36px] bg-[#111114]">
                        {!photoFailed ? (
                            <Image
                                src={PHOTO_SRC}
                                alt={c.photoAlt}
                                fill
                                sizes="(min-width: 1024px) 448px, 90vw"
                                className="object-cover"
                                onError={() => setPhotoFailed(true)}
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-7xl font-semibold tracking-[0.1em] text-white/15">
                                TM
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                            <p className="text-lg font-medium">Tiberiu</p>
                            <p className="text-xs uppercase tracking-[0.25em] text-blue-400">{c.role}</p>
                        </div>
                    </div>
                </div>

                {/* Text */}
                <div>
                    <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">{c.eyebrow}</p>
                    <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                        {c.title}
                        <br />
                        <span className="text-white/35">{c.subtitle}</span>
                    </h2>

                    <div className="mt-8 max-w-2xl space-y-5 text-base leading-8 text-white/55">
                        {c.paragraphs.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-3">
                        {c.stats.map(([value, label]) => (
                            <div key={value} className="rounded-[24px] border border-white/10 bg-white/[0.025] p-6">
                                <p className="text-3xl font-semibold tracking-[-0.03em]">{value}</p>
                                <p className="mt-2 text-xs leading-5 text-white/40">{label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex flex-wrap items-center gap-6">
                        <a
                            href="#contact"
                            className="rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                            {c.cta}
                        </a>
                        <a
                            href="https://github.com/tiberiuminzatjr-rgb"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-white/50 transition hover:text-white"
                        >
                            GitHub ↗
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
