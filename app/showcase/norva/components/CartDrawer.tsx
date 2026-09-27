"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

type CartDrawerProps = {
    open: boolean;
    onClose: () => void;
};

export default function CartDrawer({
                                       open,
                                       onClose,
                                   }: CartDrawerProps) {
    const {
        items,
        subtotal,
        removeItem,
        updateQuantity,
    } = useCart();

    const formattedSubtotal = subtotal.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return (
        <>
            {/* OVERLAY */}
            <div
                onClick={onClose}
                className={`fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ${
                    open
                        ? "pointer-events-auto opacity-100"
                        : "pointer-events-none opacity-0"
                }`}
            />

            {/* DRAWER */}
            <aside
                className={`fixed right-0 top-0 z-[100] flex h-screen w-full max-w-[520px] flex-col bg-[#F7F4EE] shadow-2xl transition-transform duration-500 ease-out ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* HEADER */}
                <div className="flex h-24 shrink-0 items-center justify-between border-b border-black/10 px-7 md:px-10">
                    <div>
                        <p className="text-[9px] tracking-[0.24em] text-[#A48654]">
                            NØRVA
                        </p>

                        <h2 className="mt-1 text-2xl font-light">
                            Your bag
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-10 w-10 items-center justify-center text-2xl font-light transition hover:rotate-90"
                        aria-label="Close bag"
                    >
                        ×
                    </button>
                </div>

                {/* CART CONTENT */}
                <div className="flex-1 overflow-y-auto px-7 py-8 md:px-10">
                    {items.length === 0 ? (
                        <div className="flex h-full flex-col items-center justify-center text-center">
                            <p className="text-[10px] tracking-[0.25em] text-[#A48654]">
                                YOUR BAG
                            </p>

                            <h3 className="mt-5 text-4xl font-light tracking-[-0.03em]">
                                It&apos;s quiet in here.
                            </h3>

                            <p className="mt-4 max-w-xs text-sm font-light leading-6 text-black/45">
                                Discover pieces designed to bring calm,
                                warmth and character to your space.
                            </p>

                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-8 border-b border-black pb-2 text-[10px] tracking-[0.2em]"
                            >
                                CONTINUE SHOPPING ↗
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="grid grid-cols-[120px_1fr] gap-5 border-b border-black/10 pb-8"
                                >
                                    {/* IMAGE */}
                                    <Link
                                        href={`/showcase/norva/product/${item.slug}`}
                                        onClick={onClose}
                                        className="block aspect-[4/5] overflow-hidden bg-[#E9E1D5]"
                                    >
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    </Link>

                                    {/* INFO */}
                                    <div className="flex flex-col">
                                        <div className="flex justify-between gap-4">
                                            <div>
                                                <Link
                                                    href={`/showcase/norva/product/${item.slug}`}
                                                    onClick={onClose}
                                                    className="text-sm tracking-wide transition-opacity hover:opacity-50"
                                                >
                                                    {item.name}
                                                </Link>

                                                <p className="mt-2 text-xs text-black/40">
                                                    {item.material}
                                                </p>
                                            </div>

                                            <p className="whitespace-nowrap text-sm">
                                                €
                                                {(item.price * item.quantity).toLocaleString(
                                                    "en-US",
                                                    {
                                                        minimumFractionDigits: 0,
                                                        maximumFractionDigits: 2,
                                                    }
                                                )}
                                            </p>
                                        </div>

                                        {/* QUANTITY */}
                                        <div className="mt-auto flex items-end justify-between pt-6">
                                            <div className="flex h-10 items-center border border-black/15">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (item.quantity === 1) {
                                                            removeItem(item.id);
                                                        } else {
                                                            updateQuantity(
                                                                item.id,
                                                                item.quantity - 1
                                                            );
                                                        }
                                                    }}
                                                    className="flex h-full w-10 items-center justify-center text-base transition hover:bg-black/5"
                                                >
                                                    −
                                                </button>

                                                <span className="flex h-full min-w-9 items-center justify-center text-xs">
                          {item.quantity}
                        </span>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateQuantity(
                                                            item.id,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                    disabled={item.quantity >= item.stock}
                                                    className="flex h-full w-10 items-center justify-center text-base transition hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-25"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeItem(item.id)}
                                                className="text-[9px] tracking-[0.15em] text-black/40 underline underline-offset-4 transition hover:text-black"
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BOTTOM */}
                {items.length > 0 && (
                    <div className="shrink-0 border-t border-black/10 bg-[#F7F4EE] px-7 py-7 md:px-10">
                        <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.2em]">
                SUBTOTAL
              </span>

                            <span className="text-lg font-light">
                €{formattedSubtotal}
              </span>
                        </div>

                        <p className="mt-3 text-[10px] leading-5 text-black/40">
                            Shipping and taxes calculated at checkout.
                        </p>

                        <Link
                            href="/showcase/norva/checkout"
                            onClick={onClose}
                            className="mt-6 flex h-16 w-full items-center justify-between bg-[#1B1B1B] px-7 text-[#F7F4EE] transition duration-300 hover:bg-[#A48654]"
                        >
              <span className="text-[10px] tracking-[0.22em]">
                CHECKOUT
              </span>

                            <span>→</span>
                        </Link>

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-5 w-full text-center text-[9px] tracking-[0.18em] text-black/45 transition hover:text-black"
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}