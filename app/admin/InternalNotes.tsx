"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type InternalNotesProps = {
    requestId: string;
};

export default function InternalNotes({
                                          requestId,
                                      }: InternalNotesProps) {
    const router = useRouter();

    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            setErrorMessage("Write a note first.");
            return;
        }

        setIsSaving(true);
        setErrorMessage("");

        try {
            const response = await fetch(
                "/api/admin/notes",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        requestId,
                        content: trimmedContent,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Could not save note."
                );
            }

            setContent("");

            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    "Could not save note."
                );
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6"
        >
            <textarea
                value={content}
                onChange={(event) =>
                    setContent(event.target.value)
                }
                placeholder="Write an internal note..."
                rows={4}
                maxLength={5000}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/50"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    {errorMessage && (
                        <p className="text-xs text-red-400">
                            {errorMessage}
                        </p>
                    )}

                    {!errorMessage && (
                        <p className="text-xs text-white/20">
                            Private · Admin only
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={
                        isSaving ||
                        !content.trim()
                    }
                    className="rounded-xl bg-blue-500 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isSaving
                        ? "Saving..."
                        : "Add note"}
                </button>
            </div>
        </form>
    );
}