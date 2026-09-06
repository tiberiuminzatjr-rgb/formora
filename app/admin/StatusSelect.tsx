"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type StatusSelectProps = {
    requestId: string;
    currentStatus: string;
};

const statuses = [
    {
        value: "new",
        label: "New",
    },
    {
        value: "reviewing",
        label: "Reviewing",
    },
    {
        value: "quote_sent",
        label: "Quote sent",
    },
    {
        value: "in_progress",
        label: "In progress",
    },
    {
        value: "ready",
        label: "Ready",
    },
    {
        value: "completed",
        label: "Completed",
    },
];

export default function StatusSelect({
                                         requestId,
                                         currentStatus,
                                     }: StatusSelectProps) {
    const router = useRouter();

    const [status, setStatus] = useState(currentStatus);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleStatusChange(
        event: React.ChangeEvent<HTMLSelectElement>
    ) {
        const newStatus = event.target.value;
        const previousStatus = status;

        setStatus(newStatus);
        setIsSaving(true);
        setErrorMessage("");

        try {
            const response = await fetch("/api/admin/status", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestId,
                    status: newStatus,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Could not update status."
                );
            }

            router.refresh();
        } catch (error) {
            setStatus(previousStatus);

            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Could not update status.");
            }
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div>
            <div className="flex items-center gap-3">
                <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={isSaving}
                    className="cursor-pointer rounded-xl border border-white/10 bg-[#111114] px-4 py-2 text-xs text-white/70 outline-none transition hover:border-blue-500/40 focus:border-blue-500/60 disabled:cursor-wait disabled:opacity-50"
                >
                    {statuses.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

                {isSaving && (
                    <span className="text-xs text-blue-400">
                        Saving...
                    </span>
                )}
            </div>

            {errorMessage && (
                <p className="mt-2 text-xs text-red-400">
                    {errorMessage}
                </p>
            )}
        </div>
    );
}