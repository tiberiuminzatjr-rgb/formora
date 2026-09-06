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

        const message =
            typeof body.message === "string"
                ? body.message.trim()
                : "";

        if (!requestId) {
            return NextResponse.json(
                { error: "Missing project ID." },
                { status: 400 }
            );
        }

        if (!message) {
            return NextResponse.json(
                { error: "Message cannot be empty." },
                { status: 400 }
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { error: "Message is too long." },
                { status: 400 }
            );
        }

        /*
         * SECURITY:
         * Client session + RLS verifies ownership.
         */
        const {
            data: project,
            error: projectError,
        } = await supabase
            .from("project_requests")
            .select(`
                id,
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
         * Save message
         */
        const {
            data: newMessage,
            error: messageError,
        } = await adminSupabase
            .from("project_messages")
            .insert({
                request_id: project.id,
                sender_id: user.id,
                message,
            })
            .select("*")
            .single();

        if (messageError) {
            console.error(
                "Client message insert error:",
                messageError
            );

            return NextResponse.json(
                { error: "Could not send message." },
                { status: 500 }
            );
        }

        /*
         * Add to admin timeline
         */
        const {
            error: activityError,
        } = await adminSupabase
            .from("project_activity")
            .insert({
                request_id: project.id,
                activity_type: "client_message",
                title: "New client message",
                description:
                    message.length > 180
                        ? `${message.slice(0, 180)}...`
                        : message,
                created_by: user.id,
            });

        if (activityError) {
            console.error(
                "Message activity error:",
                activityError
            );
        }

        /*
         * Notify FORMORA admin
         */
        if (FORMORA_ADMIN_EMAIL) {
            const baseUrl =
                process.env.NEXT_PUBLIC_SITE_URL ||
                new URL(request.url).origin;

            const adminProjectUrl =
                `${baseUrl}/admin/projects/${project.id}`;

            const preview =
                message.length > 700
                    ? `${message.slice(0, 700)}...`
                    : message;

            const clientName =
                profile.full_name ||
                project.name ||
                project.email ||
                "Client";

            const {
                error: emailError,
            } = await resend.emails.send({
                from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                to: [FORMORA_ADMIN_EMAIL],
                subject: "New client message — FORMORA",
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
                                New client message.
                            </h1>

                            <p style="
                                margin:18px 0 0;
                                color:#9b9ba3;
                                font-size:15px;
                                line-height:1.7;
                            ">
                                <strong style="color:#ffffff;">
                                    ${escapeHtml(clientName)}
                                </strong>
                                sent a message regarding the
                                ${escapeHtml(
                    project.service || "FORMORA"
                )}
                                project.
                            </p>

                            ${
                    project.company
                        ? `
                                <p style="
                                    margin:8px 0 0;
                                    color:#686871;
                                    font-size:13px;
                                ">
                                    ${escapeHtml(project.company)}
                                </p>
                            `
                        : ""
                }

                            <div style="
                                margin-top:28px;
                                padding:22px;
                                border-radius:18px;
                                background:#0B0B0D;
                                border:1px solid #26262b;
                                color:#d4d4d8;
                                font-size:14px;
                                line-height:1.75;
                                white-space:pre-line;
                            ">
                                ${escapeHtml(preview)}
                            </div>

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
                                    Open conversation
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
                    "Client message admin email error:",
                    emailError
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: newMessage,
        });
    } catch (error) {
        console.error(
            "Client message API error:",
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