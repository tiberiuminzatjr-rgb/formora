"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NorvaAdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleLogin(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setErrorMessage("");
        setIsLoading(true);

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            console.error("NØRVA admin login error:", error);
            setErrorMessage("Invalid email or password.");
            setIsLoading(false);
            return;
        }

        router.push("/admin/norva/orders");
        router.refresh();
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F0E8] px-6 text-[#181714]">
            {/* BACKGROUND */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B89A63]/10 blur-[170px]" />

            <div className="relative w-full max-w-md">
                {/* BRAND */}
                <div className="mb-12 text-center">
                    <Link
                        href="/showcase/norva"
                        className="inline-block text-2xl font-medium tracking-[0.32em]"
                    >
                        NØRVA
                    </Link>

                    <p className="mt-3 text-[9px] uppercase tracking-[0.3em] text-[#A48654]">
                        Copenhagen · Administration
                    </p>

                    <h1 className="mt-10 text-4xl font-light tracking-[-0.04em]">
                        Welcome back.
                    </h1>

                    <p className="mt-3 text-sm font-light text-black/40">
                        Sign in to manage NØRVA orders.
                    </p>
                </div>

                {/* LOGIN */}
                <form
                    onSubmit={handleLogin}
                    className="border border-black/10 bg-[#FAF8F3] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.06)]"
                >
                    {/* EMAIL */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-black/40"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="admin@norva.com"
                            autoComplete="email"
                            required
                            className="w-full border border-black/10 bg-transparent px-4 py-4 text-sm outline-none transition placeholder:text-black/20 focus:border-[#A48654]"
                        />
                    </div>

                    {/* PASSWORD */}
                    <div className="mt-6">
                        <label
                            htmlFor="password"
                            className="mb-3 block text-[9px] uppercase tracking-[0.22em] text-black/40"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            className="w-full border border-black/10 bg-transparent px-4 py-4 text-sm outline-none transition placeholder:text-black/20 focus:border-[#A48654]"
                        />
                    </div>

                    {/* ERROR */}
                    {errorMessage && (
                        <div className="mt-5 border border-red-900/10 bg-red-950/[0.03] px-4 py-3 text-xs text-red-800">
                            {errorMessage}
                        </div>
                    )}

                    {/* LOGIN */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-7 w-full bg-[#181714] px-6 py-4 text-[10px] font-medium uppercase tracking-[0.22em] text-[#F7F4EE] transition hover:bg-[#A48654] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading
                            ? "SIGNING IN..."
                            : "ENTER ADMIN"}
                    </button>

                    <p className="mt-6 text-center text-[9px] uppercase tracking-[0.18em] text-black/25">
                        Authorized personnel only
                    </p>
                </form>

                <div className="mt-8 text-center">
                    <Link
                        href="/showcase/norva"
                        className="text-[9px] uppercase tracking-[0.2em] text-black/30 transition hover:text-[#A48654]"
                    >
                        ← Return to NØRVA
                    </Link>
                </div>
            </div>
        </main>
    );
}