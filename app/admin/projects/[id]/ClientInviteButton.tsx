"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClientInviteButtonProps = {
    requestId: string;
    email: string;
    isLinked: boolean;
};

export default function ClientInviteButton({
    requestId,
    email,
    isLinked,
}: ClientInviteButtonProps) {
    const router = useRouter();

    const [loading, setLoading] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    async function handleInvite() {
        if (isLinked) {
            return;
        }

        const confirmed =
            window.confirm(
                `Create/link client portal access for ${email}?`
            );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response =
                await fetch(
                    "/api/admin/client-invite",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            requestId,
                        }),
                    }
                );

            const contentType =
                response.headers.get(
                    "content-type"
                );

            if (
                !contentType?.includes(
                    "application/json"
                )
            ) {
                throw new Error(
                    `API error (${response.status}).`
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Could not create client access."
                );
            }

            setMessage(
                data.message ||
                "Client access created."
            );

            router.refresh();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/25">
                        Client Portal
                    </p>

                    <p className="mt-2 text-sm text-white/65">
                        {email}
                    </p>

                    <p className="mt-1 text-xs text-white/25">
                        {isLinked
                            ? "Client account is linked to this project."
                            : "Create or link a client account and send portal access."}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleInvite}
                    disabled={
                        loading ||
                        isLinked
                    }
                    className="shrink-0 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isLinked
                        ? "Client linked"
                        : loading
                        ? "Creating access..."
                        : "Invite client"}
                </button>

            </div>

            {message && (
                <p className="mt-4 text-xs text-emerald-400">
                    {message}
                </p>
            )}

            {error && (
                <p className="mt-4 text-xs text-red-400">
                    {error}
                </p>
            )}

        </div>
    );
}
