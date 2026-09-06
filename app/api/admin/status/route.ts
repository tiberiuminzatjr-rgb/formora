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

const allowedStatuses = [
    "new",
    "reviewing",
    "quote_sent",
    "in_progress",
    "ready",
    "completed",
];

const statusLabels: Record<string, string> = {
    new: "New",
    reviewing: "Reviewing",
    quote_sent: "Quote sent",
    in_progress: "In progress",
    ready: "Ready",
    completed: "Completed",
};

export async function PATCH(request: Request) {
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

        const body = await request.json();

        const requestId = body.requestId;
        const status = body.status;

        if (!requestId || !status) {
            return NextResponse.json(
                {
                    error:
                        "Missing project ID or status.",
                },
                { status: 400 }
            );
        }

        if (
            !allowedStatuses.includes(status)
        ) {
            return NextResponse.json(
                {
                    error:
                        "Invalid status.",
                },
                { status: 400 }
            );
        }

        /*
         * Load current project
         * including client information
         * for notification email.
         */
        const {
            data: currentProject,
            error: currentProjectError,
        } = await adminSupabase
            .from("project_requests")
            .select(`
                id,
                status,
                name,
                email,
                service
            `)
            .eq("id", requestId)
            .single();

        if (
            currentProjectError ||
            !currentProject
        ) {
            return NextResponse.json(
                {
                    error:
                        "Project not found.",
                },
                { status: 404 }
            );
        }

        const previousStatus =
            currentProject.status;

        /*
         * Update status
         */
        const {
            data,
            error,
        } = await adminSupabase
            .from("project_requests")
            .update({
                status,
            })
            .eq("id", requestId)
            .select("id, status")
            .single();

        if (error) {
            console.error(
                "Status update error:",
                error
            );

            return NextResponse.json(
                {
                    error:
                        "Could not update status.",
                    details:
                    error.message,
                },
                { status: 500 }
            );
        }

        /*
         * Only act when the status
         * actually changed.
         */
        if (
            previousStatus !== status
        ) {
            /*
             * Activity log
             */
            const {
                error: activityError,
            } = await adminSupabase
                .from("project_activity")
                .insert({
                    request_id:
                    requestId,
                    activity_type:
                        "status_changed",
                    title:
                        "Status changed",
                    description:
                        `${
                            statusLabels[
                                previousStatus
                                ] ||
                            previousStatus
                        } → ${
                            statusLabels[
                                status
                                ] ||
                            status
                        }`,
                    created_by:
                    user.id,
                });

            if (activityError) {
                console.error(
                    "Status activity error:",
                    activityError
                );
            }

            /*
             * READY notification
             */
            if (
                status === "ready" &&
                currentProject.email
            ) {
                const baseUrl =
                    process.env
                        .NEXT_PUBLIC_SITE_URL ||
                    new URL(
                        request.url
                    ).origin;

                const projectUrl =
                    `${baseUrl}/client/projects/${currentProject.id}`;

                const {
                    error: emailError,
                } =
                    await resend.emails.send({
                        from: `FORMORA <${FORMORA_EMAIL_FROM}>`,
                        to: [
                            currentProject.email,
                        ],
                        subject:
                            "Your FORMORA project is ready",
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
                            currentProject.name ||
                            "there"
                        },
                                    </p>

                                    <h1 style="
                                        margin:0;
                                        font-size:32px;
                                        line-height:1.2;
                                        letter-spacing:-1px;
                                    ">
                                        Your project is ready.
                                    </h1>

                                    <p style="
                                        margin:18px 0 0;
                                        color:#9b9ba3;
                                        font-size:15px;
                                        line-height:1.7;
                                    ">
                                        Great news — your
                                        ${
                            currentProject.service ||
                            "FORMORA"
                        }
                                        project has reached the
                                        <strong style="color:#ffffff;">
                                            Ready
                                        </strong>
                                        stage.
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
                                            Project status
                                        </div>

                                        <div style="
                                            margin-top:8px;
                                            color:#4ade80;
                                            font-size:24px;
                                            font-weight:700;
                                        ">
                                            Ready
                                        </div>
                                    </div>

                                    <p style="
                                        margin:24px 0 0;
                                        color:#9b9ba3;
                                        font-size:14px;
                                        line-height:1.7;
                                    ">
                                        Open your client portal to review
                                        the project, messages and available
                                        files.
                                    </p>

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
                        "Ready email error:",
                        emailError
                    );
                }
            }
        }

        return NextResponse.json({
            success: true,
            project: data,
        });
    } catch (error) {
        console.error(
            "Status API error:",
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