"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

type QuoteEditorProps = {
    requestId: string;

    quote:
        | {
        amount: number;
        currency: string;
        description: string | null;
        status: string;
    }
        | null;
};

const statusLabels: Record<
    string,
    string
> = {
    draft: "Draft",
    sent: "Sent",
    accepted: "Accepted",
    declined: "Declined",
};

export default function QuoteEditor({
                                        requestId,
                                        quote,
                                    }: QuoteEditorProps) {
    const router = useRouter();

    const [amount, setAmount] =
        useState(
            quote
                ? String(quote.amount)
                : ""
        );

    const [currency, setCurrency] =
        useState(
            quote?.currency || "RON"
        );

    const [
        description,
        setDescription,
    ] = useState(
        quote?.description || ""
    );

    const [isSaving, setIsSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    async function submitQuote(
        action: "save" | "send"
    ) {
        setIsSaving(true);
        setMessage("");
        setError("");

        try {
            const response = await fetch(
                "/api/admin/quote",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        requestId,
                        amount,
                        currency,
                        description,
                        action,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.details ||
                    data.error ||
                    "Could not save quote."
                );
            }

            setMessage(
                action === "send"
                    ? "Quote sent."
                    : "Draft saved."
            );

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError(
                    "Could not save quote."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        void submitQuote("save");
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
        >
            {quote && (
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <span className="text-xs text-white/30">
                        Quote status
                    </span>

                    <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
                        {statusLabels[
                            quote.status
                            ] || quote.status}
                    </span>
                </div>
            )}

            <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Quote value
                </label>

                <div className="mt-2 grid grid-cols-[1fr_110px] gap-3">
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(event) =>
                            setAmount(
                                event.target
                                    .value
                            )
                        }
                        placeholder="1500"
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/50"
                    />

                    <select
                        value={currency}
                        onChange={(event) =>
                            setCurrency(
                                event.target
                                    .value
                            )
                        }
                        className="rounded-2xl border border-white/10 bg-[#111114] px-4 py-3 text-sm text-white outline-none focus:border-blue-500/50"
                    >
                        <option value="RON">
                            RON
                        </option>

                        <option value="EUR">
                            EUR
                        </option>
                    </select>
                </div>
            </div>

            <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    What&apos;s included
                </label>

                <textarea
                    rows={7}
                    maxLength={10000}
                    value={description}
                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }
                    placeholder={`Full website redesign
Mobile optimization
Contact form
Basic SEO setup`}
                    className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/50"
                />
            </div>

            {message && (
                <p className="text-xs text-green-400">
                    {message}
                </p>
            )}

            {error && (
                <p className="text-xs text-red-400">
                    {error}
                </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                <button
                    type="submit"
                    disabled={
                        isSaving || !amount
                    }
                    className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
                >
                    {isSaving
                        ? "Saving..."
                        : "Save draft"}
                </button>

                <button
                    type="button"
                    disabled={
                        isSaving || !amount
                    }
                    onClick={() =>
                        void submitQuote(
                            "send"
                        )
                    }
                    className="rounded-xl bg-blue-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:opacity-40"
                >
                    {isSaving
                        ? "Working..."
                        : quote?.status ===
                        "sent"
                            ? "Update & resend"
                            : "Send quote"}
                </button>
            </div>
        </form>
    );
}