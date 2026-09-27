"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderStatus =
    | "new"
    | "processing"
    | "shipped"
    | "completed";

type Props = {
    orderId: string;
    initialStatus: string;
};

export default function OrderStatus({
                                        orderId,
                                        initialStatus,
                                    }: Props) {
    const router = useRouter();

    const [status, setStatus] = useState<OrderStatus>(
        initialStatus as OrderStatus
    );

    const [isSaving, setIsSaving] = useState(false);

    async function updateStatus(
        newStatus: OrderStatus
    ) {
        const previousStatus = status;

        setStatus(newStatus);
        setIsSaving(true);

        try {
            const response = await fetch(
                `/api/norva/orders/${orderId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: newStatus,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Could not update order."
                );
            }

            router.refresh();
        } catch (error) {
            console.error(
                "NØRVA status update error:",
                error
            );

            setStatus(previousStatus);

            alert(
                error instanceof Error
                    ? error.message
                    : "Could not update order."
            );
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div>
            <p className="mb-2 text-[9px] uppercase tracking-[0.18em] text-white/25">
                Order status
            </p>

            <select
                value={status}
                disabled={isSaving}
                onChange={(event) =>
                    updateStatus(
                        event.target.value as OrderStatus
                    )
                }
                className="cursor-pointer rounded-full border border-[#B89A63]/30 bg-[#B89A63]/10 px-4 py-2 text-[9px] uppercase tracking-[0.16em] text-[#C9AA72] outline-none transition hover:border-[#B89A63]/60 disabled:cursor-wait disabled:opacity-50"
            >
                <option value="new">
                    NEW
                </option>

                <option value="processing">
                    PROCESSING
                </option>

                <option value="shipped">
                    SHIPPED
                </option>

                <option value="completed">
                    COMPLETED
                </option>
            </select>

            {isSaving && (
                <p className="mt-2 text-[8px] uppercase tracking-[0.16em] text-white/20">
                    Saving...
                </p>
            )}
        </div>
    );
}