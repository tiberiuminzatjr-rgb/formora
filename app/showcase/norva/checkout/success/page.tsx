"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartProvider";

type VerificationState =
    | "loading"
    | "success"
    | "failed";

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();

    const [status, setStatus] =
        useState<VerificationState>("loading");

    const [orderTotal, setOrderTotal] =
        useState<number | null>(null);

    const [currency, setCurrency] =
        useState<string>("EUR");

    useEffect(() => {
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            setStatus("failed");
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await fetch(
                    `/api/norva/verify-session?session_id=${encodeURIComponent(
                        sessionId
                    )}`,
                    {
                        method: "GET",
                        cache: "no-store",
                    }
                );

                const data = await response.json();

                if (!response.ok || !data.verified) {
                    setStatus("failed");
                    return;
                }

                if (typeof data.order?.amountTotal === "number") {
                    setOrderTotal(data.order.amountTotal / 100);
                }

                if (data.order?.currency) {
                    setCurrency(
                        String(data.order.currency).toUpperCase()
                    );
                }

                // Only clear the bag AFTER Stripe confirms payment.
                clearCart();

                setStatus("success");
            } catch (error) {
                console.error(
                    "Payment verification failed:",
                    error
                );

                setStatus("failed");
            }
        };

        verifyPayment();
    }, [searchParams, clearCart]);

    /* ---------------- VERIFYING ---------------- */

    if (status === "loading") {
        return (
            <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">
                <header className="flex h-24 items-center justify-between border-b border-black/10 px-8 md:px-14 lg:px-20">
                    <Link
                        href="/showcase/norva"
                        className="text-2xl font-medium tracking-[0.28em]"
                    >
                        NØRVA
                    </Link>

                    <p className="text-[9px] tracking-[0.22em] text-black/40">
                        SECURE CHECKOUT
                    </p>
                </header>

                <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-8 text-center">
                    <div>
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border border-black/15 border-t-[#A48654]" />

                        <p className="mt-8 text-[10px] tracking-[0.28em] text-[#A48654]">
                            VERIFYING PAYMENT
                        </p>

                        <h1 className="mt-5 text-4xl font-light tracking-[-0.03em] md:text-5xl">
                            Just a moment.
                        </h1>

                        <p className="mt-4 text-sm font-light text-black/40">
                            We&apos;re confirming your payment securely.
                        </p>
                    </div>
                </section>
            </main>
        );
    }

    /* ---------------- FAILED ---------------- */

    if (status === "failed") {
        return (
            <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">
                <header className="flex h-24 items-center justify-between border-b border-black/10 px-8 md:px-14 lg:px-20">
                    <Link
                        href="/showcase/norva"
                        className="text-2xl font-medium tracking-[0.28em]"
                    >
                        NØRVA
                    </Link>

                    <p className="text-[9px] tracking-[0.22em] text-black/40">
                        PAYMENT STATUS
                    </p>
                </header>

                <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-8 py-20 text-center">
                    <div className="max-w-2xl">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-black/20">
              <span className="text-xl font-light">
                ×
              </span>
                        </div>

                        <p className="mt-10 text-[10px] tracking-[0.28em] text-black/40">
                            PAYMENT COULD NOT BE VERIFIED
                        </p>

                        <h1 className="mt-6 text-5xl font-light tracking-[-0.04em] md:text-7xl">
                            Something went wrong.
                        </h1>

                        <p className="mx-auto mt-7 max-w-md text-sm font-light leading-7 text-black/50">
                            We couldn&apos;t confirm this payment with
                            Stripe. Your bag has not been cleared.
                        </p>

                        <Link
                            href="/showcase/norva/checkout"
                            className="mt-10 inline-flex h-14 items-center justify-center bg-[#1B1B1B] px-10 text-[10px] tracking-[0.22em] text-[#F7F4EE] transition hover:bg-[#A48654]"
                        >
                            RETURN TO CHECKOUT
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    /* ---------------- SUCCESS ---------------- */

    return (
        <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">
            <header className="flex h-24 items-center justify-between border-b border-black/10 px-8 md:px-14 lg:px-20">
                <Link
                    href="/showcase/norva"
                    className="text-2xl font-medium tracking-[0.28em]"
                >
                    NØRVA
                </Link>

                <p className="text-[9px] tracking-[0.22em] text-black/40">
                    ORDER CONFIRMED
                </p>
            </header>

            <section className="flex min-h-[calc(100vh-96px)] items-center justify-center px-8 py-20">
                <div className="w-full max-w-3xl text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#A48654]">
            <span className="text-2xl font-light text-[#A48654]">
              ✓
            </span>
                    </div>

                    <p className="mt-10 text-[10px] tracking-[0.28em] text-[#A48654]">
                        PAYMENT SUCCESSFUL
                    </p>

                    <h1 className="mt-6 text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-[86px]">
                        Thank you
                        <br />
                        for your order.
                    </h1>

                    <p className="mx-auto mt-8 max-w-lg text-sm font-light leading-7 text-black/50">
                        Your NØRVA order has been received and your
                        payment has been confirmed securely.
                    </p>

                    <div className="mx-auto mt-12 max-w-md border-y border-black/10 py-6">
                        <div className="flex justify-between text-[9px] tracking-[0.18em]">
              <span className="text-black/40">
                STATUS
              </span>

                            <span>CONFIRMED</span>
                        </div>

                        <div className="mt-5 flex justify-between text-[9px] tracking-[0.18em]">
              <span className="text-black/40">
                PAYMENT
              </span>

                            <span>PAID</span>
                        </div>

                        {orderTotal !== null && (
                            <div className="mt-5 flex justify-between text-[9px] tracking-[0.18em]">
                <span className="text-black/40">
                  TOTAL
                </span>

                                <span>
                  {currency}{" "}
                                    {orderTotal.toLocaleString("en-US", {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    })}
                </span>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/showcase/norva"
                        className="mt-12 inline-flex h-14 items-center justify-center bg-[#1B1B1B] px-10 text-[10px] tracking-[0.22em] text-[#F7F4EE] transition duration-300 hover:bg-[#A48654]"
                    >
                        RETURN TO NØRVA
                    </Link>

                    <p className="mt-16 text-[9px] tracking-[0.2em] text-black/30">
                        NØRVA · COPENHAGEN · 2026
                    </p>
                </div>
            </section>
        </main>
    );
}