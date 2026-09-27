"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import CartDrawer from "./CartDrawer";

export default function CartButton() {
    const [open, setOpen] = useState(false);
    const { totalItems } = useCart();

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="transition-opacity hover:opacity-50"
            >
                BAG ({totalItems})
            </button>

            <CartDrawer
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}