import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Scanare și printare 3D în Cluj-Napoca",
  description:
      "Scanare 3D, modelare și printare 3D în Cluj-Napoca: piese de schimb, prototipuri, modele dentare, machete și obiecte personalizate.",
  alternates: { canonical: "/3d" },
  openGraph: {
    title: "FORMORA 3D — Scanare și printare 3D în Cluj-Napoca",
    description: "Piese de schimb, prototipuri și obiecte personalizate, scanate și printate 3D.",
    url: "https://www.formora.ro/3d",
    locale: "ro_RO",
  },
};

export default function ThreeDLayout({ children }: { children: ReactNode }) {
  return children;
}
