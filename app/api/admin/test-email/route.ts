import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import {
    resend,
    FORMORA_EMAIL_FROM,
    FORMORA_ADMIN_EMAIL,
} from "@/lib/email";

export async function POST() {
    try {
        const supabase =
            await createServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized." },
                { status: 401 }
            );
        }

        const {
            data: profile,
            error: profileError,
        } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (
            profileError ||
            !profile ||
            profile.role !== "admin"
        ) {
            return NextResponse.json(
                { error: "Forbidden." },
                { status: 403 }
            );
        }

        if (!FORMORA_ADMIN_EMAIL) {
            return NextResponse.json(
                {
                    error:
                        "FORMORA_ADMIN_EMAIL is missing from .env.local.",
                },
                { status: 500 }
            );
        }

        const { data, error } =
            await resend.emails.send({
                from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                to: [FORMORA_ADMIN_EMAIL],
                subject:
                    "FORMORA email system is live 🚀",
                html: `
                    <div style="
                        background:#0B0B0D;
                        color:#ffffff;
                        padding:48px;
                        font-family:Arial,sans-serif;
                    ">
                        <div style="
                            max-width:560px;
                            margin:auto;
                            background:#111114;
                            border:1px solid #26262b;
                            border-radius:24px;
                            padding:36px;
                        ">
                            <div style="
                                font-size:12px;
                                letter-spacing:4px;
                                color:#3882F6;
                                margin-bottom:24px;
                            ">
                                FORMORA
                            </div>

                            <h1 style="
                                font-size:30px;
                                margin:0 0 16px;
                            ">
                                Email system connected.
                            </h1>

                            <p style="
                                color:#9b9ba3;
                                line-height:1.7;
                                margin:0;
                            ">
                                Resend is now connected to FORMORA.
                                Automated project emails can now be enabled.
                            </p>

                            <div style="
                                margin-top:32px;
                                padding-top:24px;
                                border-top:1px solid #26262b;
                                color:#5f5f68;
                                font-size:12px;
                            ">
                                Digital ideas. Made real.
                            </div>
                        </div>
                    </div>
                `,
            });

        if (error) {
            console.error(
                "Resend test error:",
                error
            );

            return NextResponse.json(
                {
                    error:
                        error.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            id: data?.id,
        });
    } catch (error) {
        console.error(
            "Test email error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Could not send test email.",
            },
            { status: 500 }
        );
    }
}
