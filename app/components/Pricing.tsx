"use client";

import { useLanguage } from "./LanguageProvider";
import { PACKAGE_EVENT, type PackageEventDetail } from "./QuoteForm";
import {
    addOns,
    carePlan,
    formatPrice,
    packages,
    pricingCopy,
} from "../../lib/pricing";

export default function Pricing() {
    const { language } = useLanguage();
    const copy = pricingCopy[language];
    const currency = language === "ro" ? "RON" : "EUR";

    function selectPackage(detail: PackageEventDetail) {
        window.dispatchEvent(new CustomEvent(PACKAGE_EVENT, { detail }));
    }

    return (
        <section
            id="pricing"
            className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0D] px-6 py-32"
        >
            <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-600/[0.07] blur-[140px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-16 grid gap-10 lg:grid-cols-[1fr_0.6fr] lg:items-end">
                    <div>
                        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                            {copy.eyebrow}
                        </p>
                        <h2 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                            {copy.title}
                            <br />
                            <span className="text-white/35">{copy.subtitle}</span>
                        </h2>
                    </div>
                    <p className="max-w-md text-base leading-7 text-white/45">{copy.intro}</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {packages.map((pkg) => {
                        const text = copy.packages[pkg.id];

                        return (
                            <article
                                key={pkg.id}
                                className={`relative flex flex-col rounded-[32px] border p-8 md:p-10 ${
                                    pkg.popular
                                        ? "border-blue-500/50 bg-blue-500/[0.06] shadow-2xl shadow-blue-500/10"
                                        : "border-white/10 bg-white/[0.025]"
                                }`}
                            >
                                {pkg.popular && (
                                    <span className="absolute right-6 top-6 rounded-full bg-blue-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
                                        {copy.popular}
                                    </span>
                                )}

                                <h3 className="text-2xl font-medium tracking-[-0.03em]">{text.name}</h3>
                                <p className="mt-2 text-sm text-white/45">{text.tagline}</p>

                                <div className="mt-8">
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/30">
                                        {copy.from}
                                    </span>
                                    <p className="mt-1 text-5xl font-semibold tracking-[-0.04em]">
                                        {formatPrice(pkg.price[currency], language)}
                                    </p>
                                    <p className="mt-3 text-xs text-white/35">
                                        {copy.delivery}: {text.delivery}
                                    </p>
                                </div>

                                <ul className="mt-8 flex-1 space-y-3 border-t border-white/10 pt-8 text-sm leading-6 text-white/65">
                                    {text.features.map((feature, index) => (
                                        <li key={feature} className="flex gap-3">
                                            <span className={index === 0 && pkg.id !== "start" ? "text-white/30" : "text-blue-400"}>
                                                {index === 0 && pkg.id !== "start" ? "+" : "✓"}
                                            </span>
                                            <span className={index === 0 && pkg.id !== "start" ? "text-white/40" : ""}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <p className="mt-8 text-xs leading-5 text-white/35">{text.bestFor}</p>

                                <a
                                    href="#contact"
                                    onClick={() =>
                                        selectPackage({ service: pkg.service, packageId: pkg.id })
                                    }
                                    className={`mt-6 flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition ${
                                        pkg.popular
                                            ? "bg-blue-500 text-white hover:bg-blue-400"
                                            : "border border-white/15 text-white hover:border-white/30 hover:bg-white/5"
                                    }`}
                                >
                                    {copy.choose}
                                </a>
                            </article>
                        );
                    })}
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
                    <div className="rounded-[32px] border border-white/10 bg-white/[0.025] p-8 md:p-10">
                        <div className="flex flex-wrap items-baseline justify-between gap-4">
                            <h3 className="text-2xl font-medium tracking-[-0.03em]">{copy.care.title}</h3>
                            <p className="text-3xl font-semibold tracking-[-0.03em]">
                                {formatPrice(carePlan[currency], language)}
                                <span className="ml-1 text-sm font-normal text-white/40">{copy.care.price}</span>
                            </p>
                        </div>
                        <p className="mt-5 text-sm leading-6 text-white/50">{copy.care.text}</p>
                    </div>

                    <div className="rounded-[32px] border border-white/10 bg-white/[0.025] p-8 md:p-10">
                        <h3 className="text-2xl font-medium tracking-[-0.03em]">{copy.addOnsTitle}</h3>
                        <ul className="mt-5 divide-y divide-white/10 text-sm">
                            {(Object.keys(addOns) as (keyof typeof addOns)[]).map((key) => (
                                <li key={key} className="flex items-center justify-between gap-4 py-3">
                                    <span className="text-white/60">{copy.addOns[key]}</span>
                                    <span className="whitespace-nowrap font-medium">
                                        {key === "redesign" ? `${copy.from} ` : "+"}
                                        {formatPrice(addOns[key][currency], language)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
                    <p className="max-w-2xl text-sm leading-6 text-white/45">{copy.note}</p>
                    <a
                        href="#contact"
                        onClick={() =>
                            selectPackage({ service: "New Website", packageId: "unsure" })
                        }
                        className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
                    >
                        {copy.custom}
                    </a>
                </div>
            </div>
        </section>
    );
}