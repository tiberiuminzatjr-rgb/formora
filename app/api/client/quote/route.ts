import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import {
    resend,
    FORMORA_EMAIL_FROM,
    FORMORA_ADMIN_EMAIL,
} from "@/lib/email";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        if (
            profileError ||
            !profile ||
            profile.role !== "client"
        ) {
            return NextResponse.json(
                { error: "Forbidden." },
                { status: 403 }
            );
        }

        const body = await request.json();

        const requestId = body.requestId;
        const action = body.action;

        if (!requestId) {
            return NextResponse.json(
                { error: "Missing project ID." },
                { status: 400 }
            );
        }

        if (
            action !== "accept" &&
            action !== "decline"
        ) {
            return NextResponse.json(
                { error: "Invalid action." },
                { status: 400 }
            );
        }

        /*
         * Verify ownership using client's
         * authenticated Supabase session + RLS.
         */
        const {
            data: project,
            error: projectError,
        } = await supabase
            .from("project_requests")
            .select(`
                id,
                status,
                service,
                name,
                company,
                email
            `)
            .eq("id", requestId)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        /*
         * Ownership is now verified.
         * Read quote server-side.
         */
        const {
            data: quote,
            error: quoteError,
        } = await adminSupabase
            .from("project_quotes")
            .select(`
                id,
                status,
                amount,
                currency
            `)
            .eq("request_id", project.id)
            .maybeSingle();

        if (quoteError || !quote) {
            return NextResponse.json(
                { error: "Quote not found." },
                { status: 404 }
            );
        }

        if (quote.status !== "sent") {
            return NextResponse.json(
                {
                    error:
                        "This quote can no longer be changed.",
                },
                { status: 400 }
            );
        }

        const now = new Date().toISOString();

        const newQuoteStatus =
            action === "accept"
                ? "accepted"
                : "declined";

        const quoteUpdate =
            action === "accept"
                ? {
                    status: "accepted",
                    accepted_at: now,
                    declined_at: null,
                    updated_at: now,
                }
                : {
                    status: "declined",
                    declined_at: now,
                    accepted_at: null,
                    updated_at: now,
                };

        const {
            data: updatedQuote,
            error: updateError,
        } = await adminSupabase
            .from("project_quotes")
            .update(quoteUpdate)
            .eq("id", quote.id)
            .eq("status", "sent")
            .select("*")
            .single();

        if (updateError || !updatedQuote) {
            console.error(
                "Client quote update error:",
                updateError
            );

            return NextResponse.json(
                {
                    error:
                        "Could not update quote.",
                },
                { status: 500 }
            );
        }

        /*
         * Accept automatically moves project
         * to In progress.
         */
        if (action === "accept") {
            const {
                error: projectStatusError,
            } = await adminSupabase
                .from("project_requests")
                .update({
                    status: "in_progress",
                })
                .eq("id", project.id);

            if (projectStatusError) {
                console.error(
                    "Project status update error:",
                    projectStatusError
                );
            }
        }

        /*
         * Activity timeline
         */
        const {
            error: activityError,
        } = await adminSupabase
            .from("project_activity")
            .insert({
                request_id: project.id,
                activity_type:
                    action === "accept"
                        ? "quote_accepted"
                        : "quote_declined",
                title:
                    action === "accept"
                        ? "Quote accepted"
                        : "Quote declined",
                description: `${Number(
                    quote.amount
                ).toLocaleString("ro-RO")} ${
                    quote.currency
                }`,
                created_by: user.id,
            });

        if (activityError) {
            console.error(
                "Client quote activity error:",
                activityError
            );
        }

        /*
         * Separate status activity on accept
         */
        if (
            action === "accept" &&
            project.status !== "in_progress"
        ) {
            const {
                error: statusActivityError,
            } = await adminSupabase
                .from("project_activity")
                .insert({
                    request_id: project.id,
                    activity_type: "status_changed",
                    title: "Status changed",
                    description:
                        "Quote sent → In progress",
                    created_by: user.id,
                });

            if (statusActivityError) {
                console.error(
                    "Status activity error:",
                    statusActivityError
                );
            }
        }

        /*
         * Notify FORMORA admin by email
         */
        if (FORMORA_ADMIN_EMAIL) {
            const baseUrl =
                process.env.NEXT_PUBLIC_SITE_URL ||
                new URL(request.url).origin;

            const adminProjectUrl =
                `${baseUrl}/admin/projects/${project.id}`;

            const formattedAmount =
                Number(
                    quote.amount
                ).toLocaleString(
                    "ro-RO",
                    {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    }
                );

            const accepted =
                action === "accept";

            const {
                error: emailError,
            } = await resend.emails.send({
                from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                to: [FORMORA_ADMIN_EMAIL],
                subject: accepted
                    ? "Quote accepted — FORMORA"
                    : "Quote declined — FORMORA",
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
                                Client activity
                            </p>

                            <h1 style="
                                margin:0;
                                font-size:30px;
                                line-height:1.2;
                                letter-spacing:-1px;
                            ">
                                Quote ${
                    accepted
                        ? "accepted."
                        : "declined."
                }
                            </h1>

                            <p style="
                                margin:18px 0 0;
                                color:#9b9ba3;
                                font-size:15px;
                                line-height:1.7;
                            ">
                                ${
                    escapeHtml(
                        profile.full_name ||
                        project.name ||
                        project.email ||
                        "The client"
                    )
                }
                                has ${
                    accepted
                        ? "accepted"
                        : "declined"
                }
                                the quote for the
                                ${
                    escapeHtml(
                        project.service ||
                        "FORMORA"
                    )
                }
                                project.
                            </p>

                            <div style="
                                margin-top:28px;
                                padding:22px;
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
                                    font-size:28px;
                                    font-weight:700;
                                    color:#ffffff;
                                ">
                                    ${formattedAmount} ${
                    quote.currency
                }
                                </div>

                                <div style="
                                    margin-top:14px;
                                    display:inline-block;
                                    padding:7px 10px;
                                    border-radius:999px;
                                    background:${
                    accepted
                        ? "#12351f"
                        : "#3b1717"
                };
                                    color:${
                    accepted
                        ? "#4ade80"
                        : "#f87171"
                };
                                    font-size:12px;
                                    font-weight:700;
                                ">
                                    ${
                    accepted
                        ? "ACCEPTED"
                        : "DECLINED"
                }
                                </div>
                            </div>

                            ${
                    accepted
                        ? `
                                <p style="
                                    margin:24px 0 0;
                                    color:#9b9ba3;
                                    font-size:14px;
                                    line-height:1.7;
                                ">
                                    The project has automatically moved to
                                    <strong style="color:#ffffff;">
                                        In progress
                                    </strong>.
                                </p>
                            `
                        : ""
                }

                            <div style="
                                margin-top:32px;
                            ">
                                <a
                                    href="${adminProjectUrl}"
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
                                    Open project
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
                    "Admin quote notification email error:",
                    emailError
                );
            }
        }

        return NextResponse.json({
            success: true,
            status: newQuoteStatus,
        });
    } catch (error) {
        console.error(
            "Client quote API error:",
            error
        );

        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}