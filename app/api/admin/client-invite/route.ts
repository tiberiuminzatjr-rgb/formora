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

        if (!requestId) {
            return NextResponse.json(
                { error: "Missing project ID." },
                { status: 400 }
            );
        }

        const {
            data: project,
            error: projectError,
        } = await adminSupabase
            .from("project_requests")
            .select(`
                id,
                name,
                email,
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

        if (!project.email) {
            return NextResponse.json(
                { error: "Project has no client email." },
                { status: 400 }
            );
        }

        /*
         * If the project is already linked,
         * don't create anything again.
         */
        if (project.client_id) {
            return NextResponse.json({
                success: true,
                alreadyLinked: true,
                message: "Client is already linked to this project.",
            });
        }

        /*
         * Search existing Auth users.
         */
        let page = 1;
        let existingUser = null;

        while (!existingUser) {
            const {
                data,
                error,
            } = await adminSupabase.auth.admin.listUsers({
                page,
                perPage: 1000,
            });

            if (error) {
                console.error(
                    "List users error:",
                    error
                );

                return NextResponse.json(
                    { error: "Could not search existing users." },
                    { status: 500 }
                );
            }

            existingUser =
                data.users.find(
                    (authUser) =>
                        authUser.email?.toLowerCase() ===
                        project.email.toLowerCase()
                ) ?? null;

            if (
                existingUser ||
                data.users.length < 1000
            ) {
                break;
            }

            page++;
        }

        let clientUserId: string;
        let invitationSent = false;

        /*
         * Existing account
         */
        if (existingUser) {
            clientUserId = existingUser.id;

            const {
                data: existingProfile,
            } = await adminSupabase
                .from("profiles")
                .select("id, role")
                .eq("id", existingUser.id)
                .maybeSingle();

            if (!existingProfile) {
                const {
                    error: createProfileError,
                } = await adminSupabase
                    .from("profiles")
                    .insert({
                        id: existingUser.id,
                        role: "client",
                        full_name: project.name || null,
                    });

                if (createProfileError) {
                    console.error(
                        "Create profile error:",
                        createProfileError
                    );

                    return NextResponse.json(
                        { error: "Could not create client profile." },
                        { status: 500 }
                    );
                }
            } else if (
                existingProfile.role !== "client"
            ) {
                return NextResponse.json(
                    {
                        error:
                            "This email belongs to a non-client account.",
                    },
                    { status: 409 }
                );
            }
        }

        /*
         * New account
         */
        else {
            const baseUrl =
                process.env.NEXT_PUBLIC_SITE_URL ||
                new URL(request.url).origin;

            const {
                data: inviteData,
                error: inviteError,
            } =
                await adminSupabase.auth.admin.inviteUserByEmail(
                    project.email,
                    {
                        redirectTo:
                            `${baseUrl}/client`,
                        data: {
                            full_name:
                                project.name || "",
                        },
                    }
                );

            if (
                inviteError ||
                !inviteData.user
            ) {
                console.error(
                    "Invite error:",
                    inviteError
                );

                return NextResponse.json(
                    {
                        error:
                            inviteError?.message ||
                            "Could not invite client.",
                    },
                    { status: 500 }
                );
            }

            clientUserId =
                inviteData.user.id;

            invitationSent = true;

            const {
                error: createProfileError,
            } = await adminSupabase
                .from("profiles")
                .upsert(
                    {
                        id: clientUserId,
                        role: "client",
                        full_name:
                            project.name || null,
                    },
                    {
                        onConflict: "id",
                    }
                );

            if (createProfileError) {
                console.error(
                    "Create client profile error:",
                    createProfileError
                );

                return NextResponse.json(
                    {
                        error:
                            "User was invited but client profile could not be created.",
                    },
                    { status: 500 }
                );
            }
        }

        /*
         * Link project to client.
         */
        const {
            error: linkError,
        } = await adminSupabase
            .from("project_requests")
            .update({
                client_id: clientUserId,
            })
            .eq("id", project.id);

        if (linkError) {
            console.error(
                "Link project error:",
                linkError
            );

            return NextResponse.json(
                {
                    error:
                        "Client account exists, but project could not be linked.",
                },
                { status: 500 }
            );
        }

        /*
         * Activity log
         */
        await adminSupabase
            .from("project_activity")
            .insert({
                request_id: project.id,
                activity_type: invitationSent
                    ? "client_invited"
                    : "client_linked",
                title: invitationSent
                    ? "Client invited"
                    : "Client linked",
                description: invitationSent
                    ? `Portal invitation sent to ${project.email}`
                    : `Existing client account linked: ${project.email}`,
                created_by: user.id,
            });

        return NextResponse.json({
            success: true,
            invitationSent,
            message: invitationSent
                ? `Invitation sent to ${project.email}.`
                : `Existing client account linked to this project.`,
        });
    } catch (error) {
        console.error(
            "Client invite API error:",
            error
        );

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
