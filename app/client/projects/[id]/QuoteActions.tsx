"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuoteActionsProps = {
    requestId: string;
};

export default function QuoteActions({
                                         requestId,
                                     }: QuoteActionsProps) {
    const router = useRouter();

    const [isLoading, setIsLoading] =
        useState<"accept" | "decline" | null>(
            null
        );

    const [errorMessage, setErrorMessage] =
        useState("");

    async function handleAction(
        action: "accept" | "decline"
    ) {
        const confirmed =
            action === "accept"
                ? window.confirm(
                    "Are you sure you want to accept this quote?"
                )
                : window.confirm(
                    "Are you sure you want to decline this quote?"
                );

        if (!confirmed) {
            return;
        }

        try {
            setErrorMessage("");
            setIsLoading(action);

            const response = await fetch(
                "/api/client/quote",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        requestId,
                        action,
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
                const text =
                    await response.text();

                console.error(
                    "Client quote API returned non-JSON:",
                    text
                );

                throw new Error(
                    `API error (${response.status}).`
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Something went wrong."
                );
            }

            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setIsLoading(null);
        }
    }

    return (
        <div className="mt-7 rounded-2xl border border-blue-500/15 bg-blue-500/[0.03] p-5">
            <p className="text-sm font-medium">
                Ready for your decision
            </p>

            <p className="mt-2 text-xs leading-5 text-white/30">
                Review the quote above and choose
                whether you want to continue with
                the project.
            </p>

            {errorMessage && (
                <p className="mt-4 text-xs text-red-400">
                    {errorMessage}
                </p>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    disabled={isLoading !== null}
                    onClick={() =>
                        handleAction("accept")
                    }
                    className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-50"
                >
                    {isLoading === "accept"
                        ? "Accepting..."
                        : "Accept quote"}
                </button>

                <button
                    type="button"
                    disabled={isLoading !== null}
                    onClick={() =>
                        handleAction("decline")
                    }
                    className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/60 transition hover:border-red-500/30 hover:bg-red-500/[0.05] hover:text-red-300 disabled:cursor-wait disabled:opacity-50"
                >
                    {isLoading === "decline"
                        ? "Declining..."
                        : "Decline"}
                </button>
            </div>
        </div>
    );
}