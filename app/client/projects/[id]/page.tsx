import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import QuoteActions from "./QuoteActions";
import ClientDownloadButton from "./ClientDownloadButton";
import ProjectMessages from "./ProjectMessages";
import ClientFileUpload from "./ClientFileUpload";

type ClientProjectPageProps = {
    params: Promise<{
        id: string;
    }>;
};

const statusLabels: Record<string, string> = {
    new: "New",
    reviewing: "Reviewing",
    quote_sent: "Quote sent",
    in_progress: "In progress",
    ready: "Ready",
    completed: "Completed",
};

const statusSteps = [
    "new",
    "reviewing",
    "quote_sent",
    "in_progress",
    "ready",
    "completed",
];

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ClientProjectPage({
                                                    params,
                                                }: ClientProjectPageProps) {
    const { id } = await params;

    const supabase = await createServerClient();

    /*
     * 1. Check logged-in user
     */
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/client/login");
    }

    /*
     * 2. Check client role
     */
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
        redirect("/");
    }

    /*
     * 3. Load project using CLIENT session.
     *
     * RLS protects this query.
     * If this project does not belong to the
     * logged-in client, Supabase won't return it.
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
            project_details,
            status,
            deadline,
            created_at,

            project_request_files (
                id,
                file_name,
                file_type,
                file_size,
                created_at
            )
        `)
        .eq("id", id)
        .single();

    if (projectError || !project) {
        notFound();
    }

    /*
     * 4. Project ownership is now confirmed.
     *
     * Load quote server-side after ownership
     * verification.
     */
    const {
        data: quote,
        error: quoteError,
    } = await adminSupabase
        .from("project_quotes")
        .select(`
            id,
            request_id,
            amount,
            currency,
            description,
            status,
            sent_at,
            accepted_at,
            declined_at
        `)
        .eq("request_id", project.id)
        .maybeSingle();

    if (quoteError) {
        console.error(
            "Client quote error:",
            quoteError
        );
    }

    const files =
        project.project_request_files ?? [];

    const currentStepIndex = Math.max(
        statusSteps.indexOf(project.status),
        0
    );

    /*
     * Draft quotes are NEVER shown to client.
     */
    const visibleQuote =
        quote &&
        quote.status !== "draft"
            ? quote
            : null;

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
            "Client messages error:",
            messagesError
        );
    }
    return (
        <main className="min-h-screen bg-[#0B0B0D] text-white">

            {/* NAVBAR */}
            <header className="border-b border-white/10">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <Link
                        href="/client"
                        className="text-sm font-semibold tracking-[0.25em]"
                    >
                        FORMORA
                    </Link>

                    <span className="text-xs text-white/30">
                        Client Portal
                    </span>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">

                {/* BACK */}
                <Link
                    href="/client"
                    className="inline-flex items-center gap-2 text-sm text-white/35 transition hover:text-white"
                >
                    <span>←</span>
                    Back to projects
                </Link>

                {/* HEADER */}
                <div className="mt-10 flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">

                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                            {project.service}
                        </p>

                        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                            Your project
                        </h1>

                        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/35">
                            Track progress, review your quote
                            and access project files.
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 lg:items-end">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                            Current status
                        </p>

                        <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-medium text-blue-300">
                            {statusLabels[project.status] ||
                                project.status}
                        </span>
                    </div>

                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

                    {/* LEFT SIDE */}
                    <div className="space-y-8">

                        {/* PROGRESS */}
                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">

                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Project progress
                            </p>

                            <h2 className="mt-2 text-xl font-semibold">
                                From request to completion
                            </h2>

                            <div className="mt-8 space-y-5">

                                {statusSteps.map(
                                    (step, index) => {

                                        const isComplete =
                                            index <
                                            currentStepIndex;

                                        const isCurrent =
                                            index ===
                                            currentStepIndex;

                                        return (
                                            <div
                                                key={step}
                                                className="relative flex items-center gap-4"
                                            >
                                                {index !==
                                                    statusSteps.length -
                                                    1 && (
                                                        <div className="absolute left-[9px] top-6 h-8 w-px bg-white/10" />
                                                    )}

                                                <div
                                                    className={`relative z-10 h-5 w-5 shrink-0 rounded-full border ${
                                                        isComplete ||
                                                        isCurrent
                                                            ? "border-blue-400/60 bg-blue-500/20"
                                                            : "border-white/10 bg-[#0B0B0D]"
                                                    }`}
                                                />

                                                <div>
                                                    <p
                                                        className={`text-sm ${
                                                            isCurrent
                                                                ? "font-medium text-white"
                                                                : isComplete
                                                                    ? "text-white/60"
                                                                    : "text-white/25"
                                                        }`}
                                                    >
                                                        {
                                                            statusLabels[
                                                                step
                                                                ]
                                                        }
                                                    </p>

                                                    {isCurrent && (
                                                        <p className="mt-1 text-xs text-blue-400">
                                                            Current stage
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}

                            </div>
                        </section>

                        {/* PROJECT DETAILS */}
                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8">

                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Project details
                            </p>

                            {project.project_details ? (
                                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-white/55">
                                    {project.project_details}
                                </p>
                            ) : (
                                <p className="mt-5 text-sm text-white/30">
                                    No project description available.
                                </p>
                            )}

                        </section>

                        {/* QUOTE */}
                        <section className="rounded-[28px] border border-blue-500/20 bg-blue-500/[0.025] p-6 md:p-8">

                            <p className="text-xs uppercase tracking-[0.25em] text-blue-400">
                                Quote
                            </p>

                            {visibleQuote ? (
                                <>

                                    <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

                                        <div>
                                            <p className="text-sm text-white/30">
                                                Project quote
                                            </p>

                                            <p className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                                                {Number(
                                                    visibleQuote.amount
                                                ).toLocaleString(
                                                    "ro-RO"
                                                )}{" "}
                                                {
                                                    visibleQuote.currency
                                                }
                                            </p>
                                        </div>

                                        <span className="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-300">

                                            {visibleQuote.status ===
                                            "sent"
                                                ? "Awaiting your decision"
                                                : visibleQuote.status ===
                                                "accepted"
                                                    ? "Accepted"
                                                    : "Declined"}

                                        </span>
                                    </div>

                                    {visibleQuote.description && (
                                        <div className="mt-7 border-t border-white/10 pt-6">

                                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                                What's included
                                            </p>

                                            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/50">
                                                {
                                                    visibleQuote.description
                                                }
                                            </p>

                                        </div>
                                    )}

                                    {visibleQuote.status === "sent" && (
                                        <QuoteActions
                                            requestId={project.id}
                                        />
                                    )}
                                </>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-white/10 p-8 text-center">

                                    <p className="text-sm text-white/30">
                                        No quote available yet.
                                    </p>

                                </div>
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
                                        Project files
                                    </h2>
                                </div>

                                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/30">
                                    {files.length}
                                </span>

                            </div>

                            {files.length > 0 ? (
                                <div className="mt-6 space-y-3">

                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div className="min-w-0">

                                                <p className="truncate text-sm font-medium text-white/65">
                                                    {file.file_name}
                                                </p>

                                                <p className="mt-2 text-xs text-white/25">
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
                                                </p>

                                            </div>

                                            <ClientDownloadButton
                                                fileId={file.id}
                                            />

                                        </div>
                                    ))}

                                </div>
                            ) : (
                                <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">

                                    <p className="text-sm text-white/30">
                                        No project files yet.
                                    </p>

                                </div>
                            )}
                            <ClientFileUpload
                                requestId={project.id}
                            />

                        </section>
                        <ProjectMessages
                            requestId={project.id}
                            currentUserId={user.id}
                            messages={messages ?? []}
                        />
                    </div>


                    {/* RIGHT SIDE */}
                    <div className="space-y-6">

                        {/* PROJECT INFO */}
                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6">

                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Project
                            </p>

                            <div className="mt-5 space-y-5">

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Service
                                    </p>

                                    <p className="mt-1 text-sm text-white/60">
                                        {project.service}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Deadline
                                    </p>

                                    <p className="mt-1 text-sm text-white/60">
                                        {project.deadline
                                            ? new Date(
                                                `${project.deadline}T00:00:00`
                                            ).toLocaleDateString(
                                                "ro-RO"
                                            )
                                            : "To be confirmed"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Created
                                    </p>

                                    <p className="mt-1 text-sm text-white/60">
                                        {new Date(
                                            project.created_at
                                        ).toLocaleDateString(
                                            "ro-RO"
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                                        Project ID
                                    </p>

                                    <p className="mt-1 break-all font-mono text-xs text-white/25">
                                        {project.id}
                                    </p>
                                </div>

                            </div>
                        </section>

                        {/* HELP */}
                        <section className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6">

                            <p className="text-xs uppercase tracking-[0.25em] text-white/25">
                                Need help?
                            </p>

                            <h3 className="mt-3 text-lg font-semibold">
                                Talk to FORMORA
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-white/30">
                                If you have questions about
                                your project, contact our team.
                            </p>

                            <a
                                href="mailto:hello@formora.ro"
                                className="mt-5 inline-flex rounded-xl border border-white/10 px-4 py-2.5 text-xs font-medium text-white/60 transition hover:border-blue-500/30 hover:text-blue-300"
                            >
                                Contact FORMORA
                            </a>

                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}