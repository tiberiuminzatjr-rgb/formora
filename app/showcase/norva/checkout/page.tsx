"use client";

import Link from "next/link";
import { useCart } from "../components/CartProvider";

export default function CheckoutPage() {
    const { items, subtotal } = useCart();
    const handleCheckout = async () => {
        try {
            const response = await fetch("/api/norva/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: items.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    })),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || "Unable to start checkout."
                );
            }

            if (!data.url) {
                throw new Error("Stripe checkout URL missing.");
            }

            window.location.href = data.url;
        } catch (error) {
            console.error("Checkout error:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to start checkout."
            );
        }
    };

    const shipping = subtotal >= 1500 ? 0 : 49;
    const total = subtotal + shipping;

    const money = (value: number) =>
        value.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        });

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">
                <header className="flex h-24 items-center justify-between px-8 md:px-14 lg:px-20">
                    <Link
                        href="/showcase/norva"
                        className="text-2xl font-medium tracking-[0.28em]"
                    >
                        NØRVA
                    </Link>

                    <p className="text-[10px] tracking-[0.22em] text-black/40">
                        SECURE CHECKOUT
                    </p>
                </header>

                <section className="flex min-h-[70vh] flex-col items-center justify-center px-8 text-center">
                    <p className="text-[10px] tracking-[0.28em] text-[#A48654]">
                        YOUR BAG
                    </p>

                    <h1 className="mt-6 text-5xl font-light tracking-[-0.04em] md:text-7xl">
                        Your bag is empty.
                    </h1>

                    <p className="mt-6 max-w-md text-sm font-light leading-7 text-black/50">
                        Discover the NØRVA collection and add a piece before
                        continuing to checkout.
                    </p>

                    <Link
                        href="/showcase/norva#shop"
                        className="mt-10 border-b border-black pb-2 text-[10px] tracking-[0.2em]"
                    >
                        RETURN TO SHOP ↗
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#F7F4EE] text-[#1B1B1B]">
            {/* HEADER */}
            <header className="flex h-24 items-center justify-between border-b border-black/10 px-8 md:px-14 lg:px-20">
                <Link
                    href="/showcase/norva"
                    className="text-2xl font-medium tracking-[0.28em]"
                >
                    NØRVA
                </Link>

                <p className="hidden text-[10px] tracking-[0.22em] text-black/40 sm:block">
                    SECURE CHECKOUT
                </p>

                <Link
                    href="/showcase/norva"
                    className="text-[10px] tracking-[0.18em] transition-opacity hover:opacity-50"
                >
                    CONTINUE SHOPPING
                </Link>
            </header>

            <div className="grid min-h-[calc(100vh-96px)] lg:grid-cols-[1.15fr_0.85fr]">

                {/* LEFT — CUSTOMER DETAILS */}
                <section className="px-8 py-16 md:px-14 lg:px-20 lg:py-20">
                    <div className="mx-auto max-w-2xl">

                        <p className="text-[10px] tracking-[0.28em] text-[#A48654]">
                            CHECKOUT
                        </p>

                        <h1 className="mt-5 text-5xl font-light tracking-[-0.04em] md:text-6xl">
                            Almost yours.
                        </h1>

                        <p className="mt-5 max-w-md text-sm font-light leading-7 text-black/50">
                            Enter your contact and delivery information.
                            Payment will be completed securely in the next step.
                        </p>

                        <form
                            className="mt-14"
                            onSubmit={async (event) => {
                                event.preventDefault();
                                await handleCheckout();
                            }}
                        >
                            {/* CONTACT */}
                            <div>
                                <div className="mb-7 flex items-center justify-between border-b border-black/15 pb-4">
                                    <h2 className="text-lg font-light">
                                        Contact
                                    </h2>

                                    <span className="text-[9px] tracking-[0.18em] text-black/35">
                    01
                  </span>
                                </div>

                                <label className="block">
                  <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                    EMAIL ADDRESS
                  </span>

                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                    />
                                </label>

                                <label className="mt-5 block">
                  <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                    PHONE NUMBER
                  </span>

                                    <input
                                        type="tel"
                                        required
                                        placeholder="+40"
                                        className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                    />
                                </label>
                            </div>

                            {/* DELIVERY */}
                            <div className="mt-14">
                                <div className="mb-7 flex items-center justify-between border-b border-black/15 pb-4">
                                    <h2 className="text-lg font-light">
                                        Delivery
                                    </h2>

                                    <span className="text-[9px] tracking-[0.18em] text-black/35">
                    02
                  </span>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <label>
                    <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                      FIRST NAME
                    </span>

                                        <input
                                            type="text"
                                            required
                                            className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                        />
                                    </label>

                                    <label>
                    <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                      LAST NAME
                    </span>

                                        <input
                                            type="text"
                                            required
                                            className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                        />
                                    </label>
                                </div>

                                <label className="mt-5 block">
                  <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                    ADDRESS
                  </span>

                                    <input
                                        type="text"
                                        required
                                        placeholder="Street and number"
                                        className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                    />
                                </label>

                                <label className="mt-5 block">
                  <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                    APARTMENT / SUITE
                  </span>

                                    <input
                                        type="text"
                                        className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                    />
                                </label>

                                <div className="mt-5 grid gap-5 md:grid-cols-2">
                                    <label>
                    <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                      CITY
                    </span>

                                        <input
                                            type="text"
                                            required
                                            className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                        />
                                    </label>

                                    <label>
                    <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                      POSTAL CODE
                    </span>

                                        <input
                                            type="text"
                                            required
                                            className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                        />
                                    </label>
                                </div>

                                <label className="mt-5 block">
                  <span className="mb-2 block text-[9px] tracking-[0.18em] text-black/45">
                    COUNTRY
                  </span>

                                    <select
                                        required
                                        defaultValue="RO"
                                        className="h-14 w-full border border-black/15 bg-transparent px-4 text-sm outline-none transition focus:border-[#A48654]"
                                    >
                                        <option value="RO">Romania</option>
                                        <option value="NO">Norway</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="IT">Italy</option>
                                        <option value="ES">Spain</option>
                                        <option value="DK">Denmark</option>
                                        <option value="SE">Sweden</option>
                                    </select>
                                </label>
                            </div>

                            {/* PAYMENT PLACEHOLDER */}
                            <div className="mt-14">
                                <div className="mb-7 flex items-center justify-between border-b border-black/15 pb-4">
                                    <h2 className="text-lg font-light">
                                        Payment
                                    </h2>

                                    <span className="text-[9px] tracking-[0.18em] text-black/35">
                    03
                  </span>
                                </div>

                                <div className="border border-[#A48654]/40 bg-[#E9E1D5]/50 p-6">
                                    <p className="text-[10px] tracking-[0.2em] text-[#A48654]">
                                        SECURE PAYMENT
                                    </p>

                                    <p className="mt-3 text-sm font-light leading-6 text-black/50">
                                        You&apos;ll continue to our secure payment
                                        page after reviewing your order.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="mt-10 flex h-16 w-full items-center justify-between bg-[#1B1B1B] px-7 text-[#F7F4EE] transition duration-300 hover:bg-[#A48654]"
                            >
                <span className="text-[10px] tracking-[0.22em]">
                  CONTINUE TO PAYMENT
                </span>

                                <span>
                  €{money(total)} →
                </span>
                            </button>
                        </form>
                    </div>
                </section>

                {/* RIGHT — ORDER SUMMARY */}
                <aside className="border-t border-black/10 bg-[#E9E1D5] px-8 py-16 md:px-14 lg:border-l lg:border-t-0 lg:px-12 lg:py-20">
                    <div className="mx-auto max-w-xl lg:sticky lg:top-10">
                        <div className="flex items-end justify-between border-b border-black/15 pb-5">
                            <div>
                                <p className="text-[9px] tracking-[0.22em] text-[#A48654]">
                                    YOUR ORDER
                                </p>

                                <h2 className="mt-2 text-3xl font-light">
                                    Order summary
                                </h2>
                            </div>

                            <span className="text-xs text-black/40">
                {items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                )}{" "}
                                items
              </span>
                        </div>

                        {/* PRODUCTS */}
                        <div className="divide-y divide-black/10">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[90px_1fr] gap-5 py-6"
                                >
                                    <div className="relative aspect-[4/5] overflow-hidden bg-[#D9D0C3]">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />

                                        <span className="absolute right-2 top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#1B1B1B] px-1 text-[9px] text-white">
                      {item.quantity}
                    </span>
                                    </div>

                                    <div className="flex justify-between gap-5">
                                        <div>
                                            <p className="text-sm">
                                                {item.name}
                                            </p>

                                            <p className="mt-2 text-xs text-black/40">
                                                {item.material}
                                            </p>

                                            <p className="mt-2 text-[9px] tracking-[0.12em] text-black/35">
                                                QTY {item.quantity}
                                            </p>
                                        </div>

                                        <p className="whitespace-nowrap text-sm">
                                            €
                                            {money(
                                                item.price * item.quantity
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TOTALS */}
                        <div className="border-t border-black/15 pt-6">
                            <div className="flex justify-between text-sm">
                <span className="text-black/50">
                  Subtotal
                </span>

                                <span>€{money(subtotal)}</span>
                            </div>

                            <div className="mt-4 flex justify-between text-sm">
                <span className="text-black/50">
                  Shipping
                </span>

                                <span>
                  {shipping === 0
                      ? "Complimentary"
                      : `€${money(shipping)}`}
                </span>
                            </div>

                            {shipping > 0 && (
                                <p className="mt-3 text-[9px] leading-5 text-black/35">
                                    Complimentary delivery on orders over €1,500.
                                </p>
                            )}

                            <div className="mt-7 flex items-end justify-between border-t border-black/15 pt-7">
                                <div>
                                    <p className="text-[9px] tracking-[0.18em] text-black/40">
                                        TOTAL
                                    </p>

                                    <p className="mt-1 text-xs text-black/35">
                                        EUR
                                    </p>
                                </div>

                                <p className="text-3xl font-light">
                                    €{money(total)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-black/10 pt-6">
                            <div className="flex justify-between text-[9px] tracking-[0.15em] text-black/35">
                                <span>SECURE CHECKOUT</span>
                                <span>NØRVA / COPENHAGEN</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
}