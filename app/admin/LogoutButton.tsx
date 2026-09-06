"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleLogout() {
        setIsLoggingOut(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
            return;
        }

        router.replace("/admin/login");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-3 text-sm text-white/50 transition hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isLoggingOut ? "Signing out..." : "Log out"}
        </button>
    );
}