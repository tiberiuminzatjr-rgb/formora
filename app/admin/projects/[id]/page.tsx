import Link from "next/link";
import {
    notFound,
    redirect,
} from "next/navigation";

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

import StatusSelect from "../../StatusSelect";
import DownloadButton from "../../DownloadButton";
import InternalNotes from "../../InternalNotes";
import ProjectDetailsEditor from "../../ProjectDetailsEditor";
import QuoteEditor from "../../QuoteEditor";
import AdminProjectMessages from "./AdminProjectMessages";
import AdminFileUpload from "./AdminFileUpload";
import ClientInviteButton from "./ClientInviteButton";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type ProjectPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProjectPage({
                                              params,
                                          }: ProjectPageProps) {
    const { id } = await params;

    const supabase =
        await createServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/admin/login");
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
        redirect("/");
    }

    const { data: project, error } =
        await adminSupabase
            .from("project_requests")
            .select(`
                id,
                service,
                name,
                company,
                email,
                phone,
                website_url,
                project_details,
                status,
                project_value,
                currency,
                deadline,
                created_at,
                client_id,

                project_request_files (
                    id,
                    file_name,
                    storage_path,
                    file_type,
                    file_size,
                    created_at
                ),

                project_notes (
                    id,
                    content,
                    created_at,
                    created_by
                ),

                project_activity (
                    id,
                    activity_type,
                    title,
                    description,
                    created_at,
                    created_by
                ),
                project_quotes (
    id,
    amount,
    currency,
    description,
    status,
    sent_at,
    accepted_at,
    declined_at,
    created_at,
    updated_at
)
            `)
            .eq("id", id)
            .single();

    if (error || !project) {
        console.error(
            "Project page error:",
            error
        );

        notFound();
    }

    const files =
        project.project_request_files ?? [];

    const notes = [
        ...(project.project_notes ?? []),
    ].sort(
        (a, b) =>
            new Date(
                b.created_at
            ).getTime() -
            new Date(
                a.created_at
            ).getTime()
    );

    const activities = [
        ...(project.project_activity ?? []),
    ].sort(
        (a, b) =>
            new Date(
                b.created_at
            ).getTime() -
            new Date(
                a.created_at
            ).getTime()
    );

    const {
        data: messages,
        error: messagesError,
    } = await adminSupabase
        .from("project_messages")
        .select(`
        id,
        message,
        sender_id,
        created_at
    `)
        .eq("request_id", project.id)
        .order("created_at", {
            ascending: true,
        });

    if (messagesError) {
        console.error(
            "Admin messages error:",
            messagesError
        );
    }

    const quote =
        project.project_quotes?.[0] ?? null;

    return (
        <main className="min-h-screen bg-[#0B0B0D] px-6 py-12 text-white md:py-16">
            <div className="mx-auto max-w-7xl">

                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
                >
                    <span>←</span>
                    Back to projects
                </Link>

                <div className="mt-10 flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                            FORMORA ADMIN
                        </p>

                        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                            {project.name}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                                {
                                    project.service
                                }
                            </span>

                            {project.company && (
                                <span className="text-sm text-white/35">
                                    {
                                        project.company
                                    }
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-white/25">
                            Project status
                        </p>

                        <StatusSelect
                            requestId={
                                project.id
                            }
                            currentStatus={
                                project.status
                            }
                        />
                    </div>
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

                    <div className="space-y-8">

                        {/* DETAILS */}

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Project details
                            </p>

                            {project.project_details ? (
                                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/60">
                                    {
                                        project.project_details
                                    }
                                </p>
                            ) : (
                                <p className="mt-5 text-sm text-white/30">
                                    No project
                                    description
                                    provided.
                                </p>
                            )}
                        </section>

                        {/* FILES */}

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                        Files
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold">
                                        Project
                                        files
                                    </h2>
                                </div>

                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/30">
                                    {
                                        files.length
                                    }
                                </span>
                            </div>

                            {files.length > 0 ? (
                                <div className="mt-6 space-y-3">
                                    {files.map(
                                        (
                                            file
                                        ) => (
                                            <div
                                                key={
                                                    file.id
                                                }
                                                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium text-white/75">
                                                        {
                                                            file.file_name
                                                        }
                                                    </p>

                                                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/25">
                                                        <span>
                                                            {(
                                                                Number(
                                                                    file.file_size ??
                                                                    0
                                                                ) /
                                                                1024 /
                                                                1024
                                                            ).toFixed(
                                                                2
                                                            )}{" "}
                                                            MB
                                                        </span>

                                                        {file.file_type && (
                                                            <span>
                                                                {
                                                                    file.file_type
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <DownloadButton
                                                    fileId={
                                                        file.id
                                                    }
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                    <p className="text-sm text-white/30">
                                        No files
                                        uploaded.
                                    </p>
                                </div>
                            )}
                            <AdminFileUpload
                                requestId={project.id}
                            />
                            <AdminProjectMessages
                                requestId={project.id}
                                currentUserId={user.id}
                                messages={messages ?? []}
                            />

                        </section>

                        <ClientInviteButton
                            requestId={project.id}
                            email={project.email}
                            isLinked={Boolean(project.client_id)}
                        />

                        {/* INTERNAL NOTES */}

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Internal notes
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Private project
                                notes
                            </h2>

                            <p className="mt-2 text-sm text-white/30">
                                Only FORMORA
                                administrators can
                                see these notes.
                            </p>

                            {notes.length > 0 ? (
                                <div className="mt-6 space-y-3">
                                    {notes.map(
                                        (
                                            note
                                        ) => (
                                            <div
                                                key={
                                                    note.id
                                                }
                                                className="rounded-2xl border border-white/10 bg-black/20 p-5"
                                            >
                                                <p className="whitespace-pre-wrap text-sm leading-6 text-white/60">
                                                    {
                                                        note.content
                                                    }
                                                </p>

                                                <p className="mt-4 text-xs text-white/20">
                                                    {new Date(
                                                        note.created_at
                                                    ).toLocaleString(
                                                        "ro-RO"
                                                    )}
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-6 text-center">
                                    <p className="text-sm text-white/30">
                                        No internal
                                        notes yet.
                                    </p>
                                </div>
                            )}

                            <InternalNotes
                                requestId={
                                    project.id
                                }
                            />
                        </section>

                        {/* ACTIVITY */}

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Project activity
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Timeline
                            </h2>

                            <p className="mt-2 text-sm text-white/30">
                                History of important
                                project changes.
                            </p>

                            {activities.length >
                            0 ? (
                                <div className="mt-8">
                                    {activities.map(
                                        (
                                            activity,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    activity.id
                                                }
                                                className="relative flex gap-5 pb-8 last:pb-0"
                                            >
                                                {index !==
                                                    activities.length -
                                                    1 && (
                                                        <div className="absolute left-[7px] top-5 h-full w-px bg-white/10" />
                                                    )}

                                                <div className="relative z-10 mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border border-blue-400/40 bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]" />

                                                <div className="min-w-0">
                                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                                                        <p className="text-sm font-medium text-white/75">
                                                            {
                                                                activity.title
                                                            }
                                                        </p>

                                                        <p className="text-xs text-white/20">
                                                            {new Date(
                                                                activity.created_at
                                                            ).toLocaleString(
                                                                "ro-RO"
                                                            )}
                                                        </p>
                                                    </div>

                                                    {activity.description && (
                                                        <p className="mt-2 whitespace-pre-wrap text-sm text-white/40">
                                                            {
                                                                activity.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">
                                    <p className="text-sm text-white/30">
                                        No activity
                                        recorded yet.
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* SIDEBAR */}

                    <div className="space-y-6">

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Client
                            </p>

                            <h2 className="mt-4 text-xl font-semibold">
                                {project.name}
                            </h2>

                            {project.company && (
                                <p className="mt-1 text-sm text-white/35">
                                    {
                                        project.company
                                    }
                                </p>
                            )}

                            <div className="mt-6 space-y-5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Email
                                    </p>

                                    <a
                                        href={`mailto:${project.email}`}
                                        className="mt-1 block break-all text-sm text-white/60 transition hover:text-blue-400"
                                    >
                                        {
                                            project.email
                                        }
                                    </a>
                                </div>

                                {project.phone && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                            Phone
                                        </p>

                                        <a
                                            href={`tel:${project.phone}`}
                                            className="mt-1 block text-sm text-white/60 transition hover:text-blue-400"
                                        >
                                            {
                                                project.phone
                                            }
                                        </a>
                                    </div>
                                )}

                                {project.website_url && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                            Website
                                        </p>

                                        <a
                                            href={
                                                project.website_url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-1 block break-all text-sm text-blue-400 transition hover:text-blue-300"
                                        >
                                            {
                                                project.website_url
                                            }
                                        </a>
                                    </div>
                                )}
                            </div>
                        </section>
                        {/* QUOTE */}

                        <section className="rounded-[28px] border border-blue-500/15 bg-blue-500/[0.025] p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.25em] text-blue-400/70">
                                        Quote
                                    </p>

                                    <h2 className="mt-2 text-xl font-semibold">
                                        Client offer
                                    </h2>
                                </div>

                                {quote && (
                                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                {quote.status}
            </span>
                                )}
                            </div>

                            <QuoteEditor
                                requestId={project.id}
                                quote={
                                    quote
                                        ? {
                                            amount: Number(
                                                quote.amount
                                            ),
                                            currency:
                                            quote.currency,
                                            description:
                                            quote.description,
                                            status:
                                            quote.status,
                                        }
                                        : null
                                }
                            />
                        </section>
                        {/* VALUE */}

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Project management
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                Value & deadline
                            </h2>

                            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                    Current value
                                </p>

                                <p className="mt-2 text-2xl font-semibold">
                                    {project.project_value !==
                                    null
                                        ? `${Number(
                                            project.project_value
                                        ).toLocaleString(
                                            "ro-RO"
                                        )} ${
                                            project.currency ||
                                            ""
                                        }`
                                        : "Not set"}
                                </p>

                                <div className="mt-4 border-t border-white/10 pt-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Deadline
                                    </p>

                                    <p className="mt-2 text-sm text-white/60">
                                        {project.deadline
                                            ? new Date(
                                                `${project.deadline}T00:00:00`
                                            ).toLocaleDateString(
                                                "ro-RO"
                                            )
                                            : "Not set"}
                                    </p>
                                </div>
                            </div>

                            <ProjectDetailsEditor
                                requestId={
                                    project.id
                                }
                                currentValue={
                                    project.project_value !==
                                    null
                                        ? Number(
                                            project.project_value
                                        )
                                        : null
                                }
                                currentCurrency={
                                    project.currency
                                }
                                currentDeadline={
                                    project.deadline
                                }
                            />
                        </section>

                        {/* REQUEST */}

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6">
                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Request
                            </p>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Service
                                    </p>

                                    <p className="mt-1 text-sm text-white/60">
                                        {
                                            project.service
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Received
                                    </p>

                                    <p className="mt-1 text-sm text-white/60">
                                        {new Date(
                                            project.created_at
                                        ).toLocaleString(
                                            "ro-RO"
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Project ID
                                    </p>

                                    <p className="mt-1 break-all font-mono text-xs text-white/30">
                                        {
                                            project.id
                                        }
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}