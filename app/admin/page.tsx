import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import LogoutButton from "./LogoutButton";
import StatusSelect from "./StatusSelect";
import DownloadButton from "./DownloadButton";
import Link from "next/link";

const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
            created_at,
            project_request_files (
                id,
                file_name,
                storage_path,
                file_type,
                file_size
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Admin project load error:", error);

        return (
            <main className="min-h-screen bg-[#0B0B0D] px-6 py-20 text-white">
                <div className="mx-auto max-w-7xl">
                    <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                        FORMORA ADMIN
                    </p>

                    <div className="mt-10 rounded-3xl border border-red-500/20 bg-red-500/[0.05] p-6">
                        <p className="text-sm text-red-300">
                            Could not load project requests.
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0B0B0D] px-6 py-20 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-blue-400">
                            FORMORA ADMIN
                        </p>

                        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                            Project requests
                        </h1>

                        <p className="mt-4 text-white/40">
                            Manage incoming web and 3D projects.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-3">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                                Signed in as
                            </p>

                            <p className="mt-1 text-sm text-white/60">
                                {user.email}
                            </p>
                        </div>

                        <LogoutButton />
                    </div>
                </div>

                {requests?.length === 0 && (
                    <div className="rounded-[28px] border border-white/10 bg-white/[0.025] p-10 text-center">
                        <p className="text-lg text-white/60">
                            No project requests yet.
                        </p>

                        <p className="mt-2 text-sm text-white/30">
                            New requests will appear here automatically.
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {requests?.map((request) => (
                        <div
                            key={request.id}
                            className="rounded-[28px] border border-white/10 bg-white/[0.025] p-6 md:p-8"
                        >
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-300">
                                            {request.service}
                                        </span>

                                        <StatusSelect
                                            requestId={request.id}
                                            currentStatus={request.status}
                                        />
                                    </div>

                                    <h2 className="mt-5 text-2xl font-semibold">
                                        {request.name}
                                    </h2>

                                    {request.company && (
                                        <p className="mt-1 text-sm text-white/40">
                                            {request.company}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col items-start gap-3 lg:items-end">
                                    <p className="text-xs text-white/30">
                                        {new Date(
                                            request.created_at
                                        ).toLocaleString()}
                                    </p>

                                    <Link
                                        href={`/admin/projects/${request.id}`}
                                        className="rounded-xl border border-blue-500/20 bg-blue-500/[0.08] px-4 py-2 text-xs font-medium text-blue-300 transition hover:border-blue-400/40 hover:bg-blue-500/[0.14] hover:text-blue-200"
                                    >
                                        Open project →
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-8 grid gap-6 md:grid-cols-2">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                                        Contact
                                    </p>

                                    <div className="mt-3 space-y-1 text-sm text-white/60">
                                        <a
                                            href={`mailto:${request.email}`}
                                            className="block transition hover:text-blue-400"
                                        >
                                            {request.email}
                                        </a>

                                        {request.phone && (
                                            <a
                                                href={`tel:${request.phone}`}
                                                className="block transition hover:text-blue-400"
                                            >
                                                {request.phone}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {request.website_url && (
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                                            Website
                                        </p>

                                        <a
                                            href={request.website_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-3 inline-block text-sm text-blue-400 transition hover:text-blue-300"
                                        >
                                            {request.website_url}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {request.project_details && (
                                <div className="mt-8">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                                        Project details
                                    </p>

                                    <p className="mt-3 max-w-3xl whitespace-pre-wrap text-sm leading-6 text-white/55">
                                        {request.project_details}
                                    </p>
                                </div>
                            )}

                            {request.project_request_files?.length > 0 && (
                                <div className="mt-8">
                                    <p className="text-xs uppercase tracking-[0.2em] text-white/25">
                                        Files
                                    </p>

                                    <div className="mt-3 space-y-2">
                                        {request.project_request_files.map(
                                            (file) => (
                                                <div
                                                    key={file.id}
                                                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm text-white/70">
                                                            {file.file_name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-white/25">
                                                            {(
                                                                Number(
                                                                    file.file_size ??
                                                                    0
                                                                ) /
                                                                1024 /
                                                                1024
                                                            ).toFixed(2)}{" "}
                                                            MB
                                                        </p>
                                                    </div>

                                                    <DownloadButton fileId={file.id} />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}