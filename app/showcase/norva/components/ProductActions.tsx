"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

type ProductActionsProps = {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    image_url: string;
    material: string | null;
};

export default function ProductActions({
                                           id,
                                           name,
                                           slug,
                                           price,
                                           stock,
                                           image_url,
                                           material,
                                       }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    const { addItem } = useCart();

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    const increaseQuantity = () => {
        setQuantity((current) => Math.min(stock, current + 1));
    };

    const handleAddToBag = () => {
        if (stock <= 0) return;

        addItem(
            {
                id,
                name,
                slug,
                price,
                stock,
                image_url,
                material,
            },
            quantity
        );

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 1500);
    };

    const totalPrice = price * quantity;

    const formattedTotal = totalPrice.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return (
        <>
            {/* QUANTITY */}
            <div className="mt-10">
                <p className="mb-4 text-[9px] tracking-[0.22em] text-black/40">
                    QUANTITY
                </p>

                <div className="flex h-14 w-36 items-center justify-between border border-black/20 px-5">
                    <button
                        type="button"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="text-lg font-light transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-25"
                    >
                        −
                    </button>

                    <span className="text-sm">{quantity}</span>

                    <button
                        type="button"
                        onClick={increaseQuantity}
                        disabled={quantity >= stock || stock <= 0}
                        className="text-lg font-light transition-opacity hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-25"
                    >
                        +
                    </button>
                </div>

                {stock > 0 && quantity >= stock && (
                    <p className="mt-3 text-[9px] tracking-[0.12em] text-[#A48654]">
                        MAXIMUM AVAILABLE QUANTITY
                    </p>
                )}
            </div>

            {/* ADD TO BAG */}
            <button
                type="button"
                onClick={handleAddToBag}
                disabled={stock <= 0}
                className={`mt-8 flex h-16 w-full items-center justify-between px-7 text-[#F7F4EE] transition duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
                    added
                        ? "bg-[#A48654]"
                        : "bg-[#1B1B1B] hover:bg-[#A48654]"
                }`}
            >
        <span className="text-[11px] tracking-[0.22em]">
          {stock <= 0
              ? "SOLD OUT"
              : added
                  ? "ADDED TO BAG ✓"
                  : "ADD TO BAG"}
        </span>

                {stock > 0 && (
                    <span className="text-sm">
            €{formattedTotal}
          </span>
                )}
            </button>
        </>
    );
}