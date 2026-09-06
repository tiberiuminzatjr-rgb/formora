import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import ClientLogoutButton from "./ClientLogoutButton";

const statusLabels: Record<string, string> = {
    new: "New",
    reviewing: "Reviewing",
    quote_sent: "Quote sent",
    in_progress: "In progress",
    ready: "Ready",
    completed: "Completed",
};

const statusStyles: Record<string, string> = {
    new:
        "border-white/10 bg-white/[0.04] text-white/50",

    reviewing:
        "border-amber-500/20 bg-amber-500/10 text-amber-300",

    quote_sent:
        "border-violet-500/20 bg-violet-500/10 text-violet-300",

    in_progress:
        "border-blue-500/20 bg-blue-500/10 text-blue-300",

    ready:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",

    completed:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
};

const statusOrder = [
    "new",
    "reviewing",
    "quote_sent",
    "in_progress",
    "ready",
    "completed",
];

function formatDate(
    date: string | null
) {
    if (!date) {
        return "To be confirmed";
    }

    return new Date(
        `${date}T00:00:00`
    ).toLocaleDateString(
        "ro-RO",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );
}

export default async function ClientPage() {
    const supabase =
        await createServerClient();

    /*
     * AUTH
     */
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/client/login");
    }

    /*
     * CLIENT PROFILE
     */
    const {
        data: profile,
        error: profileError,
    } = await supabase
        .from("profiles")
        .select(
            "role, full_name"
        )
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
     * PROJECTS
     *
     * Important:
     * uses authenticated client
     * + Supabase RLS.
     */
    const {
        data: projects,
        error: projectsError,
    } = await supabase
        .from("project_requests")
        .select(`
            id,
            service,
            company,
            project_details,
            status,
            deadline,
            created_at,

            project_quotes (
                id,
                amount,
                currency,
                status
            ),

            project_request_files (
                id
            )
        `)
        .order(
            "created_at",
            {
                ascending: false,
            }
        );

    if (projectsError) {
        console.error(
            "Client projects error:",
            projectsError
        );
    }

    const projectList =
        projects ?? [];

    const activeProjects =
        projectList.filter(
            (project) =>
                project.status !==
                "completed"
        ).length;

    const completedProjects =
        projectList.filter(
            (project) =>
                project.status ===
                "completed"
        ).length;

    const readyProjects =
        projectList.filter(
            (project) =>
                project.status ===
                "ready"
        ).length;

    const firstName =
        profile.full_name
            ?.trim()
            .split(" ")[0] ||
        "there";

    return (
        <main className="min-h-screen bg-[#0B0B0D] text-white">

            {/* NAVIGATION */}
            <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#0B0B0D]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    <Link
                        href="/"
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10">
                            <span className="text-sm font-bold text-blue-400">
                                F
                            </span>
                        </div>

                        <span className="text-sm font-semibold tracking-[0.22em]">
                            FORMORA
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">

                        <div className="hidden text-right sm:block">
                            <p className="text-xs text-white/55">
                                {profile.full_name ||
                                    user.email}
                            </p>

                            <p className="mt-0.5 text-[10px] uppercase tracking-[0.15em] text-white/20">
                                Client
                            </p>
                        </div>

                        <ClientLogoutButton />
                    </div>

                </div>
            </header>

            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">

                {/* HERO */}
                <section className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-white/[0.025] px-7 py-10 md:px-10 md:py-12">

                    <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-blue-500/10 blur-[100px]" />

                    <div className="relative">

                        <p className="text-[11px] uppercase tracking-[0.35em] text-blue-400">
                            Client Portal
                        </p>

                        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
                            Welcome back,
                            <br />
                            <span className="text-white/45">
                                {firstName}.
                            </span>
                        </h1>

                        <p className="mt-5 max-w-xl text-sm leading-7 text-white/35">
                            Track projects,
                            review quotes,
                            exchange files and
                            communicate with
                            FORMORA from one
                            place.
                        </p>

                    </div>
                </section>

                {/* STATS */}
                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                            Total projects
                        </p>

                        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                            {projectList.length}
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                            Active
                        </p>

                        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-blue-400">
                            {activeProjects}
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                            Ready
                        </p>

                        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-emerald-400">
                            {readyProjects}
                        </p>
                    </div>

                    <div className="rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">
                            Completed
                        </p>

                        <p className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white/55">
                            {completedProjects}
                        </p>
                    </div>

                </section>

                {/* PROJECTS */}
                <section className="mt-14">

                    <div className="flex items-end justify-between gap-6">

                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400/70">
                                Workspace
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">
                                Your projects
                            </h2>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-white/30">
                            {projectList.length}{" "}
                            {projectList.length ===
                            1
                                ? "project"
                                : "projects"}
                        </span>

                    </div>

                    {projectList.length >
                    0 ? (
                        <div className="mt-7 grid gap-5 xl:grid-cols-2">

                            {projectList.map(
                                (project) => {

                                    const quote =
                                        project
                                            .project_quotes?.[0] ??
                                        null;

                                    const visibleQuote =
                                        quote &&
                                        quote.status !==
                                        "draft"
                                            ? quote
                                            : null;

                                    const fileCount =
                                        project
                                            .project_request_files
                                            ?.length ??
                                        0;

                                    const currentIndex =
                                        Math.max(
                                            statusOrder.indexOf(
                                                project.status
                                            ),
                                            0
                                        );

                                    const progress =
                                        Math.round(
                                            ((currentIndex +
                                                    1) /
                                                statusOrder.length) *
                                            100
                                        );

                                    return (
                                        <Link
                                            key={
                                                project.id
                                            }
                                            href={`/client/projects/${project.id}`}
                                            className="group relative overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-500/25 hover:bg-white/[0.04] md:p-7"
                                        >

                                            <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-500/[0.06] blur-[70px] transition group-hover:bg-blue-500/[0.12]" />

                                            <div className="relative">

                                                {/* TOP */}
                                                <div className="flex items-start justify-between gap-5">

                                                    <div className="min-w-0">
                                                        <p className="text-[10px] uppercase tracking-[0.25em] text-blue-400/70">
                                                            {
                                                                project.service
                                                            }
                                                        </p>

                                                        <h3 className="mt-3 truncate text-xl font-semibold tracking-[-0.03em]">
                                                            {
                                                                project.service
                                                            }
                                                        </h3>

                                                        {project.company && (
                                                            <p className="mt-1 text-xs text-white/25">
                                                                {
                                                                    project.company
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span
                                                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
                                                            statusStyles[
                                                                project.status
                                                                ] ||
                                                            statusStyles.new
                                                        }`}
                                                    >
                                                        {statusLabels[
                                                                project.status
                                                                ] ||
                                                            project.status}
                                                    </span>

                                                </div>

                                                {/* DESCRIPTION */}
                                                <p className="mt-6 line-clamp-2 min-h-12 text-sm leading-6 text-white/35">
                                                    {project.project_details ||
                                                        "FORMORA project."}
                                                </p>

                                                {/* PROGRESS */}
                                                <div className="mt-7">

                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span className="uppercase tracking-[0.18em] text-white/20">
                                                            Progress
                                                        </span>

                                                        <span className="text-white/35">
                                                            {
                                                                progress
                                                            }
                                                            %
                                                        </span>
                                                    </div>

                                                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                                                        <div
                                                            className="h-full rounded-full bg-blue-500 transition-all"
                                                            style={{
                                                                width: `${progress}%`,
                                                            }}
                                                        />
                                                    </div>

                                                </div>

                                                {/* INFO */}
                                                <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-5">

                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.16em] text-white/15">
                                                            Deadline
                                                        </p>

                                                        <p className="mt-2 truncate text-xs text-white/50">
                                                            {formatDate(
                                                                project.deadline
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.16em] text-white/15">
                                                            Quote
                                                        </p>

                                                        <p className="mt-2 truncate text-xs text-white/50">
                                                            {visibleQuote
                                                                ? `${Number(
                                                                    visibleQuote.amount
                                                                ).toLocaleString(
                                                                    "ro-RO"
                                                                )} ${
                                                                    visibleQuote.currency
                                                                }`
                                                                : "Pending"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[9px] uppercase tracking-[0.16em] text-white/15">
                                                            Files
                                                        </p>

                                                        <p className="mt-2 text-xs text-white/50">
                                                            {
                                                                fileCount
                                                            }
                                                        </p>
                                                    </div>

                                                </div>

                                                {/* FOOTER */}
                                                <div className="mt-7 flex items-center justify-between">

                                                    <p className="text-[10px] text-white/15">
                                                        Created{" "}
                                                        {new Date(
                                                            project.created_at
                                                        ).toLocaleDateString(
                                                            "ro-RO"
                                                        )}
                                                    </p>

                                                    <span className="text-sm font-medium text-blue-400 transition group-hover:translate-x-1 group-hover:text-blue-300">
                                                        Open project
                                                        →
                                                    </span>

                                                </div>

                                            </div>
                                        </Link>
                                    );
                                }
                            )}

                        </div>
                    ) : (
                        <div className="mt-7 rounded-[30px] border border-dashed border-white/10 bg-white/[0.015] px-6 py-16 text-center">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                                <span className="text-xl text-white/25">
                                    +
                                </span>
                            </div>

                            <h3 className="mt-5 text-lg font-medium text-white/60">
                                No projects yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/25">
                                Your FORMORA projects
                                will appear here once
                                they are connected to
                                your account.
                            </p>

                            <Link
                                href="/#contact"
                                className="mt-6 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400"
                            >
                                Start a project
                            </Link>

                        </div>
                    )}

                    {projectsError && (
                        <div className="mt-6 rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-4">
                            <p className="text-xs text-red-300">
                                Projects could not
                                be loaded. Please
                                refresh the page.
                            </p>
                        </div>
                    )}

                </section>

                {/* FOOTER */}
                <footer className="mt-20 border-t border-white/[0.07] py-8">

                    <div className="flex flex-col gap-4 text-xs text-white/20 sm:flex-row sm:items-center sm:justify-between">

                        <p>
                            FORMORA · Digital
                            ideas. Made real.
                        </p>

                        <Link
                            href="/#contact"
                            className="transition hover:text-white/50"
                        >
                            Need help? Contact us
                            →
                        </Link>

                    </div>

                </footer>

            </div>
        </main>
    );
}