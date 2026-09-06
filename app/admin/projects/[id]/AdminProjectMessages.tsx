"use client";

import {
    FormEvent,
    useState,
} from "react";

import { useRouter } from "next/navigation";

type Message = {
    id: string;
    message: string;
    sender_id: string;
    created_at: string;
};

type AdminProjectMessagesProps = {
    requestId: string;
    currentUserId: string;
    messages: Message[];
};

export default function AdminProjectMessages({
                                                 requestId,
                                                 currentUserId,
                                                 messages,
                                             }: AdminProjectMessagesProps) {
    const router = useRouter();

    const [message, setMessage] =
        useState("");

    const [isSending, setIsSending] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        const cleanMessage =
            message.trim();

        if (!cleanMessage) {
            return;
        }

        try {
            setIsSending(true);
            setErrorMessage("");

            const response = await fetch(
                "/api/admin/messages",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        requestId,
                        message: cleanMessage,
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
                    "Admin message API returned non-JSON:",
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
                    "Could not send message."
                );
            }

            setMessage("");

            router.refresh();
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : "Could not send message."
            );
        } finally {
            setIsSending(false);
        }
    }

    return (
        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                        Messages
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">
                        Client conversation
                    </h2>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/30">
                    {messages.length}
                </span>
            </div>

            <div className="mt-7 max-h-[500px] space-y-4 overflow-y-auto pr-1">
                {messages.length > 0 ? (
                    messages.map((item) => {
                        const isMine =
                            item.sender_id ===
                            currentUserId;

                        return (
                            <div
                                key={item.id}
                                className={`flex ${
                                    isMine
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                                        isMine
                                            ? "bg-blue-500 text-white"
                                            : "border border-white/10 bg-black/30 text-white/70"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                                        {item.message}
                                    </p>

                                    <p
                                        className={`mt-2 text-[10px] ${
                                            isMine
                                                ? "text-white/60"
                                                : "text-white/20"
                                        }`}
                                    >
                                        {isMine
                                            ? "FORMORA"
                                            : "Client"}

                                        {" · "}

                                        {new Date(
                                            item.created_at
                                        ).toLocaleString(
                                            "ro-RO",
                                            {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                        <p className="text-sm text-white/30">
                            No messages yet.
                        </p>
                    </div>
                )}
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-6 border-t border-white/10 pt-6"
            >
                <textarea
                    value={message}
                    onChange={(event) =>
                        setMessage(
                            event.target.value
                        )
                    }
                    maxLength={5000}
                    rows={4}
                    placeholder="Write a message to the client..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-blue-500/40"
                />

                <div className="mt-3 flex items-center justify-between gap-4">
                    <div>
                        {errorMessage && (
                            <p className="text-xs text-red-400">
                                {errorMessage}
                            </p>
                        )}

                        {!errorMessage && (
                            <p className="text-[10px] text-white/15">
                                {message.length} / 5000
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={
                            isSending ||
                            !message.trim()
                        }
                        className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {isSending
                            ? "Sending..."
                            : "Send message"}
                    </button>
                </div>
            </form>
        </section>
    );
}