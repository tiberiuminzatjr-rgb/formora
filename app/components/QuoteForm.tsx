"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { formTranslations, type QuoteService } from "../../lib/form-translations";
import { formatPrice, packages, pricingCopy, redesignCopy, redesignPackages } from "../../lib/pricing";

// Aceste valori rămân în engleză în payload, pentru compatibilitate cu /api/quote.
const services: QuoteService[] = [
  "New Website",
  "Website Redesign",
  "3D Scanning",
  "3D Printing",
  "Scan & Reproduce",
];

type FormState = {
  name: string;
  company: string;
  email: string;
  phone: string;
  websiteUrl: string;
  projectDetails: string;
};

const emptyForm: FormState = {
  name: "",
  company: "",
  email: "",
  phone: "",
  websiteUrl: "",
  projectDetails: "",
};

const webServices: QuoteService[] = ["New Website", "Website Redesign"];
const threeDServices: QuoteService[] = ["3D Scanning", "3D Printing", "Scan & Reproduce"];

// Pricing cards dispatch this event to preselect a service and package in the form.
export const PACKAGE_EVENT = "formora:package";
export type PackageChoice =
    | "start" | "business" | "ecommerce"
    | "refresh" | "complete" | "shopRedesign"
    | "unsure";
export type PackageEventDetail = { service: QuoteService; packageId: PackageChoice };

// Values sent to /api/quote (kept in English, like the services).
const packageApiValues: Record<PackageChoice, string> = {
  start: "Start",
  business: "Business",
  ecommerce: "Online store",
  refresh: "Redesign: Refresh",
  complete: "Redesign: Complete",
  shopRedesign: "Redesign: Online store",
  unsure: "Not sure",
};

type QuoteFormProps = {
  /** "web" on the homepage, "3d" on /3d, "all" shows every service. */
  variant?: "web" | "3d" | "all";
};

export default function QuoteForm({ variant = "all" }: QuoteFormProps) {
  const { language } = useLanguage();
  const tr = formTranslations[language];
  const visibleServices =
      variant === "web" ? webServices : variant === "3d" ? threeDServices : services;
  const [selectedService, setSelectedService] = useState<QuoteService | "">("");
  const [formData, setFormData] = useState<FormState>({ ...emptyForm });
  const [selectedPackage, setSelectedPackage] = useState<PackageChoice | "">("");
  const showPackages = selectedService === "New Website" || selectedService === "Website Redesign";
  const pricing = pricingCopy[language];
  const currency = language === "ro" ? "RON" : "EUR";
  const isRedesign = selectedService === "Website Redesign";
  const redesign = redesignCopy[language];
  const packageOptions: { id: PackageChoice; label: string; price?: string; hint?: string }[] = [
    ...(isRedesign
        ? redesignPackages.map((pkg) => ({
          id: pkg.id,
          label: redesign[pkg.id].name,
          price: formatPrice(pkg.price[currency], language),
          hint: redesign[pkg.id].hint,
        }))
        : packages.map((pkg) => ({
          id: pkg.id,
          label: pricing.packages[pkg.id].name,
          price: formatPrice(pkg.price[currency], language),
          hint: pricing.packages[pkg.id].tagline,
        }))),
    { id: "unsure", label: language === "ro" ? "Nu știu încă, recomandă-mi" : "Not sure yet, recommend one" },
  ];
  const activeHint = packageOptions.find((option) => option.id === selectedPackage)?.hint;

  // "Choose package" buttons in the pricing section preselect service + package.
  useEffect(() => {
    function onPackage(event: Event) {
      const detail = (event as CustomEvent<PackageEventDetail>).detail;
      if (!detail) return;
      setSelectedService(detail.service);
      setSelectedPackage(detail.packageId);
    }
    window.addEventListener(PACKAGE_EVENT, onPackage);
    return () => window.removeEventListener(PACKAGE_EVENT, onPackage);
  }, []);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedService) {
      setErrorMessage(tr.selectService);
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage(tr.enterName);
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage(tr.enterEmail);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("service", selectedService);
      payload.append("name", formData.name);
      payload.append("company", formData.company);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append(
          "website_url",
          selectedService === "Website Redesign" ? formData.websiteUrl : ""
      );
      payload.append("project_details", formData.projectDetails);
      payload.append("language", language);
      payload.append("package", showPackages && selectedPackage ? packageApiValues[selectedPackage] : "");
      files.forEach((file) => payload.append("files", file));

      const response = await fetch("/api/quote", {
        method: "POST",
        body: payload,
      });
      const data = await response.json();
      if (!response.ok) {
        // Erorile necunoscute venite din backend nu sunt neapărat traduse.
        throw new Error(data.error || tr.error);
      }

      setSuccessMessage(tr.success);
      setSelectedService("");
      setSelectedPackage("");
      setFiles([]);
      setFormData({ ...emptyForm });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : tr.error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
      "w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60";
  const labelClass = "mb-2 block text-xs uppercase tracking-[0.2em] text-white/30";

  return (
      <section id="contact" className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0D] px-6 py-32">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[160px]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">{tr.eyebrow}</p>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                {tr.title}
                <br />
                <span className="text-white/35">{tr.subtitle}</span>
              </h2>
              <p className="mt-8 max-w-md text-base leading-7 text-white/45">{tr.intro}</p>
              <div className="mt-12 border-t border-white/10 pt-8">
                <p className="text-xs uppercase tracking-[0.25em] text-white/25">FORMORA</p>
                <p className="mt-3 text-sm leading-6 text-white/45">
                  {variant !== "3d" && (
                      <>
                        {language === "ro" ? "Dezvoltare web" : "Web Development"}
                        <br />
                        {language === "ro" ? "România și internațional" : "Romania & international"}
                      </>
                  )}
                  {variant === "3d" && (
                      <>
                        {tr.services["3D Scanning"]}
                        <br />
                        {tr.services["3D Printing"]}
                      </>
                  )}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-white/[0.025] p-6 md:p-10">
              <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/30">{tr.question}</p>
              <div className="flex flex-wrap gap-3">
                {visibleServices.map((service) => (
                    <button
                        key={service}
                        type="button"
                        onClick={() => {
                          if (service !== selectedService) setSelectedPackage("");
                          setSelectedService(service);
                          setErrorMessage("");
                        }}
                        aria-pressed={selectedService === service}
                        className={`rounded-full border px-5 py-3 text-sm transition ${
                            selectedService === service
                                ? "border-blue-500 bg-blue-500 text-white"
                                : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white"
                        }`}
                    >
                      {tr.services[service]}
                    </button>
                ))}
              </div>

              {showPackages && (
                  <fieldset className="mt-8">
                    <legend className="mb-4 text-xs uppercase tracking-[0.3em] text-white/30">
                      {language === "ro" ? "Ce pachet te interesează? (opțional)" : "Which package are you interested in? (optional)"}
                    </legend>
                    <div className="flex flex-wrap gap-3">
                      {packageOptions.map((option) => {
                        const active = selectedPackage === option.id;
                        return (
                            <label
                                key={option.id}
                                className={`cursor-pointer rounded-full border px-5 py-3 text-sm transition focus-within:ring-2 focus-within:ring-blue-500/50 ${
                                    active
                                        ? "border-blue-500 bg-blue-500/15 text-white"
                                        : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white"
                                }`}
                            >
                              <input
                                  type="radio"
                                  name="package"
                                  value={option.id}
                                  checked={active}
                                  onChange={() => setSelectedPackage(option.id)}
                                  className="sr-only"
                              />
                              {option.label}
                              {option.price && (
                                  <span className={active ? "ml-2 text-blue-300" : "ml-2 text-white/30"}>· {option.price}</span>
                              )}
                            </label>
                        );
                      })}
                    </div>
                    {activeHint && <p className="mt-3 text-xs text-white/40">{activeHint}</p>}
                  </fieldset>
              )}

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="quote-name" className={labelClass}>{tr.name}</label>
                  <input id="quote-name" type="text" name="name" value={formData.name} onChange={handleChange}
                         placeholder={tr.namePlaceholder} autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="quote-company" className={labelClass}>{tr.company}</label>
                  <input id="quote-company" type="text" name="company" value={formData.company} onChange={handleChange}
                         placeholder={tr.companyPlaceholder} autoComplete="organization" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="quote-email" className={labelClass}>{tr.email}</label>
                  <input id="quote-email" type="email" name="email" value={formData.email} onChange={handleChange}
                         placeholder="you@company.com" autoComplete="email" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="quote-phone" className={labelClass}>{tr.phone}</label>
                  <input id="quote-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange}
                         placeholder="+40..." autoComplete="tel" className={inputClass} />
                </div>
              </div>

              {selectedService === "Website Redesign" && (
                  <div className="mt-5">
                    <label htmlFor="quote-website" className={labelClass}>{tr.website}</label>
                    <input id="quote-website" type="text" name="websiteUrl" value={formData.websiteUrl}
                           onChange={handleChange} placeholder={tr.websitePlaceholder} className={inputClass} />
                  </div>
              )}

              {(selectedService === "3D Scanning" ||
                  selectedService === "3D Printing" ||
                  selectedService === "Scan & Reproduce") && (
                  <div className="mt-5">
                    <p className={labelClass}>{tr.files}</p>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition hover:border-blue-500/50 hover:bg-blue-500/[0.04]">
                      <span className="text-2xl text-blue-400">+</span>
                      <span className="mt-3 text-sm text-white/55">{tr.upload}</span>
                      <span className="mt-2 text-xs text-white/25">{tr.formats}</span>
                      <input type="file" multiple className="hidden" accept=".stl,.step,.stp,.obj,image/*"
                             onChange={(event) => setFiles(Array.from(event.target.files || []))} />
                    </label>
                    {files.length > 0 && (
                        <div className="mt-3 space-y-1">
                          {files.map((file, index) => (
                              <p key={`${file.name}-${index}`} className="text-xs text-white/40">{file.name}</p>
                          ))}
                        </div>
                    )}
                  </div>
              )}

              <div className="mt-5">
                <label htmlFor="quote-details" className={labelClass}>{tr.details}</label>
                <textarea id="quote-details" rows={6} name="projectDetails" value={formData.projectDetails}
                          onChange={handleChange} placeholder={tr.detailsPlaceholder}
                          className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60" />
              </div>

              {errorMessage && (
                  <div role="alert" className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-5 py-4 text-sm text-red-300">
                    {errorMessage}
                  </div>
              )}
              {successMessage && (
                  <div role="status" className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-4 text-sm text-emerald-300">
                    {successMessage}
                  </div>
              )}

              <button type="submit" disabled={isSubmitting}
                      className="mt-6 w-full rounded-2xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting ? tr.sending : tr.send}
              </button>
              <p className="mt-4 text-center text-xs text-white/20">{tr.note}</p>
            </form>
          </div>
        </div>
      </section>
  );
}