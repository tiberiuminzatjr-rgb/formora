import type { ReactNode } from "react";
import PortalAutoTranslate from "@/app/components/PortalAutoTranslate";
import PortalLanguageControls from "@/app/components/PortalLanguageControls";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PortalAutoTranslate />
      <PortalLanguageControls />
      {children}
    </>
  );
}
