import "server-only";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type CartMetadataItem = {
    id: string;
    quantity: number;
};

export async function POST(request: Request) {
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing Stripe signature." },
            { status: 400 }
        );
    }

    const webhookSecret =
        process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET is missing.");

        return NextResponse.json(
            { error: "Webhook is not configured." },
            { status: 500 }
        );
    }

    let event: Stripe.Event;

    try {
        const body = await request.text();

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            webhookSecret
        );
    } catch (error) {
        console.error(
            "NØRVA webhook signature verification failed:",
            error
        );

        return NextResponse.json(
            { error: "Invalid webhook signature." },
            { status: 400 }
        );
    }

    /*
     * We only need successful Checkout payments.
     */
    if (event.type !== "checkout.session.completed") {
        return NextResponse.json({ received: true });
    }

    const session = event.data.object;

    if (
        session.payment_status !== "paid" ||
        session.metadata?.store !== "NORVA"
    ) {
        return NextResponse.json({ received: true });
    }

    try {
        const supabase = createAdminClient();

        /*
         * IDEMPOTENCY:
         * If this Stripe session was already saved,
         * do not create another order.
         */
        const { data: existingOrder, error: existingOrderError } =
            await supabase
                .from("norva_orders")
                .select("id")
                .eq("stripe_session_id", session.id)
                .maybeSingle();

        if (existingOrderError) {
            throw existingOrderError;
        }

        if (existingOrder) {
            return NextResponse.json({
                received: true,
                duplicate: true,
            });
        }

        /*
         * Read cart metadata stored when the
         * Stripe Checkout Session was created.
         */
        const rawCart = session.metadata?.cart;

        if (!rawCart) {
            throw new Error(
                "Stripe session does not contain cart metadata."
            );
        }

        const cart = JSON.parse(rawCart) as CartMetadataItem[];

        if (!Array.isArray(cart) || cart.length === 0) {
            throw new Error("Invalid cart metadata.");
        }

        const productIds = [
            ...new Set(cart.map((item) => item.id)),
        ];

        /*
         * IMPORTANT:
         * We load product names/prices from Supabase.
         */
        const { data: products, error: productsError } =
            await supabase
                .from("norva_products")
                .select("id, name, slug, price")
                .in("id", productIds);

        if (productsError) {
            throw productsError;
        }

        if (
            !products ||
            products.length !== productIds.length
        ) {
            throw new Error(
                "One or more ordered products could not be found."
            );
        }

        let productSubtotal = 0;

        const preparedItems = cart.map((cartItem) => {
            const product = products.find(
                (item) => item.id === cartItem.id
            );

            if (!product) {
                throw new Error(
                    `Product ${cartItem.id} could not be found.`
                );
            }

            const quantity = Number(cartItem.quantity);
            const unitPrice = Number(product.price);

            if (
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {
                throw new Error(
                    `Invalid quantity for ${product.name}.`
                );
            }

            const lineTotal = unitPrice * quantity;

            productSubtotal += lineTotal;

            return {
                product_id: product.id,
                product_name: product.name,
                product_slug: product.slug,
                unit_price: unitPrice,
                quantity,
                line_total: lineTotal,
            };
        });

        /*
         * Stripe amount_total is in cents.
         */
        const total = (session.amount_total ?? 0) / 100;

        const shipping = Math.max(
            0,
            total - productSubtotal
        );

        const paymentIntentId =
            typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null;

        /*
         * CREATE ORDER
         */
        const { data: order, error: orderError } =
            await supabase
                .from("norva_orders")
                .insert({
                    stripe_session_id: session.id,
                    stripe_payment_intent_id:
                    paymentIntentId,

                    customer_email:
                        session.customer_details?.email ?? null,

                    customer_name:
                        session.customer_details?.name ?? null,

                    customer_phone:
                        session.customer_details?.phone ?? null,

                    currency:
                        session.currency ?? "eur",

                    subtotal: productSubtotal,
                    shipping,
                    total,

                    payment_status: "paid",
                    order_status: "new",
                })
                .select("id")
                .single();

        if (orderError || !order) {
            throw orderError ?? new Error(
                "Could not create NØRVA order."
            );
        }

        /*
         * CREATE ORDER ITEMS
         */
        const orderItems = preparedItems.map((item) => ({
            order_id: order.id,
            ...item,
        }));

        const { error: itemsError } =
            await supabase
                .from("norva_order_items")
                .insert(orderItems);

        if (itemsError) {
            /*
             * Avoid leaving an incomplete order.
             */
            await supabase
                .from("norva_orders")
                .delete()
                .eq("id", order.id);

            throw itemsError;
        }

        return NextResponse.json({
            received: true,
            orderId: order.id,
        });
    } catch (error) {
        console.error(
            "NØRVA webhook processing error:",
            error
        );

        /*
         * Returning 500 tells Stripe the webhook
         * should be retried.
         */
        return NextResponse.json(
            { error: "Webhook processing failed." },
            { status: 500 }
        );
    }
}