"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function ClientLoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setIsLoading(true);
        setErrorMessage("");

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setErrorMessage(
                "Invalid email or password."
            );

            setIsLoading(false);
            return;
        }

        router.push("/client");
        router.refresh();
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0B0B0D] px-6 text-white">
            <div className="w-full max-w-md">

                <div className="mb-10 text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-blue-400">
                        FORMORA
                    </p>

                    <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">
                        Client Portal
                    </h1>

                    <p className="mt-3 text-sm text-white/35">
                        Access your projects,
                        quotes and files.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-[28px] border border-white/10 bg-white/[0.025] p-7"
                >
                    <div>
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                            Email
                        </label>

                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="you@company.com"
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/50"
                        />
                    </div>

                    <div className="mt-5">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="••••••••"
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/50"
                        />
                    </div>

                    {errorMessage && (
                        <p className="mt-4 text-xs text-red-400">
                            {errorMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-6 w-full rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-50"
                    >
                        {isLoading
                            ? "Signing in..."
                            : "Sign in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-white/20">
                    Digital ideas. Made real.
                </p>
            </div>
        </main>
    );
}