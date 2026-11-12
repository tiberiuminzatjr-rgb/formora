import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminGuard } from "@/lib/auth/admin";

const allowedStatuses = [
    "new",
    "processing",
    "shipped",
    "completed",
] as const;

type OrderStatus = (typeof allowedStatuses)[number];

export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // 1. Verify logged-in user
        const supabaseAuth = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabaseAuth.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        // Only Formora admins may manage NØRVA data (service-role bypasses RLS).
        const forbidden = await adminGuard();
        if (forbidden) return forbidden;

        // 2. Get order ID
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Missing order ID." },
                { status: 400 }
            );
        }

        // 3. Read requested status
        const body = await request.json();

        const status = body.status as OrderStatus;

        if (!allowedStatuses.includes(status)) {
            return NextResponse.json(
                { error: "Invalid order status." },
                { status: 400 }
            );
        }

        // 4. Update order server-side
        const supabase = createAdminClient();

        const { data: order, error } = await supabase
            .from("norva_orders")
            .update({
                order_status: status,
            })
            .eq("id", id)
            .select("id, order_status")
            .single();

        if (error || !order) {
            console.error(
                "NØRVA order status update error:",
                error
            );

            return NextResponse.json(
                { error: "Could not update order." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            order,
        });
    } catch (error) {
        console.error(
            "NØRVA order status API error:",
            error
        );

        return NextResponse.json(
            { error: "Unable to update order." },
            { status: 500 }
        );
    }
}