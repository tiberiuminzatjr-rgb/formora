"use client";

import { ReactNode } from "react";
import { useLanguage } from "./LanguageProvider";
import { translatePortalText, translatePortalStatus } from "@/lib/portal-translations";

/** Translate a visible label without altering its stored/API value. */
export function PortalText({ children }: { children: string }) {
    const { language } = useLanguage();
    return <>{translatePortalText(children, language)}</>;
}

/** Render a translated status label; retain the original status code in logic. */
export function PortalStatus({ value }: { value: string }) {
    const { language } = useLanguage();
    return <>{translatePortalStatus(value, language)}</>;
}

/** For dynamic text inside a client component. */
export function usePortalTranslation() {
    const { language } = useLanguage();
    return {
        language,
        tr: (text: string) => translatePortalText(text, language),
        statusLabel: (status: string) => translatePortalStatus(status, language),
    };
}
