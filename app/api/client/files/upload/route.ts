import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const allowedExtensions = [
    "stl",
    "step",
    "stp",
    "obj",
    "jpg",
    "jpeg",
    "png",
    "webp",
    "heic",
    "pdf",
    "zip",
];

const MAX_FILE_SIZE =
    50 * 1024 * 1024;

function sanitizeFileName(
    fileName: string
) {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_");
}

export async function POST(
    request: Request
) {
    try {
        const supabase =
            await createServerClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                {
                    error:
                        "Unauthorized.",
                },
                {
                    status: 401,
                }
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
            profile.role !== "client"
        ) {
            return NextResponse.json(
                {
                    error:
                        "Forbidden.",
                },
                {
                    status: 403,
                }
            );
        }

        const formData =
            await request.formData();

        const requestId =
            formData.get(
                "requestId"
            );

        const files =
            formData.getAll(
                "files"
            );

        if (
            typeof requestId !==
            "string" ||
            !requestId
        ) {
            return NextResponse.json(
                {
                    error:
                        "Missing project ID.",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Ownership check through
         * authenticated client + RLS
         */
        const {
            data: project,
            error: projectError,
        } = await supabase
            .from(
                "project_requests"
            )
            .select("id")
            .eq("id", requestId)
            .single();

        if (
            projectError ||
            !project
        ) {
            return NextResponse.json(
                {
                    error:
                        "Project not found.",
                },
                {
                    status: 404,
                }
            );
        }

        if (!files.length) {
            return NextResponse.json(
                {
                    error:
                        "No files selected.",
                },
                {
                    status: 400,
                }
            );
        }

        const uploadedFiles = [];

        for (const item of files) {
            if (
                !(item instanceof File)
            ) {
                continue;
            }

            if (
                item.size >
                MAX_FILE_SIZE
            ) {
                return NextResponse.json(
                    {
                        error: `${item.name} is larger than 50 MB.`,
                    },
                    {
                        status: 400,
                    }
                );
            }

            const extension =
                item.name
                    .split(".")
                    .pop()
                    ?.toLowerCase() ??
                "";

            if (
                !allowedExtensions.includes(
                    extension
                )
            ) {
                return NextResponse.json(
                    {
                        error: `${item.name} has an unsupported file type.`,
                    },
                    {
                        status: 400,
                    }
                );
            }

            const safeFileName =
                sanitizeFileName(
                    item.name
                );

            const storagePath =
                `${project.id}/` +
                `${crypto.randomUUID()}-` +
                `${safeFileName}`;

            const {
                error: uploadError,
            } =
                await adminSupabase.storage
                    .from(
                        "project-files"
                    )
                    .upload(
                        storagePath,
                        item,
                        {
                            contentType:
                                item.type ||
                                undefined,
                            upsert: false,
                        }
                    );

            if (uploadError) {
                console.error(
                    "Client file upload error:",
                    uploadError
                );

                return NextResponse.json(
                    {
                        error: `Could not upload ${item.name}.`,
                    },
                    {
                        status: 500,
                    }
                );
            }

            const {
                data: metadata,
                error: metadataError,
            } =
                await adminSupabase
                    .from(
                        "project_request_files"
                    )
                    .insert({
                        request_id:
                        project.id,
                        file_name:
                        item.name,
                        storage_path:
                        storagePath,
                        file_type:
                            item.type ||
                            null,
                        file_size:
                        item.size,
                    })
                    .select("*")
                    .single();

            if (metadataError) {
                console.error(
                    "Client file metadata error:",
                    metadataError
                );

                await adminSupabase.storage
                    .from(
                        "project-files"
                    )
                    .remove([
                        storagePath,
                    ]);

                return NextResponse.json(
                    {
                        error: `Could not save ${item.name}.`,
                    },
                    {
                        status: 500,
                    }
                );
            }

            uploadedFiles.push(
                metadata
            );
        }

        await adminSupabase
            .from(
                "project_activity"
            )
            .insert({
                request_id:
                project.id,
                activity_type:
                    "client_files_uploaded",
                title:
                    "Client uploaded files",
                description:
                    `${uploadedFiles.length} file(s) uploaded`,
                created_by:
                user.id,
            });

        return NextResponse.json({
            success: true,
            files: uploadedFiles,
        });
    } catch (error) {
        console.error(
            "Client upload API error:",
            error
        );

        return NextResponse.json(
            {
                error:
                    "Upload failed.",
            },
            {
                status: 500,
            }
        );
    }
}