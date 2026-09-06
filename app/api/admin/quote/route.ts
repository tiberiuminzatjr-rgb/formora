import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
    resend,
    FORMORA_EMAIL_FROM,
} from "@/lib/email";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const allowedCurrencies = ["RON", "EUR"];
const allowedActions = ["save", "send"];

export async function POST(request: Request) {
    try {
        const supabase = await createServerClient();

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

        const body = await request.json();

        const requestId = body.requestId;
        const currency = body.currency;

        const description =
            typeof body.description === "string"
                ? body.description.trim()
                : "";

        const action = body.action || "save";

        if (!requestId) {
            return NextResponse.json(
                { error: "Missing project ID." },
                { status: 400 }
            );
        }

        if (!allowedActions.includes(action)) {
            return NextResponse.json(
                { error: "Invalid action." },
                { status: 400 }
            );
        }

        if (!allowedCurrencies.includes(currency)) {
            return NextResponse.json(
                { error: "Invalid currency." },
                { status: 400 }
            );
        }

        const amount = Number(body.amount);

        if (
            !Number.isFinite(amount) ||
            amount < 0
        ) {
            return NextResponse.json(
                { error: "Invalid quote amount." },
                { status: 400 }
            );
        }

        if (description.length > 10000) {
            return NextResponse.json(
                {
                    error:
                        "Quote description is too long.",
                },
                { status: 400 }
            );
        }

        /*
         * Load project details
         * for quote + client email.
         */
        const {
            data: project,
            error: projectError,
        } = await adminSupabase
            .from("project_requests")
            .select(`
                id,
                name,
                email,
                service,
                client_id
            `)
            .eq("id", requestId)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        const {
            data: existingQuote,
        } = await adminSupabase
            .from("project_quotes")
            .select("id, status")
            .eq("request_id", requestId)
            .maybeSingle();

        const newStatus =
            action === "send"
                ? "sent"
                : existingQuote?.status === "sent"
                    ? "sent"
                    : "draft";

        const now =
            new Date().toISOString();

        const quoteData = {
            request_id: requestId,
            amount,
            currency,
            description:
                description || null,
            status: newStatus,
            created_by: user.id,
            updated_at: now,
            sent_at:
                action === "send"
                    ? now
                    : undefined,
        };

        let quote;

        if (existingQuote) {
            const updateData = {
                amount,
                currency,
                description:
                    description || null,
                status: newStatus,
                updated_at: now,
                ...(action === "send"
                    ? {
                        sent_at: now,
                    }
                    : {}),
            };

            const {
                data,
                error,
            } = await adminSupabase
                .from("project_quotes")
                .update(updateData)
                .eq("id", existingQuote.id)
                .select("*")
                .single();

            if (error) {
                console.error(
                    "Quote update error:",
                    error
                );

                return NextResponse.json(
                    {
                        error:
                            "Could not update quote.",
                        details:
                        error.message,
                    },
                    { status: 500 }
                );
            }

            quote = data;
        } else {
            const {
                data,
                error,
            } = await adminSupabase
                .from("project_quotes")
                .insert(quoteData)
                .select("*")
                .single();

            if (error) {
                console.error(
                    "Quote insert error:",
                    error
                );

                return NextResponse.json(
                    {
                        error:
                            "Could not create quote.",
                        details:
                        error.message,
                    },
                    { status: 500 }
                );
            }

            quote = data;
        }

        /*
         * SEND QUOTE
         */
        if (action === "send") {
            const {
                error: projectStatusError,
            } = await adminSupabase
                .from("project_requests")
                .update({
                    status:
                        "quote_sent",
                })
                .eq("id", requestId);

            if (projectStatusError) {
                console.error(
                    "Quote project status error:",
                    projectStatusError
                );
            }

            /*
             * Client email
             */
            if (project.email) {
                const baseUrl =
                    process.env
                        .NEXT_PUBLIC_SITE_URL ||
                    new URL(
                        request.url
                    ).origin;

                const projectUrl =
                    `${baseUrl}/client/projects/${project.id}`;

                const formattedAmount =
                    amount.toLocaleString(
                        "ro-RO",
                        {
                            minimumFractionDigits:
                                0,
                            maximumFractionDigits:
                                2,
                        }
                    );

                const {
                    error: emailError,
                } =
                    await resend.emails.send({
                        from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                        to: [
                            project.email,
                        ],
                        subject:
                            "Your FORMORA quote is ready",
                        html: `
                            <div style="
                                margin:0;
                                padding:40px 20px;
                                background:#0B0B0D;
                                font-family:Arial,sans-serif;
                                color:#ffffff;
                            ">
                                <div style="
                                    max-width:600px;
                                    margin:0 auto;
                                    background:#111114;
                                    border:1px solid #26262b;
                                    border-radius:24px;
                                    padding:40px;
                                ">

                                    <div style="
                                        color:#3882F6;
                                        font-size:12px;
                                        font-weight:700;
                                        letter-spacing:4px;
                                        margin-bottom:28px;
                                    ">
                                        FORMORA
                                    </div>

                                    <p style="
                                        margin:0 0 10px;
                                        color:#8b8b94;
                                        font-size:14px;
                                    ">
                                        Hi ${
                            project.name ||
                            "there"
                        },
                                    </p>

                                    <h1 style="
                                        margin:0;
                                        font-size:32px;
                                        line-height:1.2;
                                        letter-spacing:-1px;
                                    ">
                                        Your quote is ready.
                                    </h1>

                                    <p style="
                                        margin:18px 0 0;
                                        color:#9b9ba3;
                                        font-size:15px;
                                        line-height:1.7;
                                    ">
                                        We've prepared the quote for your
                                        ${
                            project.service ||
                            "FORMORA"
                        }
                                        project.
                                    </p>

                                    <div style="
                                        margin-top:30px;
                                        padding:24px;
                                        border-radius:18px;
                                        background:#0B0B0D;
                                        border:1px solid #26262b;
                                    ">
                                        <div style="
                                            color:#6f6f78;
                                            font-size:11px;
                                            text-transform:uppercase;
                                            letter-spacing:2px;
                                        ">
                                            Quote
                                        </div>

                                        <div style="
                                            margin-top:8px;
                                            font-size:30px;
                                            font-weight:700;
                                            color:#ffffff;
                                        ">
                                            ${formattedAmount} ${currency}
                                        </div>
                                    </div>

                                    ${
                            description
                                ? `
                                        <div style="
                                            margin-top:24px;
                                            padding:20px;
                                            border-radius:16px;
                                            background:#151518;
                                            color:#a7a7af;
                                            font-size:14px;
                                            line-height:1.7;
                                            white-space:pre-line;
                                        ">
                                            ${escapeHtml(
                                    description
                                )}
                                        </div>
                                    `
                                : ""
                        }

                                    <div style="
                                        margin-top:32px;
                                    ">
                                        <a
                                            href="${projectUrl}"
                                            style="
                                                display:inline-block;
                                                background:#3882F6;
                                                color:#ffffff;
                                                text-decoration:none;
                                                padding:14px 22px;
                                                border-radius:12px;
                                                font-size:14px;
                                                font-weight:700;
                                            "
                                        >
                                            View quote
                                        </a>
                                    </div>

                                    <div style="
                                        margin-top:36px;
                                        padding-top:24px;
                                        border-top:1px solid #26262b;
                                        color:#5f5f68;
                                        font-size:12px;
                                        line-height:1.6;
                                    ">
                                        FORMORA<br />
                                        Digital ideas. Made real.
                                    </div>

                                </div>
                            </div>
                        `,
                    });

                if (emailError) {
                    console.error(
                        "Quote email error:",
                        emailError
                    );
                }
            }
        }

        /*
         * Activity
         */
        const {
            error: activityError,
        } = await adminSupabase
            .from("project_activity")
            .insert({
                request_id:
                requestId,

                activity_type:
                    action === "send"
                        ? "quote_sent"
                        : "quote_saved",

                title:
                    action === "send"
                        ? "Quote sent"
                        : "Quote saved",

                description:
                    `${amount.toLocaleString(
                        "ro-RO"
                    )} ${currency}`,

                created_by:
                user.id,
            });

        if (activityError) {
            console.error(
                "Quote activity error:",
                activityError
            );
        }

        return NextResponse.json({
            success: true,
            quote,
        });
    } catch (error) {
        console.error(
            "Quote API error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Invalid request.",
            },
            { status: 400 }
        );
    }
}

function escapeHtml(
    value: string
) {
    return value
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}