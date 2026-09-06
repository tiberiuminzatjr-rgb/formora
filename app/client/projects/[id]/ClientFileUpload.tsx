"use client";

import {
    ChangeEvent,
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

type ClientFileUploadProps = {
    requestId: string;
};

export default function ClientFileUpload({
                                             requestId,
                                         }: ClientFileUploadProps) {
    const router = useRouter();

    const [files, setFiles] =
        useState<File[]>([]);

    const [isUploading, setIsUploading] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const [successMessage, setSuccessMessage] =
        useState("");

    function handleFiles(
        event: ChangeEvent<HTMLInputElement>
    ) {
        setFiles(
            Array.from(
                event.target.files ??
                []
            )
        );

        setErrorMessage("");
        setSuccessMessage("");
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!files.length) {
            return;
        }

        try {
            setIsUploading(true);
            setErrorMessage("");
            setSuccessMessage("");

            const formData =
                new FormData();

            formData.append(
                "requestId",
                requestId
            );

            files.forEach((file) => {
                formData.append(
                    "files",
                    file
                );
            });

            const response =
                await fetch(
                    "/api/client/files/upload",
                    {
                        method: "POST",
                        body: formData,
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
                    "Upload failed."
                );
            }

            setFiles([]);

            setSuccessMessage(
                "Files uploaded successfully."
            );

            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Upload failed."
            );
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5"
        >
            <p className="text-sm font-medium text-white/70">
                Upload new files
            </p>

            <p className="mt-1 text-xs text-white/25">
                STL, STEP, OBJ, images,
                PDF or ZIP. Max 50 MB
                per file.
            </p>

            <label className="mt-4 block cursor-pointer rounded-xl border border-white/10 px-4 py-3 text-center text-xs text-white/50 transition hover:border-blue-500/30 hover:text-blue-300">
                Choose files

                <input
                    type="file"
                    multiple
                    accept=".stl,.step,.stp,.obj,.jpg,.jpeg,.png,.webp,.heic,.pdf,.zip"
                    onChange={
                        handleFiles
                    }
                    className="hidden"
                />
            </label>

            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map(
                        (
                            file,
                            index
                        ) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="rounded-xl border border-white/10 px-3 py-2"
                            >
                                <p className="truncate text-xs text-white/60">
                                    {
                                        file.name
                                    }
                                </p>

                                <p className="mt-1 text-[10px] text-white/20">
                                    {(
                                        file.size /
                                        1024 /
                                        1024
                                    ).toFixed(
                                        2
                                    )}{" "}
                                    MB
                                </p>
                            </div>
                        )
                    )}
                </div>
            )}

            {errorMessage && (
                <p className="mt-4 text-xs text-red-400">
                    {errorMessage}
                </p>
            )}

            {successMessage && (
                <p className="mt-4 text-xs text-green-400">
                    {successMessage}
                </p>
            )}

            <button
                type="submit"
                disabled={
                    isUploading ||
                    files.length === 0
                }
                className="mt-4 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
                {isUploading
                    ? "Uploading..."
                    : "Upload files"}
            </button>
        </form>
    );
}