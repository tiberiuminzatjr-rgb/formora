"use client";

import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default function PortalLanguageControls() {
  return (
    <div className="fixed right-4 top-3 z-[100] rounded-full border border-white/15 bg-[#0B0B0D]/95 p-1 shadow-xl backdrop-blur-xl sm:right-6">
      <LanguageSwitcher />
    </div>
  );
}
