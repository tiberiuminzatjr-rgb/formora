import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            return NextResponse.json(
                {
                    verified: false,
                    error: "Missing session ID.",
                },
                { status: 400 }
            );
        }

        // Acceptăm numai sesiuni Stripe Checkout.
        if (!sessionId.startsWith("cs_")) {
            return NextResponse.json(
                {
                    verified: false,
                    error: "Invalid session ID.",
                },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.retrieve(
            sessionId
        );

        const verified =
            session.payment_status === "paid" &&
            session.status === "complete" &&
            session.metadata?.store === "NORVA";

        if (!verified) {
            return NextResponse.json(
                {
                    verified: false,
                    paymentStatus: session.payment_status,
                    status: session.status,
                },
                { status: 400 }
            );
        }

        return NextResponse.json({
            verified: true,
            paymentStatus: session.payment_status,
            status: session.status,
            order: {
                id: session.id,
                amountTotal: session.amount_total,
                currency: session.currency,
                customerEmail:
                    session.customer_details?.email ?? null,
            },
        });
    } catch (error) {
        console.error(
            "NØRVA Stripe session verification error:",
            error
        );

        return NextResponse.json(
            {
                verified: false,
                error: "Unable to verify payment.",
            },
            { status: 500 }
        );
    }
}