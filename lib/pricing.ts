// Pachetele FORMORA.
// Româna afișează prețuri în RON (piața locală), engleza în EUR (clienți internaționali).
// Modifică prețurile doar aici: secțiunea de pe site se actualizează automat.

import type { QuoteService } from "./form-translations";

export type PricingPackage = {
    id: "start" | "business" | "ecommerce";
    service: QuoteService;
    popular?: boolean;
    price: { RON: number; EUR: number };
};

export const packages: PricingPackage[] = [
    { id: "start", service: "New Website", price: { RON: 1290, EUR: 350 } },
    { id: "business", service: "New Website", popular: true, price: { RON: 2490, EUR: 750 } },
    { id: "ecommerce", service: "New Website", price: { RON: 4490, EUR: 1290 } },
];

// Pachete pentru modernizarea unui site existent (apar în formular la „Modernizare site web”).
export type RedesignPackage = {
    id: "refresh" | "complete" | "shopRedesign";
    price: { RON: number; EUR: number };
};

export const redesignPackages: RedesignPackage[] = [
    { id: "refresh", price: { RON: 1490, EUR: 450 } },
    { id: "complete", price: { RON: 2290, EUR: 690 } },
    { id: "shopRedesign", price: { RON: 3990, EUR: 1150 } },
];

export const redesignCopy = {
    ro: {
        refresh: { name: "Refresh", hint: "Design nou, aceeași structură, până la 5 pagini" },
        complete: { name: "Redesign complet", hint: "Structură și texte noi, SEO, până la 8 pagini" },
        shopRedesign: { name: "Redesign magazin online", hint: "Magazin nou cu produsele tale mutate" },
    },
    en: {
        refresh: { name: "Refresh", hint: "New design, same structure, up to 5 pages" },
        complete: { name: "Complete redesign", hint: "New structure and copy, SEO, up to 8 pages" },
        shopRedesign: { name: "Online store redesign", hint: "New store with your products migrated" },
    },
} as const;

export const carePlan = { RON: 149, EUR: 39 };

export const addOns = {
    redesign: { RON: 1490, EUR: 450 },
    extraPage: { RON: 290, EUR: 90 },
    extraLanguage: { RON: 590, EUR: 190 },
};

export function formatPrice(value: number, language: "ro" | "en") {
    return language === "ro"
        ? `${value.toLocaleString("ro-RO")} lei`
        : `€${value.toLocaleString("en-US")}`;
}

export const pricingCopy = {
    ro: {
        eyebrow: "PACHETE ȘI PREȚURI",
        title: "Prețuri clare.",
        subtitle: "Fără surprize.",
        intro:
            "Preț fix, stabilit înainte de start. Lucrăm cu firme din România și din străinătate. Pentru clienții internaționali, prețurile sunt în euro.",
        from: "de la",
        popular: "Cel mai ales",
        choose: "Alege pachetul",
        delivery: "Livrare",
        packages: {
            start: {
                name: "Start",
                tagline: "O pagină care aduce clienți",
                bestFor: "Pentru: freelanceri, meseriași, evenimente, lansări de produs",
                delivery: "5–7 zile",
                features: [
                    "Landing page cu design personalizat (nu șablon)",
                    "Optimizat pentru telefon, tabletă și desktop",
                    "Formular de contact + buton WhatsApp / apel",
                    "SEO de bază: titluri, descrieri, sitemap",
                    "Profil Google Business configurat",
                    "Google Analytics instalat",
                    "2 runde de modificări",
                    "1 lună suport gratuit după lansare",
                ],
            },
            business: {
                name: "Business",
                tagline: "Site complet de prezentare",
                bestFor: "Pentru: clinici, service-uri, restaurante, firme de construcții",
                delivery: "2–3 săptămâni",
                features: [
                    "Tot ce include Start, plus:",
                    "Până la 6 pagini (Acasă, Servicii, Despre, Galerie, Contact…)",
                    "Ajutor la scrierea textelor",
                    "Formular de cerere ofertă sau programare",
                    "SEO on-page complet și viteză optimizată (scor 90+)",
                    "Domeniu .ro sau .com inclus primul an",
                    "Pagini GDPR: politică de confidențialitate și cookie-uri",
                    "3 luni suport gratuit după lansare",
                ],
            },
            ecommerce: {
                name: "Magazin online",
                tagline: "Vinde online, 24/7",
                bestFor: "Pentru: magazine locale, producători, branduri noi",
                delivery: "4–6 săptămâni",
                features: [
                    "Tot ce include Business, plus:",
                    "Catalog de produse cu categorii și filtre",
                    "Coș de cumpărături și plată cu cardul (Stripe)",
                    "Panou de administrare: produse, stoc, comenzi",
                    "Email automat de confirmare a comenzii",
                    "Până la 30 de produse adăugate de noi",
                    "Pagini legale: termeni, retur, ANPC",
                    "Instruire: cum îți administrezi singur magazinul",
                ],
            },
        },
        care: {
            title: "Mentenanță",
            price: "/ lună",
            text: "Găzduire, certificat SSL, backup, actualizări de securitate, monitorizare și până la 1 oră de modificări pe lună. Opțional, fără contract pe termen lung.",
        },
        addOnsTitle: "Extra",
        addOns: {
            redesign: "Redesign pentru un site existent",
            extraPage: "Pagină suplimentară",
            extraLanguage: "Versiune într-o limbă în plus",
        },
        note: "Ai nevoie de altceva (aplicație web, portal pentru clienți, integrare)? Cere o ofertă personalizată.",
        custom: "Cere ofertă personalizată",
    },
    en: {
        eyebrow: "PACKAGES & PRICING",
        title: "Clear pricing.",
        subtitle: "No surprises.",
        intro:
            "Fixed price agreed before we start. We work with businesses in Romania and abroad, fully remote, in English.",
        from: "from",
        popular: "Most popular",
        choose: "Choose package",
        delivery: "Delivery",
        packages: {
            start: {
                name: "Start",
                tagline: "One page that brings in clients",
                bestFor: "For: freelancers, tradespeople, events, product launches",
                delivery: "5–7 days",
                features: [
                    "Custom-designed landing page (no templates)",
                    "Optimised for phone, tablet and desktop",
                    "Contact form + WhatsApp / call button",
                    "Basic SEO: titles, descriptions, sitemap",
                    "Google Business Profile setup",
                    "Google Analytics installed",
                    "2 rounds of revisions",
                    "1 month of free support after launch",
                ],
            },
            business: {
                name: "Business",
                tagline: "Complete business website",
                bestFor: "For: clinics, workshops, restaurants, construction companies",
                delivery: "2–3 weeks",
                features: [
                    "Everything in Start, plus:",
                    "Up to 6 pages (Home, Services, About, Gallery, Contact…)",
                    "Help writing your website copy",
                    "Quote request or booking form",
                    "Full on-page SEO and optimised speed (90+ score)",
                    "Domain (.com or local) included for the first year",
                    "GDPR pages: privacy and cookie policy",
                    "3 months of free support after launch",
                ],
            },
            ecommerce: {
                name: "Online store",
                tagline: "Sell online, 24/7",
                bestFor: "For: local shops, makers, new brands",
                delivery: "4–6 weeks",
                features: [
                    "Everything in Business, plus:",
                    "Product catalogue with categories and filters",
                    "Shopping cart and card payments (Stripe)",
                    "Admin panel: products, stock, orders",
                    "Automatic order confirmation emails",
                    "Up to 30 products added for you",
                    "Legal pages: terms, returns, consumer info",
                    "Training: how to manage your store yourself",
                ],
            },
        },
        care: {
            title: "Care plan",
            price: "/ month",
            text: "Hosting, SSL certificate, backups, security updates, monitoring and up to 1 hour of edits per month. Optional, no long-term contract.",
        },
        addOnsTitle: "Add-ons",
        addOns: {
            redesign: "Redesign of an existing website",
            extraPage: "Extra page",
            extraLanguage: "Additional language version",
        },
        note: "Need something else (web app, client portal, integrations)? Ask for a custom quote.",
        custom: "Request a custom quote",
    },
} as const;