"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type CartItem = {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    material: string | null;
    quantity: number;
    stock: number;
};

type AddToCartProduct = Omit<CartItem, "quantity">;

type CartContextType = {
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    addItem: (product: AddToCartProduct, quantity: number) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "norva-cart";

export default function CartProvider({
                                         children,
                                     }: {
    children: ReactNode;
}) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    /* LOAD CART */
    useEffect(() => {
        try {
            const savedCart = localStorage.getItem(STORAGE_KEY);

            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    setItems(parsedCart);
                }
            }
        } catch (error) {
            console.error("Could not load NØRVA cart:", error);
        } finally {
            setLoaded(true);
        }
    }, []);

    /* SAVE CART */
    useEffect(() => {
        if (!loaded) return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error("Could not save NØRVA cart:", error);
        }
    }, [items, loaded]);

    /* ADD PRODUCT */
    const addItem = (
        product: AddToCartProduct,
        quantity: number
    ) => {
        if (product.stock <= 0 || quantity <= 0) return;

        setItems((currentItems) => {
            const existingItem = currentItems.find(
                (item) => item.id === product.id
            );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: Math.min(
                                item.quantity + quantity,
                                product.stock
                            ),
                        }
                        : item
                );
            }

            return [
                ...currentItems,
                {
                    ...product,
                    quantity: Math.min(quantity, product.stock),
                },
            ];
        });
    };

    /* REMOVE PRODUCT */
    const removeItem = (id: string) => {
        setItems((currentItems) =>
            currentItems.filter((item) => item.id !== id)
        );
    };

    /* CHANGE QUANTITY */
    const updateQuantity = (
        id: string,
        quantity: number
    ) => {
        setItems((currentItems) =>
            currentItems.map((item) => {
                if (item.id !== id) return item;

                return {
                    ...item,
                    quantity: Math.max(
                        1,
                        Math.min(quantity, item.stock)
                    ),
                };
            })
        );
    };

    /* EMPTY CART */
    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                subtotal,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error(
            "useCart must be used inside CartProvider"
        );
    }

    return context;
}