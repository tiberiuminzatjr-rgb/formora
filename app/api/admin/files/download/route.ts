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

        // Verificăm sesiunea
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

        // Verificăm dacă utilizatorul este admin
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profileError || !profile || profile.role !== "admin") {
            return NextResponse.json(
                { error: "Forbidden." },
                { status: 403 }
            );
        }

        // Citim request-ul
        const body = await request.json();
        const fileId = body.fileId;

        if (!fileId) {
            return NextResponse.json(
                { error: "Missing file ID." },
                { status: 400 }
            );
        }

        // Luăm fișierul din baza de date
        const { data: file, error: fileError } = await adminSupabase
            .from("project_request_files")
            .select("id, file_name, storage_path")
            .eq("id", fileId)
            .single();

        if (fileError || !file) {
            console.error("File database error:", fileError);

            return NextResponse.json(
                {
                    error: "File not found.",
                    details: fileError?.message,
                },
                { status: 404 }
            );
        }

        console.log("Preparing download:", {
            fileId: file.id,
            fileName: file.file_name,
            storagePath: file.storage_path,
        });

        // Generăm signed URL
        const { data: signedData, error: signedError } =
            await adminSupabase.storage
                .from("project-files")
                .createSignedUrl(
                    file.storage_path,
                    60
                );

        if (signedError || !signedData?.signedUrl) {
            console.error("Signed URL error:", signedError);

            return NextResponse.json(
                {
                    error: "Could not create download link.",
                    details: signedError?.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            url: signedData.signedUrl,
            fileName: file.file_name,
        });
    } catch (error) {
        console.error("DOWNLOAD API ERROR:", error);

        return NextResponse.json(
            {
                error: "Download API failed.",
                details:
                    error instanceof Error
                        ? error.message
                        : "Unknown error",
            },
            { status: 500 }
        );
    }
}