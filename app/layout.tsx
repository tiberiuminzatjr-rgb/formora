import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    default: "FORMORA — Web Development, 3D Scanning & 3D Printing",
    template: "%s | FORMORA",
  },

  description:
      "FORMORA creates modern websites and provides professional 3D scanning and 3D printing solutions in Cluj-Napoca. Digital ideas. Made real.",

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
  ],

  authors: [{ name: "FORMORA" }],
  creator: "FORMORA",
  publisher: "FORMORA",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.formora.ro",
    siteName: "FORMORA",
    title: "FORMORA — Digital ideas. Made real.",
    description:
        "Modern websites, professional 3D scanning and 3D printing solutions in Cluj-Napoca.",
  },

  twitter: {
    card: "summary_large_image",
    title: "FORMORA — Digital ideas. Made real.",
    description:
        "Web Development · 3D Scanning · 3D Printing",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">{children}</body>
      </html>
  );
}