"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setErrorMessage("");
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Admin login error:", error);

            setErrorMessage("Invalid email or password.");
            setIsLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0B0D] px-6 text-white">
            {/* Background glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/[0.08] blur-[160px]" />

            <div className="relative w-full max-w-md">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                        FORMORA
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                        Admin access
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-white/40">
                        Sign in to manage FORMORA projects.
                    </p>
                </div>

                {/* Login card */}
                <form
                    onSubmit={handleLogin}
                    className="rounded-[30px] border border-white/10 bg-white/[0.025] p-7 backdrop-blur-xl md:p-8"
                >
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30"
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="admin@formora.ro"
                            autoComplete="email"
                            required
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                        />
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                        <label
                            htmlFor="password"
                            className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/30"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                        />
                    </div>

                    {/* Error */}
                    {errorMessage && (
                        <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm text-red-300">
                            {errorMessage}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full rounded-2xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </button>

                    <p className="mt-5 text-center text-xs text-white/20">
                        Authorized FORMORA personnel only.
                    </p>
                </form>

                <p className="mt-8 text-center text-xs text-white/15">
                    FORMORA · Digital ideas. Made real.
                </p>
            </div>
        </main>
    );
}