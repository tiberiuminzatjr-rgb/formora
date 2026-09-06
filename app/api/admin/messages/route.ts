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
         * Load project details
         * for authorization + email notification.
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
                service
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
                "Admin message insert error:",
                messageError
            );

            return NextResponse.json(
                { error: "Could not send message." },
                { status: 500 }
            );
        }

        /*
         * Activity
         */
        const {
            error: activityError,
        } = await adminSupabase
            .from("project_activity")
            .insert({
                request_id: project.id,
                activity_type:
                    "admin_message",
                title:
                    "Message sent to client",
                description:
                    message.length > 180
                        ? `${message.slice(
                            0,
                            180
                        )}...`
                        : message,
                created_by:
                user.id,
            });

        if (activityError) {
            console.error(
                "Admin message activity error:",
                activityError
            );
        }

        /*
         * Email notification
         */
        if (project.email) {
            const baseUrl =
                process.env.NEXT_PUBLIC_SITE_URL ||
                new URL(request.url).origin;

            const projectUrl =
                `${baseUrl}/client/projects/${project.id}`;

            const preview =
                message.length > 450
                    ? `${message.slice(
                        0,
                        450
                    )}...`
                    : message;

            const {
                error: emailError,
            } = await resend.emails.send({
                from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                to: [project.email],
                subject:
                    "New message from FORMORA",
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
                                font-size:30px;
                                line-height:1.2;
                                letter-spacing:-1px;
                            ">
                                You have a new message.
                            </h1>

                            <p style="
                                margin:18px 0 0;
                                color:#9b9ba3;
                                font-size:15px;
                                line-height:1.7;
                            ">
                                FORMORA sent you an update regarding your
                                ${
                    project.service ||
                    "project"
                }.
                            </p>

                            <div style="
                                margin-top:28px;
                                padding:22px;
                                border-radius:18px;
                                background:#0B0B0D;
                                border:1px solid #26262b;
                                color:#c9c9cf;
                                font-size:14px;
                                line-height:1.7;
                                white-space:pre-line;
                            ">
                                ${escapeHtml(preview)}
                            </div>

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
                                    View message
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
                    "Message email error:",
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
            "Admin message API error:",
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