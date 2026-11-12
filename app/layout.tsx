import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.formora.ro"),

  title: {
    default: "FORMORA — Creare site-uri web în Cluj-Napoca și remote",
    template: "%s | FORMORA",
  },

  description:
      "Creare site-uri de prezentare, redesign și magazine online pentru firme din România și din străinătate. Preț fix, de la 1.490 lei. FORMORA, Cluj-Napoca.",

  keywords: [
    "FORMORA",
    "web development Cluj",
    "web design Cluj",
    "website redesign Cluj",
    "creare site Cluj",
    "creare site web Cluj-Napoca",
    "3D scanning Cluj",
    "scanare 3D Cluj",
    "3D printing Cluj",
    "printare 3D Cluj",
    "website development Romania",
    "web developer Romania",
    "website design Eastern Europe",
    "pret site prezentare",
    "magazin online Cluj",
  ],

  authors: [{ name: "FORMORA" }],
  creator: "FORMORA",
  publisher: "FORMORA",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ro_RO",
    alternateLocale: ["en_US"],
    url: "https://www.formora.ro",
    siteName: "FORMORA",
    title: "FORMORA — Digital ideas. Made real.",
    description:
        "Site-uri moderne, redesign și magazine online pentru firme din România și internaționale.",
  },

  twitter: {
    card: "summary_large_image",
    title: "FORMORA — Digital ideas. Made real.",
    description:
        "Site-uri de prezentare · Redesign · Magazine online",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html
          lang="ro"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
          suppressHydrationWarning
      >
      <body className="min-h-full flex flex-col">
      <LanguageProvider>
        {children}
      </LanguageProvider>
      </body>
      </html>
  );
}
