import type { ReactNode } from "react";
import CartProvider from "./components/CartProvider";

export default function NorvaLayout({
                                        children,
                                    }: {
    children: ReactNode;
}) {
    return (
        <CartProvider>
            {children}
        </CartProvider>
    );
}