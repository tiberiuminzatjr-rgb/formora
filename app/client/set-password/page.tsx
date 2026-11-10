
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useLanguage } from "@/app/components/LanguageProvider";

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SetPasswordPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const isRo = language === "ro";

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");
    const [checking, setChecking] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        let active = true;

        async function checkSession() {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (!active) return;

            if (error || !user) {
                router.replace("/client/login");
                return;
            }

            setChecking(false);
        }

        checkSession();

        return () => {
            active = false;
        };
    }, [router]);

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();
        setError("");

        if (password.length < 12) {
            setError(
                isRo
                    ? "Parola trebuie să conțină minimum 12 caractere."
                    : "Password must contain at least 12 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError(
                isRo
                    ? "Parolele nu coincid."
                    : "Passwords do not match."
            );
            return;
        }

        setLoading(true);

        const { error: updateError } =
            await supabase.auth.updateUser({
                password,
            });

        if (updateError) {
            setError(
                isRo
                    ? "Parola nu a putut fi salvată. Încearcă din nou."
                    : "Could not save your password. Please try again."
            );
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);

        router.replace("/client");
        router.refresh();
    }

    if (checking) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#0B0B0D] px-6 text-white">
                <p className="text-sm text-white/50">
                    {isRo ? "Verificăm invitația..." : "Verifying invitation..."}
                </p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0B0B0D] px-6 py-16 text-white">
            <div className="w-full max-w-md">
                <div className="mb-10 text-center">
                    <a
                        href="/"
                        className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-400"
                    >
                        FORMORA
                    </a>

                    <h1 className="mt-6 text-4xl font-semibold tracking-tight">
                        {isRo
                            ? "Bun venit în Formora."
                            : "Welcome to Formora."}
                    </h1>

                    <p className="mt-4 text-sm leading-7 text-white/45">
                        {isRo
                            ? "Contul tău este aproape gata. Alege o parolă pentru a accesa proiectele, ofertele și fișierele tale."
                            : "Your account is almost ready. Create a password to access your projects, quotes and files."}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-[28px] border border-white/10 bg-white/[0.025] p-7 sm:p-9"
                >
                    <div className="mb-8">
                        <div className="mb-3 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                ✦
              </span>
                            <div>
                                <p className="text-sm font-medium">
                                    {isRo
                                        ? "Activează-ți contul"
                                        : "Activate your account"}
                                </p>
                                <p className="text-xs text-white/35">
                                    {isRo
                                        ? "Acces securizat la portal"
                                        : "Secure portal access"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <label
                        htmlFor="password"
                        className="text-xs font-medium text-white/60"
                    >
                        {isRo ? "Parolă nouă" : "New password"}
                    </label>

                    <input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={12}
                        maxLength={128}
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        placeholder={isRo ? "Minimum 12 caractere" : "At least 12 characters"}
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                    />

                    <label
                        htmlFor="confirm-password"
                        className="mt-6 block text-xs font-medium text-white/60"
                    >
                        {isRo
                            ? "Confirmă parola"
                            : "Confirm password"}
                    </label>

                    <input
                        id="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={12}
                        maxLength={128}
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder={
                            isRo
                                ? "Introdu parola din nou"
                                : "Enter your password again"
                        }
                        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/60"
                    />

                    {error && (
                        <p role="alert" className="mt-5 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p role="status" className="mt-5 text-sm text-green-400">
                            {isRo
                                ? "Parola a fost salvată!"
                                : "Your password has been saved!"}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="mt-8 w-full rounded-2xl bg-blue-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-50"
                    >
                        {loading
                            ? isRo
                                ? "Se salvează..."
                                : "Saving..."
                            : isRo
                                ? "Activează contul și continuă"
                                : "Activate account and continue"}
                    </button>

                    <p className="mt-6 text-center text-xs leading-6 text-white/30">
                        {isRo
                            ? "Parola ta este gestionată securizat prin Supabase Auth."
                            : "Your password is securely managed by Supabase Auth."}
                    </p>
                </form>

                <p className="mt-8 text-center text-xs text-white/25">
                    FORMORA · Digital ideas. Made real.
                </p>
            </div>
        </main>
    );
}
