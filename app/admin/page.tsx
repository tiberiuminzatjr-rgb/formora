import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";
import StatusSelect from "./StatusSelect";
import Link from "next/link";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const statusLabels: Record<string, string> = {
    new: "New",
    reviewing: "Reviewing",
    quote_sent: "Quote sent",
    in_progress: "In progress",
    ready: "Ready",
    completed: "Completed",
};

function formatDate(date: string | null) {
    if (!date) return "Not set";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatValue(
    value: number | string | null,
    currency: string | null
) {
    if (value === null || value === undefined) return "Not set";

    const amount = Number(value);

    if (Number.isNaN(amount)) return "Not set";

    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: currency || "RON",
        maximumFractionDigits: 0,
    }).format(amount);
}

export default async function AdminPage() {
    const supabase = await createServerClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        redirect("/admin/login");
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile || profile.role !== "admin") {
        redirect("/");
    }

    const { data: requests, error } = await adminSupabase
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
            client_id,
            created_at,
            project_request_files (
                id
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Admin project load error:", error);

        return (
            <main className="min-h-screen bg-[#0B0B0D] px-5 py-16 text-white md:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                        FORMORA ADMIN
                    </p>

                    <div className="mt-10 rounded-[28px] border border-red-500/20 bg-red-500/[0.05] p-6">
                        <p className="text-sm text-red-300">
                            Could not load project requests.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    const projects = requests ?? [];

    const totalProjects = projects.length;

    const activeProjects = projects.filter((project) =>
        ["reviewing", "quote_sent", "in_progress"].includes(project.status)
    ).length;

    const readyProjects = projects.filter(
        (project) => project.status === "ready"
    ).length;

    const completedProjects = projects.filter(
        (project) => project.status === "completed"
    ).length;

    return (
        <main className="min-h-screen bg-[#0B0B0D] text-white">
            {/* TOP BAR */}
            <header className="border-b border-white/[0.08]">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
                    <Link
                        href="/"
                        className="text-xl font-semibold tracking-[0.22em] text-white"
                    >
                        FORMORA
                    </Link>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                                Administrator
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-white/50">
                                {user.email}
                            </p>
                        </div>

                        <LogoutButton />
                    </div>
                </div>
            </header>

            <div className="mx-auto max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
                {/* HERO */}
                <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-white/[0.055] via-white/[0.025] to-blue-500/[0.06] p-7 md:p-10">
                    <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

                    <div className="relative">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_16px_rgba(96,165,250,0.9)]" />

                                    <p className="text-[11px] uppercase tracking-[0.32em] text-blue-400">
                                        Admin portal
                                    </p>
                                </div>

                                <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.045em] md:text-5xl lg:text-6xl">
                                    Project overview.
                                </h1>

                                <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 md:text-base">
                                    Manage clients, quotes, deadlines and active
                                    FORMORA projects from one place.
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href="#projects"
                                    className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
                                >
                                    View projects
                                </a>

                                <Link
                                    href="/"
                                    className="rounded-full border border-white/10 bg-white/[0.025] px-5 py-3 text-sm text-white/60 transition hover:border-white/20 hover:text-white"
                                >
                                    Website
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* STATS */}
                <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        label="Total projects"
                        value={totalProjects}
                        detail="All requests"
                    />

                    <StatCard
                        label="Active"
                        value={activeProjects}
                        detail="Currently moving"
                        highlight
                    />

                    <StatCard
                        label="Ready"
                        value={readyProjects}
                        detail="Ready to deliver"
                    />

                    <StatCard
                        label="Completed"
                        value={completedProjects}
                        detail="Finished projects"
                    />
                </section>

                {/* PROJECTS */}
                <section id="projects" className="mt-16">
                    <div className="flex flex-col gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-blue-400">
                                Workspace
                            </p>

                            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em]">
                                Projects
                            </h2>

                            <p className="mt-2 text-sm text-white/35">
                                {totalProjects === 1
                                    ? "1 project in your workspace."
                                    : `${totalProjects} projects in your workspace.`}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-white/40">
                                New {projects.filter((p) => p.status === "new").length}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/[0.025] px-4 py-2 text-xs text-white/40">
                                Active {activeProjects}
                            </span>
                        </div>
                    </div>

                    {projects.length === 0 ? (
                        <div className="mt-6 rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-12 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-white/30">
                                +
                            </div>

                            <p className="mt-5 text-lg font-medium text-white/70">
                                No projects yet.
                            </p>

                            <p className="mt-2 text-sm text-white/30">
                                New requests will appear here automatically.
                            </p>
                        </div>
                    ) : (
                        <div className="mt-6 grid gap-4">
                            {projects.map((project) => {
                                const fileCount =
                                    project.project_request_files?.length ?? 0;

                                return (
                                    <article
                                        key={project.id}
                                        className="group relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.02] transition duration-300 hover:border-white/[0.15] hover:bg-white/[0.035]"
                                    >
                                        <div className="absolute bottom-0 left-0 top-0 w-[2px] bg-gradient-to-b from-blue-400/80 via-blue-500/30 to-transparent opacity-0 transition group-hover:opacity-100" />

                                        <div className="p-6 md:p-8">
                                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="rounded-full border border-blue-500/15 bg-blue-500/[0.08] px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-blue-300">
                                                            {project.service}
                                                        </span>

                                                        {project.client_id && (
                                                            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/15 bg-emerald-500/[0.06] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-emerald-300/80">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                                                Client linked
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="mt-5 truncate text-2xl font-semibold tracking-[-0.025em] text-white">
                                                        {project.company ||
                                                            project.name}
                                                    </h3>

                                                    <p className="mt-2 text-sm text-white/35">
                                                        {project.company
                                                            ? project.name
                                                            : project.email}
                                                    </p>
                                                </div>

                                                <div className="flex shrink-0 flex-wrap items-center gap-3">
                                                    <StatusSelect
                                                        requestId={project.id}
                                                        currentStatus={
                                                            project.status
                                                        }
                                                    />

                                                    <Link
                                                        href={`/admin/projects/${project.id}`}
                                                        className="rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-blue-400 hover:text-white"
                                                    >
                                                        Open project →
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="mt-8 grid grid-cols-2 gap-5 border-t border-white/[0.07] pt-6 md:grid-cols-5">
                                                <ProjectInfo
                                                    label="Client"
                                                    value={project.name}
                                                />

                                                <ProjectInfo
                                                    label="Status"
                                                    value={
                                                        statusLabels[
                                                            project.status
                                                            ] ?? project.status
                                                    }
                                                />

                                                <ProjectInfo
                                                    label="Deadline"
                                                    value={formatDate(
                                                        project.deadline
                                                    )}
                                                    warning={
                                                        !!project.deadline &&
                                                        new Date(
                                                            project.deadline
                                                        ) < new Date() &&
                                                        project.status !==
                                                        "completed"
                                                    }
                                                />

                                                <ProjectInfo
                                                    label="Value"
                                                    value={formatValue(
                                                        project.project_value,
                                                        project.currency
                                                    )}
                                                />

                                                <ProjectInfo
                                                    label="Files"
                                                    value={`${fileCount} ${
                                                        fileCount === 1
                                                            ? "file"
                                                            : "files"
                                                    }`}
                                                />
                                            </div>

                                            <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-xs text-white/25">
                                                    Received{" "}
                                                    {formatDate(
                                                        project.created_at
                                                    )}
                                                </p>

                                                <a
                                                    href={`mailto:${project.email}`}
                                                    className="truncate text-xs text-white/35 transition hover:text-blue-400"
                                                >
                                                    {project.email}
                                                </a>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}

function StatCard({
                      label,
                      value,
                      detail,
                      highlight = false,
                  }: {
    label: string;
    value: number;
    detail: string;
    highlight?: boolean;
}) {
    return (
        <div
            className={`relative overflow-hidden rounded-[24px] border p-5 md:p-6 ${
                highlight
                    ? "border-blue-500/20 bg-blue-500/[0.055]"
                    : "border-white/[0.08] bg-white/[0.02]"
            }`}
        >
            {highlight && (
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-blue-500/10 blur-3xl" />
            )}

            <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                    {label}
                </p>

                <p className="mt-5 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                    {value}
                </p>

                <p className="mt-2 text-xs text-white/25">{detail}</p>
            </div>
        </div>
    );
}

function ProjectInfo({
                         label,
                         value,
                         warning = false,
                     }: {
    label: string;
    value: string;
    warning?: boolean;
}) {
    return (
        <div className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                {label}
            </p>

            <p
                className={`mt-2 truncate text-sm ${
                    warning ? "text-orange-300" : "text-white/65"
                }`}
            >
                {value}
            </p>
        </div>
    );
}