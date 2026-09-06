import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

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

        const content =
            typeof body.content === "string"
                ? body.content.trim()
                : "";

        if (!requestId) {
            return NextResponse.json(
                { error: "Missing project ID." },
                { status: 400 }
            );
        }

        if (!content) {
            return NextResponse.json(
                { error: "Note cannot be empty." },
                { status: 400 }
            );
        }

        if (content.length > 5000) {
            return NextResponse.json(
                { error: "Note is too long." },
                { status: 400 }
            );
        }

        const { data: project, error: projectError } =
            await adminSupabase
                .from("project_requests")
                .select("id")
                .eq("id", requestId)
                .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: "Project not found." },
                { status: 404 }
            );
        }

        const { data: note, error: noteError } =
            await adminSupabase
                .from("project_notes")
                .insert({
                    request_id: requestId,
                    content,
                    created_by: user.id,
                })
                .select(
                    "id, content, created_at"
                )
                .single();

        if (noteError) {
            console.error(
                "Project note insert error:",
                noteError
            );

            return NextResponse.json(
                { error: "Could not save note." },
                { status: 500 }
            );
        }

        const { error: activityError } =
            await adminSupabase
                .from("project_activity")
                .insert({
                    request_id: requestId,
                    activity_type: "note_added",
                    title: "Internal note added",
                    description:
                        content.length > 180
                            ? `${content.slice(
                                0,
                                180
                            )}...`
                            : content,
                    created_by: user.id,
                });

        if (activityError) {
            console.error(
                "Note activity error:",
                activityError
            );
        }

        return NextResponse.json(
            {
                success: true,
                note,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(
            "Admin notes API error:",
            error
        );

        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}