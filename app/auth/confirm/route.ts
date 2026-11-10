
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const tokenHash =
        request.nextUrl.searchParams.get("token_hash");

    const type =
        request.nextUrl.searchParams.get("type");

    const origin = request.nextUrl.origin;

    if (!tokenHash || type !== "invite") {
        return NextResponse.redirect(
            new URL("/client/login?error=invalid-invite", origin)
        );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "invite",
    });

    if (error) {
        console.error("Invite verification failed:", error.message);

        return NextResponse.redirect(
            new URL("/client/login?error=expired-invite", origin)
        );
    }

    return NextResponse.redirect(
        new URL("/client/set-password", origin)
    );
}
