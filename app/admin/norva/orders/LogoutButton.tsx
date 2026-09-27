"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        await supabase.auth.signOut();

        router.push("/admin/norva/login");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="text-[9px] uppercase tracking-[0.2em] text-black/35 transition hover:text-[#A48654]"
        >
            Logout
        </button>
    );
}