
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    translations,
    type Language,
} from "../../lib/translations";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: typeof translations.ro | typeof translations.en;
};

const LanguageContext =
    createContext<LanguageContextType | null>(null);

export function LanguageProvider({
                                     children,
                                 }: {
    children: ReactNode;
}) {
    const [language, setLanguage] =
        useState<Language>("ro");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(
                "formora-language"
            );

            if (saved === "ro" || saved === "en") {
                setLanguage(saved);
            }
        } catch {
            // Româna rămâne limba implicită.
        }
    }, []);

    useEffect(() => {
        document.documentElement.lang = language;

        try {
            localStorage.setItem(
                "formora-language",
                language
            );
        } catch {
            // Site-ul funcționează și fără localStorage.
        }
    }, [language]);

    return (
        <LanguageContext.Provider
            value={{
                language,
                setLanguage,
                t: translations[language],
            }}
        >
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error(
            "useLanguage must be used inside LanguageProvider"
        );
    }

    return context;
}
