"use client";

import { useState } from "react";

type DownloadButtonProps = {
    fileId: string;
};

export default function DownloadButton({
                                           fileId,
                                       }: DownloadButtonProps) {
    const [isDownloading, setIsDownloading] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function handleDownload() {
        setIsDownloading(true);
        setErrorMessage("");

        try {
            const response = await fetch(
                "/api/admin/files/download",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileId,
                    }),
                }
            );

            const contentType =
                response.headers.get("content-type");

            if (
                !contentType?.includes(
                    "application/json"
                )
            ) {
                const text = await response.text();

                console.error(
                    "Server returned non-JSON response:",
                    text
                );

                throw new Error(
                    `Server error (${response.status}). Check the terminal.`
                );
            }

            const data = await response.json();

            if (!response.ok) {
                console.error(
                    "Download API response:",
                    data
                );

                throw new Error(
                    data.details ||
                    data.error ||
                    "Could not download file."
                );
            }

            if (!data.url) {
                throw new Error(
                    "Download URL was not returned."
                );
            }

            const link =
                document.createElement("a");

            link.href = data.url;
            link.download =
                data.fileName || "download";

            link.style.display = "none";

            document.body.appendChild(link);

            link.click();

            link.remove();
        } catch (error) {
            console.error(
                "Download button error:",
                error
            );

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage(
                    "Could not download file."
                );
            }
        } finally {
            setIsDownloading(false);
        }
    }

    return (
        <div className="flex flex-col items-end gap-1">
            <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="shrink-0 rounded-xl border border-blue-500/20 bg-blue-500/[0.08] px-4 py-2 text-xs font-medium text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/[0.14] hover:text-blue-200 disabled:cursor-wait disabled:opacity-50"
            >
                {isDownloading
                    ? "Preparing..."
                    : "Download"}
            </button>

            {errorMessage && (
                <p className="mt-1 max-w-[250px] text-right text-[10px] text-red-400">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}