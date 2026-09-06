"use client";

import { FormEvent, useState } from "react";

const services = [
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

export default function QuoteForm() {
    const [selectedService, setSelectedService] = useState("");

    const [formData, setFormData] = useState<FormState>({
        name: "",
        company: "",
        email: "",
        phone: "",
        websiteUrl: "",
        projectDetails: "",
    });

    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        if (!selectedService) {
            setErrorMessage("Please select a service.");
            return;
        }

        if (!formData.name.trim()) {
            setErrorMessage("Please enter your name.");
            return;
        }

        if (!formData.email.trim()) {
            setErrorMessage("Please enter your email.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Creăm FormData pentru a putea trimite și fișiere
            const payload = new FormData();

            payload.append("service", selectedService);
            payload.append("name", formData.name);
            payload.append("company", formData.company);
            payload.append("email", formData.email);
            payload.append("phone", formData.phone);

            payload.append(
                "website_url",
                selectedService === "Website Redesign"
                    ? formData.websiteUrl
                    : ""
            );

            payload.append(
                "project_details",
                formData.projectDetails
            );

            // Adăugăm toate fișierele selectate
            files.forEach((file) => {
                payload.append("files", file);
            });

            // Trimitem formularul către backend
            const response = await fetch("/api/quote", {
                method: "POST",
                body: payload,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Something went wrong."
                );
            }

            // Mesaj succes
            setSuccessMessage(
                "Project request sent successfully. We'll get back to you soon."
            );

            // Resetăm formularul
            setSelectedService("");
            setFiles([]);

            setFormData({
                name: "",
                company: "",
                email: "",
                phone: "",
                websiteUrl: "",
                projectDetails: "",
            });
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section
            id="contact"
            className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0D] px-6 py-32"
        >
            <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.07] blur-[160px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
                    {/* LEFT */}
                    <div>
                        <p className="mb-5 text-xs uppercase tracking-[0.35em] text-blue-400">
                            Start a project
                        </p>

                        <h2 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl md:text-6xl">
                            Have an idea?
                            <br />
                            <span className="text-white/35">
                                Let&apos;s build it.
                            </span>
                        </h2>

                        <p className="mt-8 max-w-md text-base leading-7 text-white/45">
                            Tell us what you need and we&apos;ll get back to you with the
                            next steps for your project.
                        </p>

                        <div className="mt-12 border-t border-white/10 pt-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                FORMORA
                            </p>

                            <p className="mt-3 text-sm leading-6 text-white/45">
                                Web Development
                                <br />
                                3D Scanning
                                <br />
                                3D Printing
                            </p>
                        </div>
                    </div>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="rounded-[32px] border border-white/10 bg-white/[0.025] p-6 md:p-10"
                    >
                        <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/30">
                            What can we help you with?
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {services.map((service) => (
                                <button
                                    key={service}
                                    type="button"
                                    onClick={() => {
                                        setSelectedService(service);
                                        setErrorMessage("");
                                    }}
                                    className={`rounded-full border px-5 py-3 text-sm transition ${
                                        selectedService === service
                                            ? "border-blue-500 bg-blue-500 text-white"
                                            : "border-white/10 bg-white/[0.02] text-white/55 hover:border-white/25 hover:text-white"
                                    }`}
                                >
                                    {service}
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                    Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    autoComplete="name"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                    Company
                                </label>

                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Company name"
                                    autoComplete="organization"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                    Phone
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+40..."
                                    autoComplete="tel"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                                />
                            </div>
                        </div>

                        {selectedService === "Website Redesign" && (
                            <div className="mt-5">
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                    Current website
                                </label>

                                <input
                                    type="text"
                                    name="websiteUrl"
                                    value={formData.websiteUrl}
                                    onChange={handleChange}
                                    placeholder="https://yourwebsite.com"
                                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                                />
                            </div>
                        )}

                        {(selectedService === "3D Scanning" ||
                            selectedService === "3D Printing" ||
                            selectedService === "Scan & Reproduce") && (
                            <div className="mt-5">
                                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                    Files / Photos
                                </label>

                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-10 text-center transition hover:border-blue-500/50 hover:bg-blue-500/[0.04]">
                                    <span className="text-2xl text-blue-400">+</span>

                                    <span className="mt-3 text-sm text-white/55">
                                        Upload your files
                                    </span>

                                    <span className="mt-2 text-xs text-white/25">
                                        STL, STEP, STP, OBJ or photos
                                    </span>

                                    <input
                                        type="file"
                                        multiple
                                        className="hidden"
                                        accept=".stl,.step,.stp,.obj,image/*"
                                        onChange={(event) => {
                                            const selectedFiles = Array.from(event.target.files || []);
                                            setFiles(selectedFiles);
                                        }}
                                    />
                                </label>

                                {/* 👇 AICI */}
                                {files.length > 0 && (
                                    <div className="mt-3 space-y-1">
                                        {files.map((file) => (
                                            <p
                                                key={file.name}
                                                className="text-xs text-white/40"
                                            >
                                                {file.name}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-5">
                            <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30">
                                Project details
                            </label>

                            <textarea
                                rows={6}
                                name="projectDetails"
                                value={formData.projectDetails}
                                onChange={handleChange}
                                placeholder="Tell us a little about your project..."
                                className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                            />
                        </div>

                        {errorMessage && (
                            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-5 py-4 text-sm text-red-300">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.08] px-5 py-4 text-sm text-emerald-300">
                                {successMessage}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-6 w-full rounded-2xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "Sending request..."
                                : "Send project request"}
                        </button>

                        <p className="mt-4 text-center text-xs text-white/20">
                            No commitment. We&apos;ll review your request and get back to you.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}