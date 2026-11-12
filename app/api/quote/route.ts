import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendQuoteEmails } from "@/lib/quote-emails";

export const runtime = "nodejs";

const allowedServices = new Set([
    "New Website",
    "Website Redesign",
    "3D Scanning",
    "3D Printing",
    "Scan & Reproduce",
]);
const allowedPackages = new Set([
    "Start", "Business", "Online store",
    "Redesign: Refresh", "Redesign: Complete", "Redesign: Online store",
    "Not sure",
]);
const allowedExtensions = new Set([
    "stl", "step", "stp", "obj", "jpg", "jpeg", "png", "webp", "heic",
]);
// Vercel Functions have a request-body size limit. Leave room for multipart overhead.
const MAX_TOTAL_FILES = 3 * 1024 * 1024;
const MAX_FILES = 5;

function textField(form: FormData, key: string, limit: number) {
    const raw = form.get(key);
    if (raw !== null && typeof raw !== "string") return null;
    const value = (raw ?? "").toString().trim();
    return value.length <= limit ? value : null;
}

function jsonError(message: string, status: number) {
    return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request) {
    try {
        const origin = request.headers.get("origin");
        const host = request.headers.get("host");
        // Prevent ordinary cross-origin form submission. This is not rate limiting.
        if (origin && host && new URL(origin).host !== host) {
            return jsonError("Invalid origin.", 403);
        }

        const contentType = request.headers.get("content-type") ?? "";
        if (!contentType.includes("multipart/form-data")) {
            return jsonError("Expected form data.", 415);
        }

        const form = await request.formData();
        const service = textField(form, "service", 100);
        const name = textField(form, "name", 160);
        const company = textField(form, "company", 160);
        const email = textField(form, "email", 254);
        const phone = textField(form, "phone", 60);
        const websiteUrl = textField(form, "website_url", 500);
        const projectDetails = textField(form, "project_details", 10000);
        const language = form.get("language") === "en" ? "en" : "ro";
        const rawPackage = textField(form, "package", 40);
        const selectedPackage = rawPackage && allowedPackages.has(rawPackage) ? rawPackage : "";

        if ([service, name, company, email, phone, websiteUrl, projectDetails].some((x) => x === null)) {
            return jsonError("One or more fields are too long or invalid.", 400);
        }
        if (!service || !allowedServices.has(service)) {
            return jsonError("Please select a valid service.", 400);
        }
        if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return jsonError("Please enter a valid name and email.", 400);
        }

        const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
        if (files.length > MAX_FILES || files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_FILES) {
            return jsonError("Maximum 5 files and 3 MB combined.", 413);
        }
        for (const file of files) {
            const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
            if (!allowedExtensions.has(extension)) {
                return jsonError(`Unsupported file type: ${file.name}`, 400);
            }
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            console.error("Missing Supabase server environment variables");
            return jsonError("Server configuration error.", 503);
        }
        const supabase = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: project, error: insertError } = await supabase
            .from("project_requests")
            .insert({
                service,
                name,
                company: company || null,
                email,
                phone: phone || null,
                website_url: websiteUrl || null,
                // No DB column for the package: keep it at the top of the details, visible in admin.
                project_details:
                    [selectedPackage ? `Pachet: ${selectedPackage}` : "", projectDetails ?? ""]
                        .filter(Boolean)
                        .join("\n\n") || null,
                status: "new",
            })
            .select("id")
            .single();

        if (insertError || !project) {
            console.error("Public quote insert failed:", insertError);
            return jsonError("Could not save your request.", 500);
        }

        // Record already exists. Never claim full success if an attachment fails.
        for (const file of files) {
            const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180);
            const storagePath = `${project.id}/${crypto.randomUUID()}-${safeName}`;
            const { error: uploadError } = await supabase.storage
                .from("project-files")
                .upload(storagePath, file, {
                    contentType: file.type || "application/octet-stream",
                    upsert: false,
                });
            if (uploadError) {
                console.error("Public quote attachment upload failed:", uploadError);
                return jsonError("Request saved, but an attachment failed. Please contact us; do not submit again.", 500);
            }
            const { error: metadataError } = await supabase
                .from("project_request_files")
                .insert({
                    request_id: project.id,
                    file_name: file.name,
                    storage_path: storagePath,
                    file_type: file.type || null,
                    file_size: file.size,
                });
            if (metadataError) {
                console.error("Public quote attachment metadata failed:", metadataError);
                await supabase.storage.from("project-files").remove([storagePath]);
                return jsonError("Request saved, but an attachment failed. Please contact us; do not submit again.", 500);
            }
        }

        // Notify you + confirm to the client. Errors are logged, never shown to the visitor.
        await sendQuoteEmails({
            requestId: project.id,
            service,
            name,
            company: company ?? "",
            email,
            phone: phone ?? "",
            websiteUrl: websiteUrl ?? "",
            projectDetails: projectDetails ?? "",
            package: selectedPackage,
            fileNames: files.map((file) => file.name),
            language,
        });

        return NextResponse.json({ success: true, requestId: project.id }, { status: 201 });
    } catch (error) {
        console.error("Public quote API error:", error);
        return jsonError("Could not process your request.", 500);
    }
}