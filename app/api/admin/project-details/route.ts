import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: Request) {
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

        const { data: profile, error: profileError } =
            await supabase
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
        const projectValue = body.projectValue;
        const currency = body.currency;
        const deadline = body.deadline;

        if (!requestId) {
            return NextResponse.json(
                { error: "Missing project ID." },
                { status: 400 }
            );
        }

        if (
            currency &&
            !["RON", "EUR"].includes(currency)
        ) {
            return NextResponse.json(
                { error: "Invalid currency." },
                { status: 400 }
            );
        }

        let normalizedValue: number | null = null;

        if (
            projectValue !== null &&
            projectValue !== undefined &&
            projectValue !== ""
        ) {
            normalizedValue =
                Number(projectValue);

            if (
                Number.isNaN(
                    normalizedValue
                ) ||
                normalizedValue < 0
            ) {
                return NextResponse.json(
                    {
                        error: "Invalid project value.",
                    },
                    { status: 400 }
                );
            }
        }

        const {
            data: currentProject,
            error: currentProjectError,
        } = await adminSupabase
            .from("project_requests")
            .select(
                "project_value, currency, deadline"
            )
            .eq("id", requestId)
            .single();

        if (
            currentProjectError ||
            !currentProject
        ) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        const { data, error } = await adminSupabase
            .from("project_requests")
            .update({
                project_value:
                normalizedValue,
                currency:
                    normalizedValue !== null
                        ? currency || "RON"
                        : null,
                deadline:
                    deadline || null,
            })
            .eq("id", requestId)
            .select(
                "id, project_value, currency, deadline"
            )
            .single();

        if (error) {
            console.error(
                "Project details update error:",
                error
            );

            return NextResponse.json(
                {
                    error: "Could not update project.",
                    details: error.message,
                },
                { status: 500 }
            );
        }

        const activities = [];

        const oldValue =
            currentProject.project_value !== null
                ? Number(
                    currentProject.project_value
                )
                : null;

        const newValue = normalizedValue;

        const newCurrency =
            newValue !== null
                ? currency || "RON"
                : null;

        if (
            oldValue !== newValue ||
            currentProject.currency !==
            newCurrency
        ) {
            activities.push({
                request_id: requestId,
                activity_type:
                    "value_updated",
                title: "Project value updated",
                description:
                    newValue !== null
                        ? `${newValue.toLocaleString(
                            "ro-RO"
                        )} ${newCurrency}`
                        : "Project value cleared",
                created_by: user.id,
            });
        }

        if (
            currentProject.deadline !==
            (deadline || null)
        ) {
            let deadlineDescription =
                "Deadline cleared";

            if (deadline) {
                deadlineDescription =
                    new Date(
                        `${deadline}T00:00:00`
                    ).toLocaleDateString(
                        "ro-RO",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        }
                    );
            }

            activities.push({
                request_id: requestId,
                activity_type:
                    "deadline_updated",
                title: "Deadline updated",
                description:
                deadlineDescription,
                created_by: user.id,
            });
        }

        if (activities.length > 0) {
            const { error: activityError } =
                await adminSupabase
                    .from("project_activity")
                    .insert(activities);

            if (activityError) {
                console.error(
                    "Project activity error:",
                    activityError
                );
            }
        }

        return NextResponse.json({
            success: true,
            project: data,
        });
    } catch (error) {
        console.error(
            "Project details API error:",
            error
        );

        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}