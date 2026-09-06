"use client";

import { useState } from "react";

type ClientDownloadButtonProps = {
    fileId: string;
};

export default function ClientDownloadButton({
                                                 fileId,
                                             }: ClientDownloadButtonProps) {
    const [isLoading, setIsLoading] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function handleDownload() {
        try {
            setIsLoading(true);
            setErrorMessage("");

            const response = await fetch(
                "/api/client/files/download",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        fileId,
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
                    "Download API returned non-JSON:",
                    text
                );

                throw new Error(
                    `Server error (${response.status}). Check route.ts.`
                );
            }

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Download failed."
                );
            }

            if (!data.url) {
                throw new Error(
                    "Download URL missing."
                );
            }

            /*
             * Signed URL is valid only briefly.
             */
            window.location.href = data.url;
        } catch (error) {
            console.error(
                "Download error:",
                error
            );

            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Download failed."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="shrink-0">
            <button
                type="button"
                onClick={handleDownload}
                disabled={isLoading}
                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:border-blue-500/30 hover:bg-blue-500/[0.05] hover:text-blue-300 disabled:cursor-wait disabled:opacity-50"
            >
                {isLoading
                    ? "Preparing..."
                    : "Download"}
            </button>

            {errorMessage && (
                <p className="mt-2 max-w-[180px] text-xs text-red-400">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}