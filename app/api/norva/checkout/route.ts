import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CartItem = {
    id: string;
    quantity: number;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const items: CartItem[] = body.items;

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Your bag is empty." },
                { status: 400 }
            );
        }

        const supabase = await createClient();

        /*
         * IMPORTANT:
         * Browser prices are NOT trusted.
         * We only receive product IDs + quantities.
         */
        const productIds = [
            ...new Set(items.map((item) => item.id)),
        ];

        const { data: products, error } = await supabase
            .from("norva_products")
            .select(
                "id, name, slug, price, image_url, stock, active"
            )
            .in("id", productIds)
            .eq("active", true);

        if (error) {
            console.error("Supabase checkout error:", error);

            return NextResponse.json(
                { error: "Could not load products." },
                { status: 500 }
            );
        }

        if (!products || products.length !== productIds.length) {
            return NextResponse.json(
                {
                    error:
                        "One or more products are no longer available.",
                },
                { status: 400 }
            );
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            [];

        for (const cartItem of items) {
            const product = products.find(
                (item) => item.id === cartItem.id
            );

            if (!product) {
                return NextResponse.json(
                    { error: "Product not found." },
                    { status: 400 }
                );
            }

            const quantity = Number(cartItem.quantity);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1 ||
                quantity > product.stock
            ) {
                return NextResponse.json(
                    {
                        error: `Invalid quantity for ${product.name}.`,
                    },
                    { status: 400 }
                );
            }

            /*
             * Stripe expects the smallest currency unit.
             * €890.00 => 89000 cents
             */
            const unitAmount = Math.round(
                Number(product.price) * 100
            );

            if (!Number.isSafeInteger(unitAmount) || unitAmount <= 0) {
                return NextResponse.json(
                    { error: `Invalid price for ${product.name}.` },
                    { status: 400 }
                );
            }

            lineItems.push({
                price_data: {
                    currency: "eur",

                    product_data: {
                        name: product.name,

                        ...(product.image_url
                            ? {
                                images: [product.image_url],
                            }
                            : {}),
                    },

                    unit_amount: unitAmount,
                },

                quantity,
            });
        }

        /*
         * Same shipping rule as our NØRVA checkout:
         * free from €1,500
         * otherwise €49
         */
        const subtotal = lineItems.reduce(
            (sum, item) =>
                sum +
                (item.price_data?.unit_amount ?? 0) *
                (item.quantity ?? 1),
            0
        );

        if (subtotal < 150000) {
            lineItems.push({
                price_data: {
                    currency: "eur",

                    product_data: {
                        name: "NØRVA Delivery",
                    },

                    unit_amount: 4900,
                },

                quantity: 1,
            });
        }

        /*
         * localhost while developing.
         * On Vercel this automatically uses the deployed domain.
         */
        const origin =
            request.headers.get("origin") ||
            process.env.NEXT_PUBLIC_SITE_URL ||
            "http://localhost:3000";

        const session = await stripe.checkout.sessions.create({
            mode: "payment",

            line_items: lineItems,

            success_url:
                `${origin}/showcase/norva/checkout/success` +
                "?session_id={CHECKOUT_SESSION_ID}",

            cancel_url:
                `${origin}/showcase/norva/checkout`,

            billing_address_collection: "auto",

            phone_number_collection: {
                enabled: true,
            },

            shipping_address_collection: {
                allowed_countries: [
                    "RO",
                    "NO",
                    "DE",
                    "FR",
                    "IT",
                    "ES",
                    "DK",
                    "SE",
                ],
            },

            metadata: {
                store: "NORVA",
                cart: JSON.stringify(
                    items.map((item) => ({
                        id: item.id,
                        quantity: item.quantity,
                    }))
                ),
            },
        });

        if (!session.url) {
            return NextResponse.json(
                { error: "Stripe did not return a checkout URL." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            url: session.url,
        });
    } catch (error) {
        console.error("NØRVA Stripe checkout error:", error);

        return NextResponse.json(
            { error: "Unable to start checkout." },
            { status: 500 }
        );
    }
}