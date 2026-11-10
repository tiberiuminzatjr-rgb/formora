
"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div
            className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1"
            role="group"
            aria-label="Website language"
        >
            <button
                type="button"
                lang="ro"
                onClick={() => setLanguage("ro")}
                aria-pressed={language === "ro"}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                    language === "ro"
                        ? "bg-white text-black"
                        : "text-white/50 hover:text-white"
                }`}
            >
                RO
            </button>

            <button
                type="button"
                lang="en"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-all duration-300 ${
                    language === "en"
                        ? "bg-white text-black"
                        : "text-white/50 hover:text-white"
                }`}
            >
                EN
            </button>
        </div>
    );
}
