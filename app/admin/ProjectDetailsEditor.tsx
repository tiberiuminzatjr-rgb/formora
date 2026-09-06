"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ProjectDetailsEditorProps = {
    requestId: string;
    currentValue: number | null;
    currentCurrency: string | null;
    currentDeadline: string | null;
};

export default function ProjectDetailsEditor({
                                                 requestId,
                                                 currentValue,
                                                 currentCurrency,
                                                 currentDeadline,
                                             }: ProjectDetailsEditorProps) {
    const router = useRouter();

    const [projectValue, setProjectValue] =
        useState(
            currentValue !== null
                ? String(currentValue)
                : ""
        );

    const [currency, setCurrency] =
        useState(currentCurrency || "RON");

    const [deadline, setDeadline] =
        useState(currentDeadline || "");

    const [isSaving, setIsSaving] =
        useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setIsSaving(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            const response = await fetch(
                "/api/admin/project-details",
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        requestId,
                        projectValue,
                        currency,
                        deadline,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.details ||
                    data.error ||
                    "Could not save project."
                );
            }

            setSuccessMessage("Project updated.");

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    "Could not save project."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
        >
            <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                    Project value
                </label>

                <div className="mt-2 grid grid-cols-[1fr_110px] gap-3">
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={projectValue}
                        onChange={(event) =>
                            setProjectValue(
                                event.target.value
                            )
                        }
                        placeholder="1500"
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/50"
                    />

                    <select
                        value={currency}
                        onChange={(event) =>
                            setCurrency(
                                event.target.value
                            )
                        }
                        className="rounded-2xl border border-white/10 bg-[#111114] px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
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
                    Deadline
                </label>

                <input
                    type="date"
                    value={deadline}
                    onChange={(event) =>
                        setDeadline(
                            event.target.value
                        )
                    }
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500/50"
                />
            </div>

            {successMessage && (
                <p className="text-xs text-green-400">
                    {successMessage}
                </p>
            )}

            {errorMessage && (
                <p className="text-xs text-red-400">
                    {errorMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-xl bg-blue-500 px-5 py-3 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:cursor-wait disabled:opacity-50"
            >
                {isSaving
                    ? "Saving..."
                    : "Save project details"}
            </button>
        </form>
    );
}