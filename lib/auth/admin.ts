import "server-only";

import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the logged-in user ONLY if their profile has role "admin".
 * Every admin page and admin API route must use this before touching
 * the service-role client, because service-role bypasses RLS.
 */
export async function getAdminUser() {
    const supabase = await createClient();

    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profileError || !profile || profile.role !== "admin") return null;

    return user;
}

/** For server pages: redirects non-admins to the given login page. */
export async function requireAdminPage(loginPath = "/admin/login") {
    const user = await getAdminUser();

    if (!user) redirect(loginPath);

    return user;
}

/** For API routes: returns a 403 response for non-admins, or null when allowed. */
export async function adminGuard() {
    const user = await getAdminUser();

    if (!user) {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    return null;
}
