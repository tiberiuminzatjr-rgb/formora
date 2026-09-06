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

        // 1. Logged-in user
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

        // 2. Must be client
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
            profile.role !== "client"
        ) {
            return NextResponse.json(
                { error: "Forbidden." },
                { status: 403 }
            );
        }

        const body = await request.json();

        const fileId = body.fileId;

        if (!fileId) {
            return NextResponse.json(
                { error: "Missing file ID." },
                { status: 400 }
            );
        }

        /*
         * 3. Read file metadata.
         *
         * Service role is used only server-side.
         */
        const {
            data: file,
            error: fileError,
        } = await adminSupabase
            .from("project_request_files")
            .select(`
                id,
                request_id,
                file_name,
                storage_path
            `)
            .eq("id", fileId)
            .single();

        if (fileError || !file) {
            return NextResponse.json(
                { error: "File not found." },
                { status: 404 }
            );
        }

        /*
         * 4. SECURITY CHECK
         *
         * Verify that the project belongs to
         * the currently logged-in client.
         *
         * This query uses the CLIENT session
         * and therefore RLS.
         */
        const {
            data: project,
            error: projectError,
        } = await supabase
            .from("project_requests")
            .select("id")
            .eq("id", file.request_id)
            .single();

        if (projectError || !project) {
            return NextResponse.json(
                { error: "File not found." },
                { status: 404 }
            );
        }

        /*
         * 5. Generate temporary signed URL.
         */
        const {
            data: signedData,
            error: signedError,
        } = await adminSupabase.storage
            .from("project-files")
            .createSignedUrl(
                file.storage_path,
                60,
                {
                    download: file.file_name,
                }
            );

        if (
            signedError ||
            !signedData?.signedUrl
        ) {
            console.error(
                "Client signed URL error:",
                signedError
            );

            return NextResponse.json(
                {
                    error:
                        "Could not create download link.",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: signedData.signedUrl,
        });
    } catch (error) {
        console.error(
            "Client download API error:",
            error
        );

        return NextResponse.json(
            { error: "Invalid request." },
            { status: 400 }
        );
    }
}